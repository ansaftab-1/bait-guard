import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShieldCheck,
  Video,
  Droplets,
  Bell,
  FileText,
  Wifi,
  CheckCircle2,
  ArrowRight,
  Zap,
  Building2,
  MapPin,
  Warehouse,
  ShieldAlert,
  Check,
  Clock,
  Layers,
  ChevronRight,
  User,
  Send,
} from 'lucide-react';

import { submitDemoRequest } from '../services/accessRequestService';

export default function LandingPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Active tab state: 'home' | 'features' | 'how-it-works' | 'industries' | 'pricing' | 'request-demo'
  const [activeTab, setActiveTab] = useState('home');

  // Request Demo Form state
  const [demoForm, setDemoForm] = useState({
    fullName: '',
    workEmail: '',
    companyName: '',
    phone: '',
    facilitiesCount: '1-5 facilities',
    preferredDate: '',
    preferredTime: '',
    notes: '',
  });

  const [demoSubmitted, setDemoSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync route with active tab if navigated via /request-demo
  useEffect(() => {
    if (location.pathname.includes('/request-demo')) {
      setActiveTab('request-demo');
    }
  }, [location.pathname]);

  const handleDemoSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await submitDemoRequest(demoForm);
    setIsSubmitting(false);
    setDemoSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#f4f6f9] text-[#101828] font-sans antialiased selection:bg-blue-100 flex flex-col">
      {/* ─── HEADER ─── */}
      <header className="sticky top-0 z-50 bg-white/95 border-b border-[#e2e8f0] backdrop-blur-md shadow-xs">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          {/* Logo / Brand Name */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-[#2563eb] text-white flex items-center justify-center font-extrabold text-lg shadow-md shadow-blue-200">
              <ShieldCheck size={22} />
            </div>
            <div>
              <span className="text-lg font-extrabold text-[#101828] tracking-tight block leading-none">
                Smart BaitGuard
              </span>
              <span className="text-[11px] font-semibold text-[#64748b] tracking-wider uppercase">
                AI Pest Surveillance
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#f8fafc] border border-[#e2e8f0] p-1 rounded-xl">
            {[
              { id: 'home', label: 'Home' },
              { id: 'features', label: 'Features' },
              { id: 'how-it-works', label: 'How It Works' },
              { id: 'industries', label: 'Industries' },
              { id: 'pricing', label: 'Pricing' },
            ].map((nav) => (
              <button
                key={nav.id}
                type="button"
                onClick={() => setActiveTab(nav.id)}
                className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  activeTab === nav.id
                    ? 'bg-white text-[#2563eb] shadow-sm border border-[#e2e8f0]'
                    : 'text-[#64748b] hover:text-[#101828]'
                }`}
              >
                {nav.label}
              </button>
            ))}

            <button
              type="button"
              onClick={() => navigate('/reports')}
              className="px-4 py-2 rounded-lg text-xs font-extrabold text-[#64748b] hover:text-[#101828] transition-all cursor-pointer"
            >
              Reports
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Login Link -> directly connects to /login page */}
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl text-xs font-extrabold text-[#334155] hover:text-[#2563eb] hover:bg-[#eff6ff] transition-all cursor-pointer"
            >
              Login
            </Link>

            {/* Request Demo Button */}
            <button
              type="button"
              onClick={() => setActiveTab('request-demo')}
              className="px-4 py-2.5 rounded-xl bg-[#2563eb] text-white text-xs font-extrabold hover:bg-[#1d4ed8] transition-all shadow-md shadow-blue-200 cursor-pointer"
            >
              Request Demo
            </button>
          </div>
        </div>
      </header>

      {/* ─── MAIN CONTENT BODY ─── */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 md:py-12 flex flex-col gap-16">
        
        {/* ════════════════════════════════════════════════════════════════ */}
        {/* TAB 1: HOME / OVERVIEW HERO SECTION                              */}
        {/* ════════════════════════════════════════════════════════════════ */}
        {activeTab === 'home' && (
          <div className="flex flex-col gap-16 animate-fadeIn">
            {/* Hero Section */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 flex flex-col gap-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#eff6ff] border border-[#bfdbfe] text-[#2563eb] text-xs font-extrabold w-fit shadow-xs">
                  <Zap size={14} />
                  <span>AI-POWERED PEST SURVEILLANCE</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-[#101828] leading-[1.12] tracking-tight">
                  Continuous vigilance.{' '}
                  <span className="text-[#2563eb] underline decoration-blue-200 decoration-wavy">
                    Military-grade
                  </span>{' '}
                  precision.
                </h1>

                <p className="text-base font-medium text-[#475569] leading-relaxed max-w-xl">
                  Autonomous smart bait stations that detect, classify, and log rodent events in real time. Zero false alarms, zero manual trap checks, and 100% audit logging 24/7.
                </p>

                <div className="flex items-center gap-4 flex-wrap pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('request-demo')}
                    className="px-6 py-3.5 rounded-xl bg-[#2563eb] text-white text-sm font-extrabold hover:bg-[#1d4ed8] transition-all shadow-lg shadow-blue-200 flex items-center gap-2 cursor-pointer"
                  >
                    Request a Demo
                    <ArrowRight size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="px-6 py-3.5 rounded-xl bg-white border border-[#cbd5e1] text-[#334155] text-sm font-extrabold hover:bg-[#f8fafc] hover:border-[#2563eb] transition-all shadow-xs cursor-pointer"
                  >
                    View Live Dashboard
                  </button>
                </div>

                {/* Proof badges */}
                <div className="flex items-center gap-6 pt-4 text-xs font-bold text-[#64748b] flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    HACCP & BRC Compliant
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    YOLOv8 Edge AI Classification
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    Tri-Band Sub-GHz Mesh
                  </span>
                </div>
              </div>

              {/* Right Hero Camera Viewport Graphic */}
              <div className="lg:col-span-5 bg-white rounded-3xl border border-[#e2e8f0] p-4 shadow-xl shadow-slate-200/60 relative overflow-hidden">
                <div className="relative w-full h-[320px] rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 flex flex-col justify-between p-4">
                  <div className="absolute inset-0 bg-cover bg-center opacity-80 mix-blend-luminosity" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop')` }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/70" />

                  <div className="relative z-10 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-slate-950/80 border border-white/10 text-white text-[11px] font-extrabold backdrop-blur-md flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      LIVE INFRARED STREAM
                    </span>
                    <span className="px-3 py-1 rounded-full bg-red-600 text-white text-[11px] font-extrabold">
                      Critical Alert
                    </span>
                  </div>

                  <div className="relative z-10 mx-auto my-auto border-2 border-dashed border-red-500 rounded-lg p-5 bg-red-500/10 backdrop-blur-xs text-center">
                    <Video size={32} className="text-white mx-auto mb-1 opacity-90" />
                    <span className="text-xs font-bold text-white tracking-wide block">RODENT DETECTED (98%)</span>
                  </div>

                  <div className="relative z-10 flex items-center justify-between text-xs font-semibold text-white/90">
                    <span className="bg-slate-900/80 px-3 py-1 rounded-full backdrop-blur-md">
                      Station RB-07 · Zone A
                    </span>
                    <span className="bg-[#2563eb] px-3.5 py-1 rounded-full font-bold shadow-md">
                      Active Telemetry
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Metrics Counter Bar */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { metric: '< 2 sec', label: 'On-Device Detection Speed', desc: 'Instant classification before rodent target exits frame' },
                { metric: '98%+', label: 'Station Detection Accuracy', desc: 'YOLOv8 edge neural engine discards false positives' },
                { metric: '500+', label: 'Deployed Commercial Stations', desc: 'Protecting food processing, warehouses, & cleanrooms' },
              ].map((stat, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm flex flex-col gap-2 hover:border-[#2563eb]/40 transition-all">
                  <span className="text-3xl font-black text-[#2563eb]">{stat.metric}</span>
                  <span className="text-sm font-extrabold text-[#101828]">{stat.label}</span>
                  <p className="text-xs font-medium text-[#64748b] leading-relaxed">{stat.desc}</p>
                </div>
              ))}
            </section>

            {/* Quick Navigation Cards */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                onClick={() => setActiveTab('features')}
                className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm hover:shadow-md hover:border-[#2563eb] transition-all cursor-pointer flex flex-col gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563eb] flex items-center justify-center font-bold">
                  <Zap size={20} />
                </div>
                <h3 className="text-base font-extrabold text-[#101828] group-hover:text-[#2563eb] transition-colors flex items-center justify-between">
                  Built for Zero Blind Spots
                  <ChevronRight size={18} className="text-[#94a3b8] group-hover:translate-x-1 transition-transform" />
                </h3>
                <p className="text-xs font-medium text-[#64748b]">
                  Explore 6 core features engineered for 24/7 commercial pest surveillance.
                </p>
              </div>

              <div
                onClick={() => setActiveTab('how-it-works')}
                className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm hover:shadow-md hover:border-[#2563eb] transition-all cursor-pointer flex flex-col gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Layers size={20} />
                </div>
                <h3 className="text-base font-extrabold text-[#101828] group-hover:text-[#2563eb] transition-colors flex items-center justify-between">
                  How Smart BaitGuard Works
                  <ChevronRight size={18} className="text-[#94a3b8] group-hover:translate-x-1 transition-transform" />
                </h3>
                <p className="text-xs font-medium text-[#64748b]">
                  From site survey to 24/7 autonomous protection in under 48 hours.
                </p>
              </div>

              <div
                onClick={() => setActiveTab('industries')}
                className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm hover:shadow-md hover:border-[#2563eb] transition-all cursor-pointer flex flex-col gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <Building2 size={20} />
                </div>
                <h3 className="text-base font-extrabold text-[#101828] group-hover:text-[#2563eb] transition-colors flex items-center justify-between">
                  Tailored for Your Industry
                  <ChevronRight size={18} className="text-[#94a3b8] group-hover:translate-x-1 transition-transform" />
                </h3>
                <p className="text-xs font-medium text-[#64748b]">
                  Food processing, logistics, pharmaceuticals, hospitality, and retail.
                </p>
              </div>
            </section>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* TAB 2: FEATURES PAGE ("Built for Zero Blind Spots")              */}
        {/* ════════════════════════════════════════════════════════════════ */}
        {activeTab === 'features' && (
          <div className="flex flex-col gap-12 animate-fadeIn">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto flex flex-col gap-3">
              <span className="px-3.5 py-1 rounded-full bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe] text-xs font-extrabold uppercase tracking-wider w-fit mx-auto">
                ZERO BLIND SPOTS
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-[#101828] tracking-tight">
                Built for Zero Blind Spots
              </h1>
              <p className="text-sm font-medium text-[#64748b]">
                Every feature engineered for 24/7 commercial pest surveillance.
              </p>
            </div>

            {/* 6 Feature Rows (Clean Card Grid) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  step: '1. Night Vision AI Detection',
                  desc: 'Infrared night-vision cameras paired with YOLOv8 classification logic eliminate manual trap checks walk-throughs.',
                  bullets: [
                    'Pitch-black 4K illumination array',
                    'On-device YOLOv8 classification engine',
                    '98%+ verified confidence threshold',
                    'Zero false-positive filter metrics',
                  ],
                  icon: Video,
                  color: '#2563eb',
                  bg: '#eff6ff',
                },
                {
                  step: '2. Tamper & Bait Monitoring',
                  desc: 'Continuous precise weight diagnostics audit remaining bait volume percentage instantly to protect facility compliance.',
                  bullets: [
                    'Integrated sub-gram precision checks',
                    'Enclosure tilt & tamper alert switches',
                    'Real-time level decline charts',
                    'Auto-notification at 20% bait levels',
                  ],
                  icon: Droplets,
                  color: '#ef4444',
                  bg: '#fef2f2',
                },
                {
                  step: '3. Instant Push Alerts',
                  desc: 'Mobilize facility coordinators within 10 seconds of verified activity. Zero delays on threat identification.',
                  bullets: [
                    'Sub-2-second target alerts',
                    'Direct-inbox & mobile push notifications',
                    'Configurable target urgency levels',
                    'SMS / Slack direct webhooks built-in',
                  ],
                  icon: Bell,
                  color: '#8b5cf6',
                  bg: '#f5f3ff',
                },
                {
                  step: '4. Facility Dashboard Layouts',
                  desc: 'Deploy active stations rendered over live CAD layout maps, instantly highlighting warning status visually.',
                  bullets: [
                    'Zone-level active heatmaps',
                    'Unified health status dashboard',
                    'Cross-site host performance',
                    'Set size / roaming / silent log overlays',
                  ],
                  icon: Layers,
                  color: '#10b981',
                  bg: '#ecfdf5',
                },
                {
                  step: '5. Compliance Reporting',
                  desc: 'One-click audit documentation meets the strictest compliance profiles for food safety and healthcare audits.',
                  bullets: [
                    'Immutable activity trail records',
                    'One-click PDF / CSV reports',
                    'Scheduled auto-reports to auditors',
                    'Regulatory template support',
                  ],
                  icon: FileText,
                  color: '#0284c7',
                  bg: '#f0f9ff',
                },
                {
                  step: '6. Multi-Protocol Connectivity',
                  desc: 'Industrial tri-band telemetry antennas fail over automatically to keep monitoring active in concrete basements.',
                  bullets: [
                    'Primary 915MHz LoRaWAN pipeline',
                    'Cellular 4G/LTE backup fallback',
                    'Ultra-long-range Sub-GHz support',
                    'Offline target frame storage buffer',
                  ],
                  icon: Wifi,
                  color: '#f59e0b',
                  bg: '#fffbeb',
                },
              ].map((feat, idx) => {
                const IconComp = feat.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-3xl border border-[#e2e8f0] p-7 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-5"
                  >
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0"
                          style={{ backgroundColor: feat.bg, color: feat.color }}
                        >
                          <IconComp size={20} />
                        </div>
                        <h3 className="text-lg font-extrabold text-[#101828]">{feat.step}</h3>
                      </div>

                      <p className="text-xs font-medium text-[#64748b] leading-relaxed">
                        {feat.desc}
                      </p>

                      <div className="flex flex-col gap-2 pt-2">
                        {feat.bullets.map((b, bIdx) => (
                          <div key={bIdx} className="flex items-center gap-2 text-xs font-bold text-[#334155]">
                            <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                            <span>{b}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* TAB 3: HOW IT WORKS PAGE ("How Smart BaitGuard Works")           */}
        {/* ════════════════════════════════════════════════════════════════ */}
        {activeTab === 'how-it-works' && (
          <div className="flex flex-col gap-14 animate-fadeIn">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto flex flex-col gap-3">
              <span className="px-3.5 py-1 rounded-full bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe] text-xs font-extrabold uppercase tracking-wider w-fit mx-auto">
                AUTOMATED STEPS & TIMELINE
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-[#101828] tracking-tight">
                How Smart BaitGuard Works
              </h1>
              <p className="text-sm font-medium text-[#64748b]">
                From installation to insight in under 48 hours. A robust physical-to-digital system engineered to provide automated audit compliance and 24/7 security.
              </p>
            </div>

            {/* 4 Installation Steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  stepNum: 'STEP 01',
                  title: 'Site Survey & Planning',
                  desc: 'Our field engineering team analyzes your facility footprint, maps structural entry points, identifies optimal station placement positions, and validates signal penetration through concrete and steel walls.',
                },
                {
                  stepNum: 'STEP 02',
                  title: 'Hardware Installation',
                  desc: 'Plug-and-play smart stations are locked down using high-strength magnetic or mechanical concrete mounts. Techs establish a local Sub-GHz LoRaWAN mesh network to guarantee penetrative basement connectivity.',
                },
                {
                  stepNum: 'STEP 03',
                  title: 'System Activation & Calibration',
                  desc: 'We verify cellular failover gateway link, sync the stations with your live dashboard, calibrate individual AI detecting thresholds, and configure your facility-specific emergency alerts.',
                },
                {
                  stepNum: 'STEP 04',
                  title: '24/7 Autonomous Protection',
                  desc: 'Our YOLOv8 edge AI begins continuous surveillance. False alarms are discarded instantly while real rodent activity events log high-res thermal captures directly to your cloud compliance record.',
                },
              ].map((s, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl border border-[#e2e8f0] p-7 shadow-sm hover:shadow-md transition-all flex flex-col gap-3 border-l-4 border-l-[#2563eb]"
                >
                  <span className="text-xs font-black text-[#2563eb] uppercase tracking-wider">
                    {s.stepNum}
                  </span>
                  <h3 className="text-lg font-extrabold text-[#101828]">{s.title}</h3>
                  <p className="text-xs font-medium text-[#64748b] leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>

            {/* Comparison Section: "How BaitGuard Redefines Pest Management" */}
            <div className="flex flex-col gap-6 pt-4">
              <h2 className="text-2xl font-black text-[#101828] text-center">
                How BaitGuard Redefines Pest Management
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  {
                    vs: 'vs Traditional Traps',
                    problem: 'Traditional snap or poison boxes left frontless in the dark for days between physical checks.',
                    solution: 'Immediate Response: Real-time autonomous AI alerts',
                  },
                  {
                    vs: 'vs Manual Inspections',
                    problem: 'Techs wasted in high-elevation drop ceilings or toxic crawlspaces requiring manual footprint checks.',
                    solution: '0 Hours Wasted: Automated telemetry updates',
                  },
                  {
                    vs: 'vs Basic Electronic Traps',
                    problem: 'Traps continuously emit false alerts due to vibrations, structural settling, or dust accumulation.',
                    solution: 'YOLOv8 Edge AI: Instant confirmation prevents false alarms',
                  },
                  {
                    vs: 'vs Standard Competitors',
                    problem: 'Fragile consumer-grade IoT components drop connectors inside massive metal warehouse facilities.',
                    solution: 'Tri-Band Network: Sub-GHz mesh guarantees connectivity',
                  },
                ].map((comp, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-sm flex flex-col justify-between gap-4"
                  >
                    <div>
                      <span className="text-xs font-black text-[#2563eb] block mb-1">{comp.vs}</span>
                      <p className="text-xs font-medium text-[#64748b]">{comp.problem}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#eff6ff] border border-[#bfdbfe] text-xs font-extrabold text-[#2563eb]">
                      {comp.solution}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Box */}
            <div className="bg-[#2563eb] text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-black">Ready to modernize your pest control?</h3>
                <p className="text-xs font-medium text-blue-100 mt-1">
                  Schedule a consultation with our system engineers to map your facility footprint.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('request-demo')}
                className="px-6 py-3 rounded-xl bg-white text-[#2563eb] text-xs font-extrabold hover:bg-blue-50 transition-colors shadow-md shrink-0 cursor-pointer"
              >
                Schedule Installation
              </button>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* TAB 4: INDUSTRIES PAGE ("Built for Your Industry")               */}
        {/* ════════════════════════════════════════════════════════════════ */}
        {activeTab === 'industries' && (
          <div className="flex flex-col gap-14 animate-fadeIn">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto flex flex-col gap-3">
              <span className="px-3.5 py-1 rounded-full bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe] text-xs font-extrabold uppercase tracking-wider w-fit mx-auto">
                HIGH-STAKES COMPLIANCE
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-[#101828] tracking-tight">
                Built for Your Industry
              </h1>
              <p className="text-sm font-medium text-[#64748b]">
                Smart BaitGuard protects critical facility perimeters across complex sectors — matching audit standards with continuous monitoring and automated reporting logs.
              </p>
            </div>

            {/* 6 Industry Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Food & Beverage Manufacturing',
                  icon: Building2,
                  bullets: ['HACCP and BRC automated logging', 'Cold storage extreme-temp rating', 'Processing perimeter tracks'],
                  badge: '99.7% audit pass rate',
                },
                {
                  title: 'Warehousing & Logistics',
                  icon: Warehouse,
                  bullets: ['Deep pallet-rack signal coverage', 'Loading dock high-frequency logs', 'Multi-facility dashboard rollup'],
                  badge: '60% fewer incidents',
                },
                {
                  title: 'Healthcare & Pharmaceuticals',
                  icon: ShieldAlert,
                  bullets: ['Strict sterile cleanroom monitoring', 'Cleanroom-safe medical hardware', 'FDA audit-trail compliance logs'],
                  badge: '100% compliance maintained',
                },
                {
                  title: 'Hospitality & Food Service',
                  icon: User,
                  bullets: ['Commercial kitchen perimeter defense', 'Dining area hidden footprint', 'Low-profile aesthetic hardware'],
                  badge: '85% callback reduction',
                },
                {
                  title: 'Agriculture & Bulk Storage',
                  icon: Layers,
                  bullets: ['Silo & grain loading gate monitors', 'High-density crop barn coverage', 'Dust and moisture IP67 casings'],
                  badge: '3x faster detection',
                },
                {
                  title: 'Retail & Commercial Space',
                  icon: MapPin,
                  bullets: ['Customer-facing safe enclosures', 'Restroom backroom telemetry tracking', 'Global property dashboard overlays'],
                  badge: '82% damage reduction',
                },
              ].map((ind, idx) => {
                const IndIcon = ind.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-3xl border border-[#e2e8f0] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4"
                  >
                    <div className="flex flex-col gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563eb] flex items-center justify-center font-bold">
                        <IndIcon size={20} />
                      </div>
                      <h3 className="text-base font-extrabold text-[#101828]">{ind.title}</h3>

                      <div className="flex flex-col gap-2 pt-1">
                        {ind.bullets.map((b, bIdx) => (
                          <div key={bIdx} className="flex items-center gap-2 text-xs font-bold text-[#475569]">
                            <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                            <span>{b}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] text-xs font-black text-[#2563eb] text-center">
                      {ind.badge}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Audit Testimonials */}
            <div className="flex flex-col gap-6 pt-2">
              <h2 className="text-2xl font-black text-[#101828] text-center">
                Proven Results in High-Stakes Audits
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl border border-[#e2e8f0] p-7 shadow-sm flex flex-col justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-black text-[#2563eb] uppercase tracking-wider">
                      VANGUARD FOOD PROCESSING
                    </span>
                    <p className="text-xs font-medium text-[#475569] italic leading-relaxed">
                      "BaitGuard transformed our USDA audit prep. We stopped manual log entry entirely. Real-time data keeps us continuously audit-ready without stepping away from our main operations."
                    </p>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 w-fit">
                    Result: 100% USDA audit score
                  </span>
                </div>

                <div className="bg-white rounded-3xl border border-[#e2e8f0] p-7 shadow-sm flex flex-col justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-black text-[#2563eb] uppercase tracking-wider">
                      HELIX LABS & R&D
                    </span>
                    <p className="text-xs font-medium text-[#475569] italic leading-relaxed">
                      "In research labs, even a single rodent intrusion compromises critical equipment. BaitGuard edge verification protects our facility perimeters and keeps our biosafety rating secure."
                    </p>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 w-fit">
                    Result: 0 compromised series
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* TAB 5: PRICING PAGE                                              */}
        {/* ════════════════════════════════════════════════════════════════ */}
        {activeTab === 'pricing' && (
          <div className="flex flex-col gap-12 animate-fadeIn">
            <div className="text-center max-w-2xl mx-auto flex flex-col gap-3">
              <span className="px-3.5 py-1 rounded-full bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe] text-xs font-extrabold uppercase tracking-wider w-fit mx-auto">
                TRANSPARENT TIER PRICING
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-[#101828] tracking-tight">
                Simple plans for any facility scale
              </h1>
              <p className="text-sm font-medium text-[#64748b]">
                All plans include automated AI rodent detection, hardware warranty, and compliance report exports.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Starter', price: '$299', period: '/month', desc: 'Up to 10 smart stations for single small facilities.', featured: false },
                { title: 'Commercial', price: '$799', period: '/month', desc: 'Up to 50 smart stations with multi-zone heatmap support.', featured: true },
                { title: 'Enterprise', price: 'Custom', period: '', desc: 'Unlimited stations across nationwide logistics grids.', featured: false },
              ].map((tier, idx) => (
                <div
                  key={idx}
                  className={`bg-white rounded-3xl border p-8 shadow-sm flex flex-col justify-between gap-6 relative ${
                    tier.featured
                      ? 'border-[#2563eb] ring-2 ring-[#2563eb]/20 shadow-xl'
                      : 'border-[#e2e8f0]'
                  }`}
                >
                  {tier.featured && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-[#2563eb] text-white text-[11px] font-extrabold uppercase tracking-wider shadow-sm">
                      MOST POPULAR
                    </span>
                  )}

                  <div className="flex flex-col gap-4">
                    <h3 className="text-lg font-extrabold text-[#101828]">{tier.title}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-[#101828]">{tier.price}</span>
                      <span className="text-xs font-bold text-[#64748b]">{tier.period}</span>
                    </div>
                    <p className="text-xs font-medium text-[#64748b]">{tier.desc}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab('request-demo')}
                    className={`w-full py-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                      tier.featured
                        ? 'bg-[#2563eb] text-white hover:bg-[#1d4ed8] shadow-md shadow-blue-200'
                        : 'bg-white border border-[#cbd5e1] text-[#334155] hover:bg-[#f8fafc]'
                    }`}
                  >
                    Get Started
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* TAB 6: REQUEST LIVE DEMO PAGE ("Schedule a Live Demo")           */}
        {/* ════════════════════════════════════════════════════════════════ */}
        {activeTab === 'request-demo' && (
          <div className="flex flex-col gap-10 animate-fadeIn">
            <div className="text-center max-w-2xl mx-auto flex flex-col gap-3">
              <span className="px-3.5 py-1 rounded-full bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe] text-xs font-extrabold uppercase tracking-wider w-fit mx-auto">
                LIVE WALKTHROUGH
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-[#101828] tracking-tight">
                Schedule a Live Demo
              </h1>
              <p className="text-sm font-medium text-[#64748b]">
                See Smart BaitGuard protecting a facility in real time. Our team will walk you through the hardware, mobile app, and web dashboard.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Left Column: What We'll Cover */}
              <div className="lg:col-span-5 bg-white rounded-3xl border border-[#e2e8f0] p-8 shadow-sm flex flex-col gap-6">
                <h3 className="text-base font-extrabold text-[#101828]">WHAT WE'LL COVER</h3>

                <div className="flex flex-col gap-4">
                  {[
                    'Live station hardware demo',
                    'Mobile app walkthrough',
                    'Dashboard & reporting overview',
                    'Custom deployment planning',
                    'Q&A with our IoT engineers',
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs font-bold text-[#334155]">
                      <CheckCircle2 size={18} className="text-[#2563eb] shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-[#f8fafc] border border-[#e2e8f0] flex items-center gap-3 text-xs font-bold text-[#64748b] mt-2">
                  <Clock size={18} className="text-[#2563eb] shrink-0" />
                  <span>30-minute session · No commitment · Available this week</span>
                </div>
              </div>

              {/* Right Column: Request Form Card */}
              <div className="lg:col-span-7 bg-white rounded-3xl border border-[#e2e8f0] p-8 shadow-md relative">
                {demoSubmitted ? (
                  <div className="flex flex-col items-center text-center py-10 gap-4 animate-scaleIn">
                    <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 border border-emerald-200 flex items-center justify-center">
                      <Check size={32} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-2xl font-black text-[#101828]">Demo Request Confirmed!</h3>
                    <p className="text-xs font-medium text-[#64748b] max-w-md">
                      Thank you! Our facility automation team has received your request and will send a calendar invite to <span className="font-bold text-[#101828]">{demoForm.workEmail || 'your email'}</span> shortly.
                    </p>
                    <button
                      type="button"
                      onClick={() => setDemoSubmitted(false)}
                      className="mt-4 px-6 py-2.5 rounded-xl bg-[#2563eb] text-white text-xs font-bold hover:bg-[#1d4ed8] cursor-pointer"
                    >
                      Book Another Session
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleDemoSubmit} className="flex flex-col gap-4">
                    <h3 className="text-lg font-extrabold text-[#101828] mb-1">
                      Request Live Demo Slot
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Full Name */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-[#374151]">Full Name</label>
                        <input
                          type="text"
                          required
                          value={demoForm.fullName}
                          onChange={(e) => setDemoForm({ ...demoForm, fullName: e.target.value })}
                          placeholder="Alex Rivera"
                          className="h-11 px-3.5 rounded-xl border border-[#e2e8f0] text-xs font-bold text-[#101828] bg-[#f8fafc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb]"
                        />
                      </div>

                      {/* Work Email */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-[#374151]">Work Email</label>
                        <input
                          type="email"
                          required
                          value={demoForm.workEmail}
                          onChange={(e) => setDemoForm({ ...demoForm, workEmail: e.target.value })}
                          placeholder="alex@company.com"
                          className="h-11 px-3.5 rounded-xl border border-[#e2e8f0] text-xs font-bold text-[#101828] bg-[#f8fafc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Company Name */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-[#374151]">Company Name</label>
                        <input
                          type="text"
                          required
                          value={demoForm.companyName}
                          onChange={(e) => setDemoForm({ ...demoForm, companyName: e.target.value })}
                          placeholder="Vertex Logistics"
                          className="h-11 px-3.5 rounded-xl border border-[#e2e8f0] text-xs font-bold text-[#101828] bg-[#f8fafc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb]"
                        />
                      </div>

                      {/* Phone Number */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-[#374151]">Phone Number</label>
                        <input
                          type="tel"
                          value={demoForm.phone}
                          onChange={(e) => setDemoForm({ ...demoForm, phone: e.target.value })}
                          placeholder="+1 (555) 000-0000"
                          className="h-11 px-3.5 rounded-xl border border-[#e2e8f0] text-xs font-bold text-[#101828] bg-[#f8fafc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb]"
                        />
                      </div>
                    </div>

                    {/* Number of Facilities */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[#374151]">Number of Facilities</label>
                      <select
                        value={demoForm.facilitiesCount}
                        onChange={(e) => setDemoForm({ ...demoForm, facilitiesCount: e.target.value })}
                        className="h-11 px-3.5 rounded-xl border border-[#e2e8f0] text-xs font-bold text-[#101828] bg-[#f8fafc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb]"
                      >
                        <option value="1-5 facilities">1-5 facilities</option>
                        <option value="6-20 facilities">6-20 facilities</option>
                        <option value="20+ facilities">20+ facilities</option>
                      </select>
                    </div>

                    {/* Preferred Date & Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-[#374151]">Preferred Date</label>
                        <input
                          type="date"
                          value={demoForm.preferredDate}
                          onChange={(e) => setDemoForm({ ...demoForm, preferredDate: e.target.value })}
                          className="h-11 px-3.5 rounded-xl border border-[#e2e8f0] text-xs font-bold text-[#101828] bg-[#f8fafc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb]"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-[#374151]">Preferred Time</label>
                        <select
                          value={demoForm.preferredTime}
                          onChange={(e) => setDemoForm({ ...demoForm, preferredTime: e.target.value })}
                          className="h-11 px-3.5 rounded-xl border border-[#e2e8f0] text-xs font-bold text-[#101828] bg-[#f8fafc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb]"
                        >
                          <option value="">Select time</option>
                          <option value="10:00 AM EST">10:00 AM EST</option>
                          <option value="02:00 PM EST">02:00 PM EST</option>
                          <option value="04:00 PM EST">04:00 PM EST</option>
                        </select>
                      </div>
                    </div>

                    {/* Message / Notes */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-[#374151]">Message / Notes</label>
                      <textarea
                        rows={3}
                        value={demoForm.notes}
                        onChange={(e) => setDemoForm({ ...demoForm, notes: e.target.value })}
                        placeholder="Tell us about your pest control challenges..."
                        className="p-3.5 rounded-xl border border-[#e2e8f0] text-xs font-bold text-[#101828] bg-[#f8fafc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-11 rounded-xl bg-[#2563eb] text-white text-xs font-extrabold hover:bg-[#1d4ed8] transition-all shadow-md shadow-blue-200 cursor-pointer mt-2 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send size={15} />
                          <span>Book My Demo</span>
                        </>
                      )}
                    </button>

                    <span className="text-[11px] font-medium text-[#94a3b8] text-center mt-1">
                      Or contact us directly: <a href="mailto:sales@smartbaitguard.com" className="text-[#2563eb] hover:underline font-bold">sales@smartbaitguard.com</a>
                    </span>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-[#e2e8f0] bg-white mt-auto py-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#2563eb] text-white flex items-center justify-center font-extrabold text-sm">
                <ShieldCheck size={18} />
              </div>
              <span className="text-base font-extrabold text-[#101828]">Smart BaitGuard</span>
            </div>
            <p className="text-xs font-medium text-[#64748b] leading-relaxed">
              Military-grade precision rodent detection and IoT compliance networks protecting commercial liabilities worldwide.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-extrabold text-[#101828] uppercase tracking-wider mb-3">Product</h4>
            <div className="flex flex-col gap-2 text-xs font-semibold text-[#64748b]">
              <button type="button" onClick={() => setActiveTab('features')} className="text-left hover:text-[#2563eb]">Features</button>
              <button type="button" onClick={() => setActiveTab('pricing')} className="text-left hover:text-[#2563eb]">Pricing</button>
              <button type="button" onClick={() => navigate('/login')} className="text-left hover:text-[#2563eb]">Dashboard</button>
              <button type="button" onClick={() => navigate('/reports')} className="text-left hover:text-[#2563eb]">Telemetry</button>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-extrabold text-[#101828] uppercase tracking-wider mb-3">Company</h4>
            <div className="flex flex-col gap-2 text-xs font-semibold text-[#64748b]">
              <span>About Us</span>
              <span>Contact Sales</span>
              <span>Press Materials</span>
              <span>Careers</span>
              <span>Security Overview</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-extrabold text-[#101828] uppercase tracking-wider mb-3">Legal</h4>
            <div className="flex flex-col gap-2 text-xs font-semibold text-[#64748b]">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Audit Compliance SLA</span>
              <span>DPA Standards</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-8 mt-8 border-t border-[#f1f5f9] flex flex-col md:flex-row items-center justify-between text-xs font-semibold text-[#94a3b8] gap-4">
          <span>© Smart BaitGuard 2026. Powered by Smart IoT Systems. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hover:text-[#2563eb]">Login</Link>
            <button type="button" onClick={() => setActiveTab('request-demo')} className="hover:text-[#2563eb]">Request Demo</button>
          </div>
        </div>
      </footer>
    </div>
  );
}