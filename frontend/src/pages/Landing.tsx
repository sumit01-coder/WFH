import { Link, Navigate } from 'react-router-dom';
import { LayoutDashboard, Users, Clock, Target, Shield, Zap, Globe, Check, Laptop } from 'lucide-react';
import { motion } from 'framer-motion';

const Landing = () => {
  const isDesktop = !!(window as any).ipcRenderer;
  if (isDesktop) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-sans overflow-x-hidden">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <img src="./logo.png" alt="Logo" className="w-16 h-16 object-contain" />
              <span className="text-2xl font-bold tracking-tight">Work<span className="text-blue-500">Nexus</span></span>
            </div>
            <div className="hidden md:flex items-center gap-8 font-medium text-slate-600 dark:text-slate-300">
              <a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</a>
              <a href="#pricing" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Pricing</a>
              <a href="#about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About Us</a>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-slate-600 dark:text-slate-300 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Log In</Link>
              <Link to="/register" className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-full font-medium transition-all shadow-lg shadow-blue-500/30">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-slate-50 to-slate-50 dark:from-blue-900/20 dark:via-slate-900 dark:to-slate-900 -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
              Manage Your Remote Team <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Like a Pro</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10">
              WorkNexus brings attendance, tasks, meetings, and team chat into one unified workspace, empowering your distributed workforce to achieve more.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-xl shadow-blue-500/30 transform hover:-translate-y-1 flex items-center justify-center gap-2">
                Start for Free
              </Link>
              <a href="#features" className="w-full sm:w-auto bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 px-8 py-4 rounded-full font-bold text-lg transition-all shadow-sm flex items-center justify-center gap-2">
                Explore Features
              </a>
              <a href="/WorkNexus_Setup_1.0.3.exe" download className="w-full sm:w-auto bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 px-8 py-4 rounded-full font-bold text-lg transition-all shadow-sm flex items-center justify-center gap-2 mt-2 sm:mt-0">
                <Laptop size={20} />
                Download Windows App
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Our comprehensive suite of tools ensures your team stays connected, productive, and aligned, no matter where they are.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: LayoutDashboard, title: 'Project Management', desc: 'Organize tasks, assign priorities, and track progress effortlessly with intuitive kanban boards.' },
              { icon: Clock, title: 'Time & Attendance', desc: 'Seamlessly track work hours, manage breaks, and handle work-from-home requests securely.' },
              { icon: Users, title: 'Team Collaboration', desc: 'Built-in real-time chat, automatic channel generation, and secure document sharing.' },
              { icon: Target, title: 'Goal Tracking', desc: 'Set organizational targets and track individual and team performance metrics in real-time.' },
              { icon: Shield, title: 'Role-Based Access', desc: 'Strict permission controls for HR, Managers, and Employees to ensure data security.' },
              { icon: Zap, title: 'Instant Meetings', desc: 'Schedule, host, and record meetings directly within your workspace without context switching.' },
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Choose the plan that best fits your company's size and needs. No hidden fees.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Tier */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
              <h3 className="text-xl font-bold mb-2">Starter</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">For small teams getting started.</p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold">$0</span>
                <span className="text-slate-500">/mo</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {['Up to 5 Users', 'Basic Task Management', 'Team Chat', 'Standard Support'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check size={18} className="text-green-500" />
                    <span className="text-slate-700 dark:text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/register" className="w-full block text-center bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white py-3 rounded-xl font-bold transition-colors">Get Started</Link>
            </div>

            {/* Pro Tier */}
            <div className="bg-blue-600 text-white p-8 rounded-3xl shadow-xl shadow-blue-600/20 flex flex-col relative transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-cyan-400 to-blue-400 text-slate-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</div>
              <h3 className="text-xl font-bold mb-2">Professional</h3>
              <p className="text-blue-100 mb-6">For growing businesses.</p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold">$29</span>
                <span className="text-blue-200">/user/mo</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {['Unlimited Users', 'Advanced Project Management', 'Attendance & WFH Tracking', 'Document Attachments', 'Priority Support'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check size={18} className="text-cyan-300" />
                    <span className="text-white">{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/register" className="w-full block text-center bg-white text-blue-600 hover:bg-slate-50 py-3 rounded-xl font-bold transition-colors shadow-lg">Start Free Trial</Link>
            </div>

            {/* Enterprise Tier */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
              <h3 className="text-xl font-bold mb-2">Enterprise</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">For large scale organizations.</p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold">Custom</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {['Everything in Pro', 'Custom Integrations', 'Dedicated Account Manager', 'SLA Guarantees', 'Advanced Analytics'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check size={18} className="text-green-500" />
                    <span className="text-slate-700 dark:text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/register" className="w-full block text-center bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white py-3 rounded-xl font-bold transition-colors">Contact Sales</Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-900/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <Globe size={48} className="mx-auto mb-6 text-blue-400" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10">
            At WorkNexus, we believe that distributed teams shouldn't mean disconnected workflows. We built this platform to bridge the gap between remote employees, HR professionals, and management, providing a unified space where work happens seamlessly, transparently, and securely.
          </p>
          <div className="flex justify-center gap-12 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">10k+</div>
              <div className="text-slate-400 uppercase tracking-wider text-sm font-medium">Teams</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">99.9%</div>
              <div className="text-slate-400 uppercase tracking-wider text-sm font-medium">Uptime</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-slate-400 uppercase tracking-wider text-sm font-medium">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3 mb-6 opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer">
              <img src="./logo.png" alt="Logo" className="w-12 h-12 object-contain" />
              <span className="text-xl font-bold tracking-tight text-white">Work<span className="text-blue-500">Nexus</span></span>
          </div>
          <p>&copy; {new Date().getFullYear()} WorkNexus. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
};

export default Landing;
