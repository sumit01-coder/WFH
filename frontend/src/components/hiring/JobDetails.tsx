import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, Download, CheckCircle, XCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://api-worknexus.virtuallabsimulator.com/api';

export default function JobDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { token } = useAuth();

  const fetchDetails = async () => {
    try {
      const res = await axios.get(`${API_URL}/hiring/jobs/${id}/applications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const updateStatus = async (applicationId: string, status: string) => {
    try {
      await axios.put(`${API_URL}/hiring/applications/${applicationId}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDetails();
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!data?.job) return <div>Job not found</div>;

  const { job, applications } = data;

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center space-x-4">
        <button 
          className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center text-sm font-medium"
          onClick={() => navigate('/hiring')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
          <p className="text-gray-500">Manage applications for this role</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium">Applications ({applications.length})</h3>
        </div>
        <div className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Candidate</th>
                  <th className="px-6 py-3">Contact</th>
                  {job.type === 'INTERNSHIP' && (
                    <>
                      <th className="px-6 py-3">Department</th>
                      <th className="px-6 py-3">CGPA / Year</th>
                      <th className="px-6 py-3">Tech Stack</th>
                    </>
                  )}
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Applied</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app: any) => (
                  <tr key={app.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {app.name}
                    </td>
                    <td className="px-6 py-4">
                      {app.email}<br/>
                      <span className="text-xs text-gray-400">{app.phone}</span>
                    </td>
                    {job.type === 'INTERNSHIP' && (
                      <>
                        <td className="px-6 py-4">{app.department || '-'}</td>
                        <td className="px-6 py-4">
                          {app.cgpa || '-'} / {app.passingYear || '-'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-[150px] truncate" title={app.technologyKnowledge}>
                            {app.technologyKnowledge || '-'}
                          </div>
                        </td>
                      </>
                    )}
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        app.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        app.status === 'SHORTLISTED' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button 
                          className="p-1.5 text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50"
                          onClick={() => window.open((import.meta.env.VITE_API_URL || 'https://api-worknexus.virtuallabsimulator.com/api').replace(/\/api\/?$/, '') + app.resumeUrl, '_blank')}
                          title="View Resume"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        {app.status === 'PENDING' && (
                          <>
                            <button 
                              className="p-1.5 text-green-600 bg-white border border-gray-300 rounded hover:bg-gray-50 hover:text-green-700"
                              onClick={() => updateStatus(app.id, 'SHORTLISTED')}
                              title="Shortlist"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button 
                              className="p-1.5 text-red-600 bg-white border border-gray-300 rounded hover:bg-gray-50 hover:text-red-700"
                              onClick={() => updateStatus(app.id, 'REJECTED')}
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {applications.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                      No applications received yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
