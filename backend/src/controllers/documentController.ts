import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { AuthRequest } from '../middleware/requireAuth';

const prisma = new PrismaClient();

// Get all documents for the company
export const getDocuments = async (req: AuthRequest, res: Response) => {
  try {
    const { companyId } = req.user!;
    
    // Fetch files with resourceType 'COMPANY_DOCUMENT'
    const files = await prisma.file.findMany({
      where: {
        companyId,
        resourceType: 'COMPANY_DOCUMENT',
        isDeleted: false
      },
      include: {
        uploadedBy: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(files);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
};

// Upload a document
export const uploadDocument = async (req: AuthRequest, res: Response) => {
  try {
    const { companyId, userId } = req.user!;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const newFile = await prisma.file.create({
      data: {
        companyId,
        uploadedById: userId,
        resourceType: 'COMPANY_DOCUMENT',
        resourceId: companyId, // using companyId as resourceId for general docs
        originalName: file.originalname,
        storedName: file.filename,
        filePath: file.path,
        mimeType: file.mimetype,
        sizeBytes: BigInt(file.size),
      }
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { firstName: true, lastName: true }
    });

    // We can't easily serialize BigInt to JSON directly, so we convert it to string
    const responseFile = {
      ...newFile,
      sizeBytes: newFile.sizeBytes.toString(),
      uploadedBy: user || { firstName: 'Unknown', lastName: 'User' }
    };

    res.status(201).json(responseFile);
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({ error: 'Failed to upload document' });
  }
};

// Download a document
export const downloadDocument = async (req: AuthRequest, res: Response) => {
  try {
    const { companyId } = req.user!;
    const { id } = req.params;

    const file = await prisma.file.findFirst({
      where: {
        id,
        companyId,
        isDeleted: false
      }
    });

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    const filePath = path.resolve(file.filePath);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found on disk' });
    }

    res.download(filePath, file.originalName);
  } catch (error) {
    console.error('Error downloading document:', error);
    res.status(500).json({ error: 'Failed to download document' });
  }
};
