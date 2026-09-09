import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext'
import { Monitor, Camera, Clock, User, ChevronDown } from 'lucide-react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

interface ActivityLog {
  id: string
  appName: string
  windowTitle: string
  durationSec: number
  isIdle: boolean
  recordedAt: string
  user: { id: string; firstName: string; lastName: string; photoUrl?: string }
}

interface Screenshot {
  id: string
  filePath: string
  takenAt: string
  user: { id: string; firstName: string; lastName: string }
}

interface Employee {
  id: string
  firstName: string
  lastName: string
}

const APP_COLORS: Record<string, string> = {
  chrome: '#4285F4',
  firefox: '#FF7139',
  msedge: '#0078D4',
  code: '#007ACC',
  devenv: '#7B2D8B',
  winword: '#2B579A',
  excel: '#217346',
  powerpnt: '#D24726',
  slack: '#4A154B',
  teams: '#464EB8',
  zoom: '#2D8CFF',
  explorer: '#FFB900',
  cmd: '#000000',
  powershell: '#012456',
}

function getAppColor(appName: string) {
  const key = appName.toLowerCase()
  for (const [name, color] of Object.entries(APP_COLORS)) {
    if (key.includes(name)) return color
  }
  return '#6366f1'
}

function formatDuration(sec: number) {
  if (sec < 60) return `${sec}s`
  if (sec < 3600) return `${Math.floor(sec / 60)}m ${sec % 60}s`
  return `${Math.floor(sec / 3600)}h ${Math.floor((sec % 3600) / 60)}m`
}

