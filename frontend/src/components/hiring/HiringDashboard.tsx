import { useState, useEffect } from 'react';
import { Plus, Briefcase, Share2, Users, FileText } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import JobPostModal from './JobPostModal';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'https://api-worknexus.virtuallabsimulator.com/api';

export default function HiringDashboard() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { token } = useAuth();

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${API_URL}/hiring/jobs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(res.data.jobs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const copyPublicLink = (jobId: string) => {
    const url = `${window.location.origin}/#/careers/apply/${jobId}`;
    navigator.clipboard.writeText(url);
    alert('Public application link copied to clipboard!');
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 w-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hiring & Recruitment</h1>
          <p className="text-gray-500">Manage job postings and screen candidates</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Job Post
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p>Loading...</p>
        ) : jobs.length === 0 ? (
          <div className="col-span-full bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 flex flex-col items-center justify-center py-12">
              <Briefcase className="w-12 h-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No active job posts</h3>
              <p className="text-gray-500 mt-1">Create a new job post to start accepting applications.</p>
            </div>
          </div>
        ) : (
          jobs.map(job => (
            <div key={job.id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-4 pb-3 border-b border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${
                      job.type === 'INTERNSHIP' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {job.type}
                    </span>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    job.status === 'OPEN' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {job.status}
                  </span>
                </div>
              </div>
              <div className="p-4 pt-4">
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="w-4 h-4 mr-2" />
                    {job._count?.applications || 0} Applications
                  </div>
                  {job.experience && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Briefcase className="w-4 h-4 mr-2" />
                      {job.experience}
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button 
                    className="flex-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-md text-sm font-medium"
                    onClick={() => navigate(`/hiring/jobs/${job.id}`)}
                  >
                    View Details
                  </button>
                  <button 
                    className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-2 rounded-md"
                    onClick={() => copyPublicLink(job.id)}
                    title="Copy Public Link"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <JobPostModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchJobs} 
      />
    </div>
  );
}
