import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Briefcase, Building, CheckCircle, Upload } from 'lucide-react';

// A simple public axios instance since this route doesn't need auth token
const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api-worknexus.virtuallabsimulator.com/api',
});

export default function JobApplicationPage() {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    technologyKnowledge: '',
    cgpa: '',
    passingYear: '',
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await publicApi.get(`/public/jobs/${id}`);
        setJob(res.data.job);
      } catch (err) {
        console.error(err);
        setError('Job post not found or is no longer accepting applications.');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFile) {
      alert('Please upload your resume');
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      data.append('resume', resumeFile);

      await publicApi.post(`/public/jobs/${id}/apply`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setSubmitted(true);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;
  if (error || !job) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-500">{error}</div>;

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Application Submitted!</h2>
          <p className="text-gray-600">
            Thank you for applying to {job.company.name}. We have received your application and will review it shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-8 border-b border-gray-200 sm:px-10">
            <div className="flex items-center justify-between mb-4">
              {job.company.logoUrl ? (
                <img src={job.company.logoUrl} alt={job.company.name} className="h-12 w-auto" />
              ) : (
                <div className="flex items-center text-gray-500">
                  <Building className="w-8 h-8 mr-2" />
                  <span className="text-xl font-bold">{job.company.name}</span>
                </div>
              )}
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {job.type}
              </span>
            </div>
            
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{job.title}</h1>
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              {job.experience && (
                <span className="flex items-center"><Briefcase className="w-4 h-4 mr-1"/> {job.experience}</span>
              )}
              {job.salary && (
                <span className="flex items-center">Salary: {job.salary}</span>
              )}
            </div>
          </div>
          
          <div className="px-6 py-6 sm:px-10 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Job Description</h3>
            <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
              {job.description}
            </div>
          </div>
        </div>

        {/* Application Form */}
        <div className="bg-white shadow rounded-lg px-6 py-8 sm:px-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Apply Now</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input required className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <input required type="email" className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
                  value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input required type="tel" className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
                  value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
            </div>

            {job.type === 'INTERNSHIP' && (
              <>
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Academic & Technical Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Department / Degree *</label>
                      <input required className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
                        placeholder="e.g. B.Tech Computer Science"
                        value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CGPA / Percentage *</label>
                      <input required className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
                        placeholder="e.g. 8.5 or 85%"
                        value={formData.cgpa} onChange={e => setFormData({...formData, cgpa: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Passing Year *</label>
                      <input required className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
                        placeholder="e.g. 2024"
                        value={formData.passingYear} onChange={e => setFormData({...formData, passingYear: e.target.value})} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Technology Knowledge *</label>
                      <textarea required rows={3} className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
                        placeholder="e.g. React, Node.js, Python, SQL"
                        value={formData.technologyKnowledge} onChange={e => setFormData({...formData, technologyKnowledge: e.target.value})} />
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="border-t border-gray-200 pt-6 mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Resume / CV *</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md relative hover:bg-gray-50 transition-colors">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                      <span>Upload a file</span>
                      <input id="file-upload" type="file" className="sr-only" accept=".pdf,.doc,.docx"
                        onChange={e => setResumeFile(e.target.files?.[0] || null)} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                  {resumeFile && (
                    <p className="text-sm text-green-600 font-medium mt-2">Selected: {resumeFile.name}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button type="submit" className="w-full flex justify-center py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium" disabled={submitting}>
                {submitting ? 'Submitting Application...' : 'Submit Application'}
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
}
