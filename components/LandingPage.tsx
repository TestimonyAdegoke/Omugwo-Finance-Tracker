import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  PieChart, 
  Shield, 
  FileText, 
  Users, 
  BarChart3, 
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Target,
  Lock,
  Zap
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const [activeView, setActiveView] = useState<'monthly' | 'yearly'>('monthly');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <TrendingUp className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Omugwo Academy</h1>
              <p className="text-xs text-slate-400">Finance Platform</p>
            </div>
          </div>
          <Link 
            to="/login"
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/25"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium mb-6">
              <Sparkles size={16} />
              <span>Purpose-Built for Educational Excellence</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent leading-tight">
              Clarity and Control for<br />Omugwo Academy's Finances
            </h1>
            
            <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
              Track income, manage expenses, and understand your true financial position — all in one intelligent, purpose-built platform.
            </p>
            
            <div className="flex items-center justify-center gap-4">
              <Link 
                to="/login"
                className="group px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-semibold text-lg transition-all duration-200 hover:shadow-2xl hover:shadow-emerald-500/30 flex items-center gap-2"
              >
                View Dashboard
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
              <button className="px-8 py-4 bg-slate-800/50 hover:bg-slate-800 text-white rounded-2xl font-semibold text-lg transition-all duration-200 border border-slate-700/50">
                See How It Works
              </button>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className={`mt-20 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 blur-3xl"></div>
              <div className="relative bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">Financial Overview</h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setActiveView('monthly')}
                      className={`px-4 py-2 rounded-xl font-medium transition-all ${activeView === 'monthly' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                    >
                      Monthly
                    </button>
                    <button 
                      onClick={() => setActiveView('yearly')}
                      className={`px-4 py-2 rounded-xl font-medium transition-all ${activeView === 'yearly' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                    >
                      Yearly
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-emerald-400 font-medium">Total Income</span>
                      <TrendingUp className="text-emerald-400" size={20} />
                    </div>
                    <p className="text-4xl font-bold text-white mb-2">₦2,450,000</p>
                    <p className="text-sm text-emerald-400">+12.5% from last month</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-rose-500/10 to-rose-600/5 border border-rose-500/20 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-rose-400 font-medium">Total Expenses</span>
                      <BarChart3 className="text-rose-400" size={20} />
                    </div>
                    <p className="text-4xl font-bold text-white mb-2">₦1,680,000</p>
                    <p className="text-sm text-rose-400">+5.2% from last month</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-blue-400 font-medium">Net Profit</span>
                      <Target className="text-blue-400" size={20} />
                    </div>
                    <p className="text-4xl font-bold text-white mb-2">₦770,000</p>
                    <p className="text-sm text-blue-400">+28.3% from last month</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem → Solution Section */}
      <section className="py-20 px-6 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-white">From Scattered to Structured</h2>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3 text-slate-400">
                  <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-slate-500 text-sm">✗</span>
                  </div>
                  <p>Financial data scattered across notebooks and spreadsheets</p>
                </div>
                <div className="flex items-start gap-3 text-slate-400">
                  <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-slate-500 text-sm">✗</span>
                  </div>
                  <p>No real-time view of profit or loss</p>
                </div>
                <div className="flex items-start gap-3 text-slate-400">
                  <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-slate-500 text-sm">✗</span>
                  </div>
                  <p>Hard to explain financial position clearly</p>
                </div>
              </div>
              <div className="p-6 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-2xl">
                <p className="text-lg text-slate-200 leading-relaxed">
                  This app brings <span className="text-emerald-400 font-semibold">structure</span>, <span className="text-emerald-400 font-semibold">transparency</span>, and <span className="text-emerald-400 font-semibold">insight</span> to Omugwo Academy's finances — without complexity.
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              {[
                { icon: CheckCircle2, text: "Real-time financial visibility", color: "emerald" },
                { icon: Shield, text: "Secure data management", color: "blue" },
                { icon: Zap, text: "Instant profit & loss calculations", color: "amber" },
                { icon: FileText, text: "Professional reports ready to share", color: "purple" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl hover:bg-slate-800/50 transition-all">
                  <div className={`w-12 h-12 rounded-xl bg-${item.color}-500/10 border border-${item.color}-500/20 flex items-center justify-center`}>
                    <item.icon className={`text-${item.color}-400`} size={24} />
                  </div>
                  <p className="text-slate-200 font-medium">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 text-white">Everything You Need</h2>
            <p className="text-xl text-slate-400">Powerful features designed for clarity and control</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: TrendingUp,
                title: "Income Tracking",
                description: "Donations, course purchases, sponsorships — all in one place",
                color: "emerald"
              },
              {
                icon: BarChart3,
                title: "Expense Management",
                description: "Salaries, operations, marketing, tech — categorized automatically",
                color: "rose"
              },
              {
                icon: Target,
                title: "Automatic Profit & Loss",
                description: "Know your financial position instantly, no manual calculations",
                color: "blue"
              },
              {
                icon: PieChart,
                title: "Smart Categorization",
                description: "Organize transactions intelligently with custom categories",
                color: "purple"
              },
              {
                icon: Lock,
                title: "Secure Financial Records",
                description: "Bank-level security for your sensitive financial data",
                color: "amber"
              },
              {
                icon: FileText,
                title: "Exportable Reports",
                description: "Professional reports ready for stakeholders and audits",
                color: "cyan"
              }
            ].map((feature, idx) => (
              <div 
                key={idx}
                className="group p-8 bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl hover:border-slate-700 transition-all duration-300 hover:shadow-xl hover:shadow-slate-900/50"
              >
                <div className={`w-14 h-14 rounded-xl bg-${feature.color}-500/10 border border-${feature.color}-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`text-${feature.color}-400`} size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-20 px-6 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 text-white">Built for Your Team</h2>
            <p className="text-xl text-slate-400">Every role gets the insights they need</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                role: "Administrators",
                description: "Full visibility and control over all financial operations",
                features: ["Complete access", "User management", "System configuration"]
              },
              {
                role: "Finance Managers",
                description: "Tools to track, categorize, and report on every transaction",
                features: ["Transaction management", "Budget planning", "Report generation"]
              },
              {
                role: "Leadership",
                description: "High-level insights for strategic decision-making",
                features: ["Dashboard overview", "Trend analysis", "Export capabilities"]
              }
            ].map((persona, idx) => (
              <div key={idx} className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl">
                <Users className="text-emerald-400 mb-4" size={32} />
                <h3 className="text-2xl font-bold text-white mb-3">{persona.role}</h3>
                <p className="text-slate-400 mb-6">{persona.description}</p>
                <ul className="space-y-2">
                  {persona.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-center gap-2 text-slate-300">
                      <CheckCircle2 className="text-emerald-400" size={16} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-3xl">
            <Shield className="text-emerald-400 mx-auto mb-6" size={48} />
            <h2 className="text-3xl font-bold text-white mb-4">Built Specifically for Omugwo Academy</h2>
            <p className="text-xl text-slate-300 mb-6 leading-relaxed">
              Secure data handling. Designed for clarity, not complexity.
            </p>
            <blockquote className="text-2xl font-medium text-slate-200 italic border-l-4 border-emerald-500 pl-6 py-2">
              "Good stewardship starts with clear visibility."
            </blockquote>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Take Control of Omugwo<br />Academy's Financial Story
          </h2>
          <p className="text-xl text-slate-400 mb-10">
            Clear records. Confident decisions. Sustainable growth.
          </p>
          <Link 
            to="/login"
            className="inline-flex items-center gap-3 px-10 py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-xl transition-all duration-200 hover:shadow-2xl hover:shadow-emerald-500/30"
          >
            Launch Finance Dashboard
            <ArrowRight size={24} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 py-8 px-6">
        <div className="max-w-7xl mx-auto text-center text-slate-500">
          <p>© 2026 Omugwo Academy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
