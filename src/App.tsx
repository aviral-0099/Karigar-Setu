/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Hammer,
  Zap,
  Wrench,
  Layers,
  Paintbrush,
  Sparkles,
  Coffee,
  Shield,
  Scissors,
  Compass,
  Search,
  MapPin,
  Filter,
  CheckCircle2,
  Star,
  Users,
  Briefcase,
  Calculator,
  CalendarCheck,
  UserPlus,
  Plus,
  Globe,
  SlidersHorizontal,
  X,
  Phone,
  MessageSquare,
  Award,
  ShieldCheck,
  Clock,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

import { Karigar, JobPost, BookingRequest, Language, TradeCategory } from './types';
import { INITIAL_KARIGARS, INITIAL_JOB_POSTS } from './data/mockKarigars';
import { TRADE_META, TRANSLATIONS } from './data/translations';
import { KarigarCard } from './components/KarigarCard';
import { KarigarProfileModal } from './components/KarigarProfileModal';
import { PostJobModal } from './components/PostJobModal';
import { RegisterKarigarModal } from './components/RegisterKarigarModal';
import { WageCalculator } from './components/WageCalculator';
import { BookingsView } from './components/BookingsView';

const INITIAL_BOOKINGS: BookingRequest[] = [
  {
    id: 'bk-1',
    karigarId: 'k-1',
    karigarName: 'Rameshwar Sharma',
    karigarTrade: 'carpentry',
    clientName: 'Sanjay Chawla',
    clientPhone: '+91 98290 11223',
    clientAddress: 'C-44, Vaishali Nagar, Jaipur',
    serviceDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    jobDescription: 'Modular wardrobe installation and hydraulic kitchen fitting checkup.',
    estimatedBudget: 4500,
    status: 'accepted',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'bk-2',
    karigarId: 'k-4',
    karigarName: 'Balwinder Singh',
    karigarTrade: 'electrical',
    clientName: 'Rajeev Singhal',
    clientPhone: '+91 98100 44556',
    clientAddress: 'Tower B, Sector 62, Noida',
    serviceDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    jobDescription: '3-phase distribution panel rewire and inverter connection.',
    estimatedBudget: 2500,
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
  }
];

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<'explore' | 'jobs' | 'calculator' | 'bookings'>('explore');

  // Persistence for karigars, jobs, and bookings
  const [karigars, setKarigars] = useState<Karigar[]>(() => {
    const saved = localStorage.getItem('ks_karigars');
    return saved ? JSON.parse(saved) : INITIAL_KARIGARS;
  });

  const [jobs, setJobs] = useState<JobPost[]>(() => {
    const saved = localStorage.getItem('ks_jobs');
    return saved ? JSON.parse(saved) : INITIAL_JOB_POSTS;
  });

  const [bookings, setBookings] = useState<BookingRequest[]>(() => {
    const saved = localStorage.getItem('ks_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  useEffect(() => {
    localStorage.setItem('ks_karigars', JSON.stringify(karigars));
  }, [karigars]);

  useEffect(() => {
    localStorage.setItem('ks_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('ks_bookings', JSON.stringify(bookings));
  }, [bookings]);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrade, setSelectedTrade] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [availableTodayOnly, setAvailableTodayOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);

  // Modals state
  const [selectedKarigarForProfile, setSelectedKarigarForProfile] = useState<Karigar | null>(null);
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);
  const [isRegisterKarigarOpen, setIsRegisterKarigarOpen] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const t = TRANSLATIONS[language];

  // Cities extracted
  const allCities = Array.from(new Set(karigars.map((k) => k.city)));

  // Filtered Karigars
  const filteredKarigars = karigars.filter((k) => {
    const matchesSearch =
      k.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.hindiName.includes(searchQuery) ||
      k.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTrade = selectedTrade === 'all' ? true : k.trade === selectedTrade;
    const matchesCity = selectedCity === 'all' ? true : k.city === selectedCity;
    const matchesVerified = verifiedOnly ? k.isAadhaarVerified || k.isSkillCertified : true;
    const matchesAvailable = availableTodayOnly ? k.isAvailableToday : true;
    const matchesRating = k.rating >= minRating;

    return (
      matchesSearch &&
      matchesTrade &&
      matchesCity &&
      matchesVerified &&
      matchesAvailable &&
      matchesRating
    );
  });

  // Handlers
  const handleJobPosted = (newJob: JobPost) => {
    setJobs([newJob, ...jobs]);
    showToast(language === 'hi' ? 'काम की आवश्यकता सफलतापूर्वक पोस्ट हुई!' : 'Work requirement posted successfully!');
    setActiveTab('jobs');
  };

  const handleKarigarRegistered = (newKarigar: Karigar) => {
    setKarigars([newKarigar, ...karigars]);
    showToast(
      language === 'hi'
        ? `बधाई! ${newKarigar.name} की कारीगर प्रोफाइल लाइव हो गई है!`
        : `Congratulations! ${newKarigar.name}'s profile is now live!`
    );
    setActiveTab('explore');
  };

  const handleBookingCreated = (bookingData: {
    karigarId: string;
    karigarName: string;
    karigarTrade: Karigar['trade'];
    clientName: string;
    clientPhone: string;
    clientAddress: string;
    serviceDate: string;
    jobDescription: string;
    estimatedBudget: number;
  }) => {
    const newBooking: BookingRequest = {
      id: `bk-${Date.now()}`,
      ...bookingData,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setBookings([newBooking, ...bookings]);
    showToast(language === 'hi' ? 'बुकिंग अनुरोध कारीगर को भेजा गया!' : 'Booking request sent to artisan!');
  };

  const handleUpdateBookingStatus = (id: string, status: BookingRequest['status']) => {
    setBookings(
      bookings.map((b) => (b.id === id ? { ...b, status } : b))
    );
    showToast(`Booking status updated to ${status}`);
  };

  const handleApplyToJob = (job: JobPost) => {
    setJobs(
      jobs.map((j) => (j.id === job.id ? { ...j, applicantsCount: j.applicantsCount + 1 } : j))
    );
    showToast(language === 'hi' ? 'आवेदन भेजा गया! नियोक्ता आपसे संपर्क करेंगे।' : 'Proposal submitted! Client has been notified.');
  };

  return (
    <div id="karigarsetu-root" className="min-h-screen bg-[#faf8f5] text-slate-900 flex flex-col font-sans selection:bg-amber-200 selection:text-amber-950">
      {/* Toast alert */}
      {toastMessage && (
        <div id="app-toast" className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-amber-500/30 text-sm font-medium animate-fade-in">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Heritage Notice Bar */}
      <div className="bg-amber-900 text-amber-100 text-[11px] sm:text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2 border-b border-amber-950">
        <span className="hidden sm:inline">🇮🇳</span>
        <span>
          {language === 'hi'
            ? 'कारीगर सेतु: 0% बिचौलिया कमीशन • भारत के कुशल कारीगरों और दस्तकारों का राष्ट्रीय मंच'
            : 'Karigar Setu: 0% Middleman Commission • Empowering India’s Artisans, Craftsmen & Trade Guilds'}
        </span>
        <span className="bg-amber-800 text-amber-200 text-[10px] px-2 py-0.2 rounded-full font-bold uppercase tracking-wider ml-1">
          Direct Connect
        </span>
      </div>

      {/* Primary Navigation Header */}
      <header id="main-header" className="bg-white/95 backdrop-blur-md border-b border-amber-900/10 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            {/* Logo and Brand */}
            <div
              onClick={() => setActiveTab('explore')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-700 via-amber-800 to-amber-900 flex items-center justify-center text-white shadow-md shadow-amber-900/20 group-hover:scale-105 transition-transform">
                <Hammer className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    {language === 'hi' ? 'कारीगर सेतु' : 'Karigar Setu'}
                  </span>
                  <span className="text-[11px] font-bold text-amber-800 bg-amber-100/70 border border-amber-300/60 px-2 py-0.5 rounded-md hidden sm:inline-block">
                    कारीगर सेतु
                  </span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-1 font-medium">
                  {t.tagline}
                </p>
              </div>
            </div>

            {/* Language Switcher & Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Language Switcher */}
              <button
                id="btn-language-toggle"
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl transition-colors cursor-pointer"
                title="Switch Language / भाषा बदलें"
              >
                <Globe className="w-3.5 h-3.5 text-amber-700" />
                <span>{language === 'en' ? 'हिन्दी (Hindi)' : 'English'}</span>
              </button>

              {/* Post Work Requirement */}
              <button
                id="btn-header-post-job"
                onClick={() => setIsPostJobOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-all cursor-pointer"
              >
                <Briefcase className="w-3.5 h-3.5 text-amber-700" />
                <span>{t.postJob}</span>
              </button>

              {/* Join as Karigar / Register */}
              <button
                id="btn-header-register-karigar"
                onClick={() => setIsRegisterKarigarOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 rounded-xl shadow-md shadow-amber-900/20 transition-all cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5 text-amber-300" />
                <span className="whitespace-nowrap">{t.joinAsKarigar}</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav id="nav-tabs" className="flex space-x-2 border-t border-slate-100 py-1.5 overflow-x-auto scrollbar-none">
            {[
              { id: 'explore', label: t.exploreKarigars, icon: Users, badge: karigars.length },
              { id: 'jobs', label: 'Work Requirements (काम)', icon: Briefcase, badge: jobs.length },
              { id: 'calculator', label: t.fairWageCalc, icon: Calculator },
              { id: 'bookings', label: t.myBookings, icon: CalendarCheck, badge: bookings.length },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'text-amber-950 bg-amber-100/90 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-800' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                        isActive ? 'bg-amber-800 text-amber-100' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* VIEW 1: EXPLORE KARIGARS DIRECTORY */}
        {activeTab === 'explore' && (
          <div id="view-explore" className="space-y-6">
            {/* Hero Search & Banner Section */}
            <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-12 translate-y-12">
                <Hammer className="w-80 h-80" />
              </div>

              <div className="max-w-2xl relative z-10 space-y-3">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500/20 text-amber-200 border border-amber-400/30 rounded-full text-xs font-semibold backdrop-blur-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                  <span>100% Direct Verification • Zero Hidden Cuts</span>
                </span>

                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                  {language === 'hi'
                    ? 'कुशल कारीगरों से सीधे जुड़ें, उचित दर पर काम कराएं'
                    : 'Directly Connect with Master Craftspeople & Artisans Across Bharat'}
                </h2>

                <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
                  {t.subTagline}
                </p>

                {/* Search Bar with City Selector inside Hero */}
                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="hero-search-input"
                      type="text"
                      placeholder={t.searchPlaceholder}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white text-slate-900 text-xs sm:text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-md placeholder:text-slate-400 font-medium"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="sm:w-48">
                    <select
                      id="hero-city-select"
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full px-3.5 py-3 bg-amber-950/80 text-amber-100 border border-amber-700/60 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
                    >
                      <option value="all">📍 {t.allCities}</option>
                      {allCities.map((city) => (
                        <option key={city} value={city}>
                          📍 {city}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Trade Categories Carousel / Chips */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Browse by Craft & Trade (हुनर)
                </span>
                {selectedTrade !== 'all' && (
                  <button
                    onClick={() => setSelectedTrade('all')}
                    className="text-xs font-bold text-amber-800 hover:underline"
                  >
                    Clear Filter
                  </button>
                )}
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                <button
                  id="trade-filter-all"
                  onClick={() => setSelectedTrade('all')}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                    selectedTrade === 'all'
                      ? 'bg-amber-800 text-white border-amber-900 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  ✨ {t.allTrades} ({karigars.length})
                </button>

                {Object.entries(TRADE_META).map(([key, item]) => {
                  const isSelected = selectedTrade === key;
                  const count = karigars.filter((k) => k.trade === key).length;
                  return (
                    <button
                      key={key}
                      id={`trade-filter-${key}`}
                      onClick={() => setSelectedTrade(key)}
                      className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-amber-800 text-white border-amber-900 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span>{language === 'hi' ? item.nameHi : item.nameEn}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                          isSelected ? 'bg-amber-950 text-amber-200' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Filters Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5 text-amber-700" />
                  <span>Filters:</span>
                </span>

                <button
                  id="filter-verified"
                  onClick={() => setVerifiedOnly(!verifiedOnly)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                    verifiedOnly
                      ? 'bg-blue-50 text-blue-800 border-blue-300 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>{t.verifiedOnly}</span>
                </button>

                <button
                  id="filter-available"
                  onClick={() => setAvailableTodayOnly(!availableTodayOnly)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                    availableTodayOnly
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t.availableOnly}</span>
                </button>

                <button
                  id="filter-rating-4"
                  onClick={() => setMinRating(minRating === 4.8 ? 0 : 4.8)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                    minRating === 4.8
                      ? 'bg-amber-50 text-amber-900 border-amber-300 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                  <span>Top Rated (4.8+)</span>
                </button>
              </div>

              <div className="text-xs text-slate-500 font-medium">
                Showing <strong className="text-slate-900">{filteredKarigars.length}</strong> {t.totalFound}
              </div>
            </div>

            {/* Karigars Grid */}
            {filteredKarigars.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredKarigars.map((karigar) => (
                  <KarigarCard
                    key={karigar.id}
                    karigar={karigar}
                    language={language}
                    onViewProfile={(k) => setSelectedKarigarForProfile(k)}
                    onRequestBooking={(k) => setSelectedKarigarForProfile(k)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-12 text-center">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">No Karigars Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                  Try adjusting your search keywords, clearing trade filters, or expanding to other cities.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedTrade('all');
                    setSelectedCity('all');
                    setVerifiedOnly(false);
                    setAvailableTodayOnly(false);
                    setMinRating(0);
                  }}
                  className="px-4 py-2 bg-amber-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: JOB BOARD / WORK REQUIREMENTS */}
        {activeTab === 'jobs' && (
          <div id="view-jobs" className="space-y-6">
            <div className="bg-white rounded-3xl border border-amber-900/10 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Briefcase className="w-5 h-5 text-amber-800" />
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    Work Requirements & Job Requests (काम की आवश्यकताएं)
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-600">
                  Clients, contractors, and boutique owners seeking skilled artisans. Connect directly or post a requirement.
                </p>
              </div>

              <button
                id="btn-jobs-post-new"
                onClick={() => setIsPostJobOpen(true)}
                className="px-4 py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-900/20 flex items-center gap-2 cursor-pointer transition-all shrink-0"
              >
                <Plus className="w-4 h-4 text-amber-300" />
                <span>{t.postJob}</span>
              </button>
            </div>

            {/* Jobs List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {jobs.map((job) => {
                const meta = TRADE_META[job.trade] || TRADE_META.carpentry;
                return (
                  <div
                    key={job.id}
                    id={`job-card-${job.id}`}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-amber-500/50 transition-all"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200">
                          {language === 'hi' ? meta.nameHi : meta.nameEn}
                        </span>

                        {job.isUrgent && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-200 flex items-center gap-1">
                            <span>🔥 Urgent</span>
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-base text-slate-900 leading-snug mb-2">
                        {job.title}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-3">
                        {job.description}
                      </p>

                      <div className="space-y-1.5 text-xs text-slate-500 border-t border-slate-100 pt-3">
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <MapPin className="w-3.5 h-3.5 text-amber-700" />
                          <span>{job.locality}, {job.city}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-600">Budget / Rate:</span>
                          <span className="font-bold text-amber-950 text-sm">
                            ₹{job.budgetAmount.toLocaleString('en-IN')}{' '}
                            <span className="text-[11px] text-slate-500 font-normal">
                              ({job.budgetType === 'daily' ? 'per day' : 'fixed total'})
                            </span>
                          </span>
                        </div>

                        {job.durationDays && (
                          <div className="flex items-center justify-between text-[11px]">
                            <span>Est. Duration:</span>
                            <span className="font-medium text-slate-700">{job.durationDays} Days</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="text-[11px] text-slate-500">
                        <strong>{job.applicantsCount}</strong> Karigars applied
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${job.clientPhone.replace(/\s+/g, '')}`}
                          className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                          title="Call Client"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>

                        <button
                          id={`btn-apply-job-${job.id}`}
                          onClick={() => handleApplyToJob(job)}
                          className="px-3.5 py-1.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                        >
                          Apply Now
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 3: FAIR WAGE CALCULATOR */}
        {activeTab === 'calculator' && (
          <div id="view-calculator" className="space-y-6">
            <WageCalculator language={language} />
          </div>
        )}

        {/* VIEW 4: MY BOOKINGS & INQUIRIES */}
        {activeTab === 'bookings' && (
          <div id="view-bookings" className="space-y-6">
            <BookingsView
              bookings={bookings}
              language={language}
              onUpdateStatus={handleUpdateBookingStatus}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer id="main-footer" className="bg-slate-900 text-white mt-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-600 flex items-center justify-center text-white">
                  <Hammer className="w-4 h-4 text-amber-200" />
                </div>
                <span className="text-lg font-bold text-white tracking-tight">Karigar Setu</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                National portal bridging traditional Indian craftsmen, construction technicians, and artisans directly with customers and contractors.
              </p>
              <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold">
                <span>0% Middleman Fees</span>
                <span>•</span>
                <span>Direct WhatsApp & Call</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
                Key Trades & Crafts
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li>• Banarasi Handloom & Zari Weavers</li>
                <li>• Shekhawati Teakwood Carpenters</li>
                <li>• Makrana Marble & Stone Sculptors</li>
                <li>• A-Grade Licensed Electricians</li>
                <li>• Terracotta & Glazed Pottery Masters</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
                Verification & Quality
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li>• Aadhaar Identity Check</li>
                <li>• NSDC & Guild Skill Certifications</li>
                <li>• Verified Customer Reviews</li>
                <li>• Standardized Wage Benchmarks</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
                Join the Movement
              </h4>
              <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                Are you a skilled karigar or running a craft workshop? Register for free today.
              </p>
              <button
                onClick={() => setIsRegisterKarigarOpen(true)}
                className="w-full py-2 px-3 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Register as Karigar (निःशुल्क जुड़ें)
              </button>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} Karigar Setu (कारीगर सेतु) • Crafting Bharat’s Future with Dignity of Labor.
          </div>
        </div>
      </footer>

      {/* Profile & Portfolio Modal */}
      {selectedKarigarForProfile && (
        <KarigarProfileModal
          karigar={selectedKarigarForProfile}
          language={language}
          onClose={() => setSelectedKarigarForProfile(null)}
          onSubmitBooking={handleBookingCreated}
        />
      )}

      {/* Post Job Modal */}
      {isPostJobOpen && (
        <PostJobModal
          language={language}
          onClose={() => setIsPostJobOpen(false)}
          onJobPosted={handleJobPosted}
        />
      )}

      {/* Register Karigar Modal */}
      {isRegisterKarigarOpen && (
        <RegisterKarigarModal
          language={language}
          onClose={() => setIsRegisterKarigarOpen(false)}
          onKarigarRegistered={handleKarigarRegistered}
        />
      )}
    </div>
  );
}