export default function ActivityMonitor() {
  const { user, token } = useAuth()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [selectedEmployee, setSelectedEmployee] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [appSummary, setAppSummary] = useState<Record<string, number>>({})
  const [screenshots, setScreenshots] = useState<Screenshot[]>([])
  const [tab, setTab] = useState<'timeline' | 'screenshots'>('timeline')
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedAppFilter, setSelectedAppFilter] = useState<string | null>(null)
  const ITEMS_PER_PAGE = 15

  const isHROrManager = user?.role === 'HR' || user?.role === 'MANAGER' || user?.role === 'COMPANY_ADMIN'

  useEffect(() => {
    if (isHROrManager) {
      axios.get(`${API}/employees`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => setEmployees(r.data?.employees || r.data || []))
        .catch(() => {})
    }
  }, [isHROrManager, token])

  useEffect(() => {
    setCurrentPage(1)
    fetchData(false)

    // Auto-refresh data every 10 seconds
    const interval = setInterval(() => {
      fetchData(true)
    }, 10000)

    return () => clearInterval(interval)
  }, [selectedEmployee, selectedDate])

  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true)
    try {
      const params: Record<string, string> = { date: selectedDate }
      if (selectedEmployee) params.userId = selectedEmployee

      const [logsRes, ssRes] = await Promise.all([
        axios.get(`${API}/monitor/activity`, { params, headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/monitor/screenshots`, { params, headers: { Authorization: `Bearer ${token}` } }),
      ])
      setLogs(logsRes.data.logs || [])
      setAppSummary(logsRes.data.appSummary || {})
      setScreenshots(ssRes.data.screenshots || [])
    } catch {
      setLogs([])
      setAppSummary({})
    } finally {
      if (!silent) setLoading(false)
    }
  }

  const totalSec = Object.values(appSummary).reduce((a, b) => a + b, 0)
  const sortedApps = Object.entries(appSummary).sort((a, b) => b[1] - a[1])

  const filteredLogs = selectedAppFilter ? logs.filter(l => l.appName === selectedAppFilter) : logs
  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE)
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-600/20 border border-indigo-500/30">
            <Monitor className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Activity Monitor</h1>
            <p className="text-gray-400 text-sm">Desktop app usage tracking</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          {isHROrManager && (
            <div className="relative">
              <select
                value={selectedEmployee}
                onChange={e => setSelectedEmployee(e.target.value)}
                className="appearance-none bg-gray-800 border border-gray-700 text-white px-4 py-2 pr-10 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
              >
                <option value="">All Employees</option>
                {employees.map(e => (
                  <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          )}
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <p className="text-gray-400 text-sm">Total Active Time</p>
          <p className="text-2xl font-bold mt-1 text-indigo-400">{formatDuration(totalSec)}</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <p className="text-gray-400 text-sm">Apps Used</p>
          <p className="text-2xl font-bold mt-1 text-emerald-400">{sortedApps.length}</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <p className="text-gray-400 text-sm">Screenshots Taken</p>
          <p className="text-2xl font-bold mt-1 text-amber-400">{screenshots.length}</p>
        </div>
      </div>

      {/* App Usage Breakdown */}
      {sortedApps.length > 0 && (
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800 mb-6">
          <h2 className="font-semibold text-gray-200 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4" /> App Usage Breakdown
          </h2>
          <div className="space-y-3">
            {sortedApps.slice(0, 10).map(([app, sec]) => {
              const pct = totalSec > 0 ? Math.round((sec / totalSec) * 100) : 0
              const color = getAppColor(app)
              return (
                <div 
                  key={app} 
                  onClick={() => {
                    setSelectedAppFilter(prev => prev === app ? null : app)
                    setCurrentPage(1)
                    setTab('timeline')
                  }}
                  className={`cursor-pointer transition-all p-2 -mx-2 rounded-lg ${selectedAppFilter === app ? 'bg-indigo-600/10 border border-indigo-500/30' : 'hover:bg-gray-800/50 border border-transparent'}`}
                >
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300 font-medium">{app}</span>
                    <span className="text-gray-400">{formatDuration(sec)} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {[
          { key: 'timeline', label: 'Activity Timeline', icon: Clock },
          { key: 'screenshots', label: 'Screenshots', icon: Camera },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key as 'timeline' | 'screenshots')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === key
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-48 text-gray-500">Loading...</div>
      ) : tab === 'timeline' ? (
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-500">
              <Monitor className="w-10 h-10 mb-3 opacity-30" />
              <p>No activity recorded for this day</p>
              <p className="text-sm mt-1 text-gray-600">Requires the desktop app with monitoring enabled</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-800 text-gray-400 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Time</th>
                  {isHROrManager && <th className="px-4 py-3 text-left">Employee</th>}
                  <th className="px-4 py-3 text-left">Application</th>
                  <th className="px-4 py-3 text-left">Window</th>
                  <th className="px-4 py-3 text-right">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {paginatedLogs.map(log => (
                  <tr key={log.id} className={`hover:bg-gray-800/50 ${log.isIdle ? 'opacity-40' : ''}`}>
                    <td className="px-4 py-3 text-gray-400">
                      {new Date(log.recordedAt).toLocaleTimeString()}
                    </td>
                    {isHROrManager && (
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-indigo-600/30 flex items-center justify-center text-xs">
                            {log.user.firstName[0]}
                          </div>
                          {log.user.firstName} {log.user.lastName}
                        </div>
                      </td>
                    )}
                    <td className="px-4 py-3">
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: getAppColor(log.appName) + '33', color: getAppColor(log.appName) }}
                      >
                        {log.appName}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-300 max-w-xs truncate">{log.windowTitle}</td>
                    <td className="px-4 py-3 text-right text-gray-400">{formatDuration(log.durationSec)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 bg-gray-800/50 border-t border-gray-800">
              <span className="text-sm text-gray-400">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredLogs.length)} of {filteredLogs.length} entries
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-gray-800 text-white rounded disabled:opacity-50 hover:bg-gray-700 transition-colors text-sm"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-400">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-gray-800 text-white rounded disabled:opacity-50 hover:bg-gray-700 transition-colors text-sm"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {screenshots.length === 0 ? (
            <div className="col-span-3 flex flex-col items-center justify-center h-48 text-gray-500 bg-gray-900 rounded-xl border border-gray-800">
              <Camera className="w-10 h-10 mb-3 opacity-30" />
              <p>No screenshots for this day</p>
            </div>
          ) : (
            screenshots.map(ss => (
              <div key={ss.id} className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden group">
                <img
                  src={`http://localhost:5000${ss.filePath}`}
                  alt="screenshot"
                  className="w-full h-40 object-cover group-hover:opacity-80 transition-opacity"
                />
                <div className="p-3">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <User className="w-3 h-3" />
                    {ss.user.firstName} {ss.user.lastName}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(ss.takenAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
