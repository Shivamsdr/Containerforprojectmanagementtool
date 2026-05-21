import React from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle,
  Layout,
  Users,
  Calendar,
  Zap,
  ArrowRight,
  ShieldCheck,
  MessageSquare,
  Menu,
  X
} from "lucide-react";

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-6 md:px-12 py-6 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg">
            <Layout className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Doer</h1>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
          <a href="#features" className="hover:text-indigo-600 transition">Features</a>
          <a href="#how-it-works" className="hover:text-indigo-600 transition">How it Works</a>
          <a href="#faq" className="hover:text-indigo-600 transition">FAQ</a>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <Link to="/login" className="text-gray-600 font-semibold hover:text-indigo-600 transition px-4 py-2">
            Sign in
          </Link>
          <Link to="/signup" className="bg-indigo-600 text-white px-6 py-2.5 rounded-full font-bold hover:bg-indigo-700 transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
            Get Started
          </Link>
        </div>
        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600 focus:outline-none">
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-[72px] left-0 right-0 bg-white border-b border-gray-100 shadow-lg z-40 px-6 py-6 flex flex-col gap-6">
          <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-semibold text-gray-800">Features</a>
          <a href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-semibold text-gray-800">How it Works</a>
          <a href="#faq" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-semibold text-gray-800">FAQ</a>
          <hr className="border-gray-100" />
          <div className="flex flex-col gap-4">
            <Link to="/login" className="text-center text-gray-600 font-semibold text-lg py-2">Sign in</Link>
            <Link to="/signup" className="text-center bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-lg">Get Started</Link>
          </div>
        </div>
      )}

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-12 md:pt-20 pb-20 md:pb-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-indigo-50/50 to-transparent -z-10" />
          <div className="container mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-bold mb-8 animate-fade-in">
              <Zap size={16} />
              <span>v2.0 is now live with real-time sync</span>
            </div>
            <h2 className="text-6xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tight text-gray-900">
              Manage work <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">without the chaos.</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Doer brings all your tasks, teammates, and tools together.
              Stop juggling apps and start delivering projects faster.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup" className="w-full sm:w-auto bg-indigo-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-indigo-700 transition shadow-xl hover:shadow-indigo-200 transform hover:-translate-y-1 flex items-center justify-center gap-2">
                Start for free <ArrowRight size={20} />
              </Link>
              <button className="w-full sm:w-auto bg-white text-gray-700 border-2 border-gray-100 px-10 py-4 rounded-full font-bold text-lg hover:border-indigo-100 hover:bg-indigo-50/30 transition">
                Watch demo
              </button>
            </div>

            {/* Social Proof */}
            <div className="mt-20 pt-10 border-t border-gray-100">
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">Trusted by teams at</p>
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale">
                <span className="text-2xl font-black tracking-tighter italic">TECHFLOW</span>
                <span className="text-2xl font-black tracking-tighter italic">NEXUS</span>
                <span className="text-2xl font-black tracking-tighter italic">VELOCITY</span>
                <span className="text-2xl font-black tracking-tighter italic">QUANTUM</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-20">
              <h3 className="text-indigo-600 font-extrabold tracking-widest uppercase text-sm mb-4">Core Features</h3>
              <p className="text-4xl md:text-5xl font-black text-gray-900 mb-6">Built for modern collaboration</p>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">Everything you need to move from "to-do" to "done" in one beautiful interface.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon={<Layout className="text-blue-600" size={32} />}
                title="Kanban Boards"
                description="Visualize your workflow with intuitive drag-and-drop boards that keep everyone aligned."
              />
              <FeatureCard
                icon={<Users className="text-purple-600" size={32} />}
                title="Team Management"
                description="Invite team members, assign roles, and collaborate in real-time on any project."
              />
              <FeatureCard
                icon={<Calendar className="text-pink-600" size={32} />}
                title="Calendar View"
                description="Stay on top of deadlines with a unified calendar view for all your project tasks."
              />
              <FeatureCard
                icon={<MessageSquare className="text-indigo-600" size={32} />}
                title="Real-time Sync"
                description="Changes update instantly across all devices. No more refreshing or lost updates."
              />
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section id="how-it-works" className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/2">
                <h3 className="text-indigo-600 font-extrabold tracking-widest uppercase text-sm mb-4">The Workflow</h3>
                <p className="text-4xl md:text-5xl font-black text-gray-900 mb-8 leading-tight text-left">Get started in <br />three simple steps</p>

                <div className="space-y-8">
                  <StepItem
                    number="1"
                    title="Create your account"
                    description="Sign up in seconds and set up your personal workspace."
                  />
                  <StepItem
                    number="2"
                    title="Setup your project"
                    description="Add tasks, set deadlines, and organize your work into custom columns."
                  />
                  <StepItem
                    number="3"
                    title="Collaborate & Deliver"
                    description="Invite your team and start getting things done together with real-time updates."
                  />
                </div>
              </div>
              <div className="lg:w-1/2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl p-8 shadow-inner">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                  <div className="bg-gray-50 px-4 py-3 border-b flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex gap-4">
                      <div className="w-1/3 h-32 bg-indigo-50 rounded-lg p-3">
                        <div className="w-full h-2 bg-indigo-200 rounded mb-2"></div>
                        <div className="w-2/3 h-2 bg-indigo-100 rounded"></div>
                      </div>
                      <div className="w-1/3 h-32 bg-indigo-600 rounded-lg p-3">
                        <div className="w-full h-2 bg-indigo-400 rounded mb-2"></div>
                        <div className="w-2/3 h-2 bg-indigo-300 rounded"></div>
                      </div>
                      <div className="w-1/3 h-32 bg-indigo-50 rounded-lg p-3 border-2 border-dashed border-indigo-200"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="w-full h-4 bg-gray-100 rounded"></div>
                      <div className="w-5/6 h-4 bg-gray-100 rounded"></div>
                      <div className="w-4/6 h-4 bg-gray-100 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-24 bg-gray-50">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="text-center mb-16">
              <h3 className="text-indigo-600 font-extrabold tracking-widest uppercase text-sm mb-4">Questions?</h3>
              <p className="text-4xl font-black text-gray-900 mb-6">Frequently asked questions</p>
            </div>

            <div className="space-y-4">
              <FaqItem
                question="Is Doer really free to use?"
                answer="Yes! Our starter plan is 100% free forever for up to 3 projects and 5 team members. No credit card required."
              />
              <FaqItem
                question="Can I invite external clients?"
                answer="Absolutely. You can invite guests to specific projects and control their access levels through our permission system."
              />
              <FaqItem
                question="Does it support real-time collaboration?"
                answer="Yes, Doer is built on a real-time engine. All changes you or your team make are synced across all devices instantly."
              />
              <FaqItem
                question="Is my data secure?"
                answer="We use industry-standard encryption and follow security best practices to ensure your project data remains private and protected."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <div className="bg-indigo-600 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/20 rounded-full -ml-32 -mb-32 blur-3xl" />

              <h3 className="text-4xl md:text-5xl font-black mb-8 relative z-10">Ready to boost your team's productivity?</h3>
              <p className="text-xl text-indigo-100 mb-12 max-w-2xl mx-auto relative z-10">Join thousands of teams who are already using Doer to deliver projects on time.</p>
              <Link to="/signup" className="relative z-10 inline-block bg-white text-indigo-700 px-12 py-5 rounded-full font-bold text-xl hover:bg-gray-100 transition shadow-xl hover:scale-105 active:scale-95">
                Join Doer for free
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 pt-16 pb-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-indigo-600 p-1.5 rounded-lg">
                  <Layout className="text-white" size={20} />
                </div>
                <h1 className="text-xl font-bold tracking-tight text-gray-900">Doer</h1>
              </div>
              <p className="text-gray-500 leading-relaxed mb-6">
                The modern project management tool built for teams who want to deliver exceptional work.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-indigo-600 transition cursor-pointer">
                  <ShieldCheck size={20} />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-6">Product</h4>
              <ul className="space-y-4 text-gray-500">
                <li><a href="#" className="hover:text-indigo-600 transition">Features</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition">Integrations</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition">Enterprise</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition">Roadmap</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-6">Resources</h4>
              <ul className="space-y-4 text-gray-500">
                <li><a href="#" className="hover:text-indigo-600 transition">Documentation</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition">Blog</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition">Support</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-6">Company</h4>
              <ul className="space-y-4 text-gray-500">
                <li><a href="#" className="hover:text-indigo-600 transition">About Us</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition">Careers</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition">Privacy</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <p className="text-gray-400 text-sm">© 2024 Doer Inc. All rights reserved.</p>
            <div className="flex gap-8 text-sm text-gray-400">
              <a href="#" className="hover:text-gray-600 transition">Terms</a>
              <a href="#" className="hover:text-gray-600 transition">Privacy</a>
              <a href="#" className="hover:text-gray-600 transition">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all group">
      <div className="mb-6 p-4 bg-gray-50 rounded-2xl w-fit group-hover:bg-indigo-50 transition-colors">
        {icon}
      </div>
      <h4 className="text-xl font-bold text-gray-900 mb-3">{title}</h4>
      <p className="text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}

function StepItem({ number, title, description }) {
  return (
    <div className="flex gap-6">
      <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-200">
        {number}
      </div>
      <div>
        <h4 className="text-xl font-bold text-gray-900 mb-2">{title}</h4>
        <p className="text-gray-500 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function FaqItem({ question, answer }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-indigo-100 transition shadow-sm">
      <h4 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-3">
        <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
        {question}
      </h4>
      <p className="text-gray-500 ml-4.5">{answer}</p>
    </div>
  );
}

