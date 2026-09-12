import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'https://api-worknexus.virtuallabsimulator.com/api';

interface JobPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function JobPostModal({ isOpen, onClose, onSuccess }: JobPostModalProps) {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    salary: '',
    experience: '',
    type: 'DIRECT'
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/hiring/jobs`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert('Failed to create job post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Create New Job Post</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
              <input
                required
                className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder="e.g. Senior Software Engineer"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Type *</label>
                <select
                  className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                >
                  <option value="DIRECT">Direct Job</option>
                  <option value="INTERNSHIP">Internship</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience Required</label>
                <input
                  className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
                  value={formData.experience}
                  onChange={e => setFormData({...formData, experience: e.target.value})}
                  placeholder="e.g. 3-5 years"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salary / Stipend</label>
              <input
                className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
                value={formData.salary}
                onChange={e => setFormData({...formData, salary: e.target.value})}
                placeholder="e.g. $80k - $100k or $500/month"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Description *</label>
              <textarea
                required
                rows={6}
                className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Detailed job description and requirements..."
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button 
                type="button" 
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                onClick={onClose} 
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Job Post'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
