import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useReport } from '../hooks/useReport';
import Loader from '../components/Loader';
import { TrendingUp, Zap, Eye, Search, FileText, AlertCircle, CheckCircle2, Clock, Globe, AlignLeft } from 'lucide-react';
import PerformanceView from '../components/dashboard/PerformanceView';
import SEOView from '../components/dashboard/SEOView';
import UXMobileView from '../components/dashboard/UXMobileView';
import ContentView from '../components/dashboard/ContentView';

export default function Dashboard() {
    const { reportId } = useParams();
    const navigate = useNavigate();
    const { report, loading, error } = useReport(reportId);
    const [activeTab, setActiveTab] = useState('overview');

    if (loading) return <Loader />;

    if (error || !report) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20 text-center">
                    <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-red-500/20 text-red-400 rounded-full">
                        <AlertCircle size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Unable to Load Report</h2>
                    <p className="text-gray-300 mb-8">{error || 'Report not found'}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    const moduleScores = report.aggregator?.module_scores || {};
    const overallScore = report.aggregator?.website_health_score || 0;
    const grade = report.aggregator?.health_grade || 'N/A';

    const getScoreColor = (score: number) => {
        if (score >= 90) return 'from-emerald-500 to-green-600';
        if (score >= 70) return 'from-blue-500 to-cyan-600';
        if (score >= 50) return 'from-amber-500 to-orange-600';
        if (score >= 35) return 'from-orange-500 to-red-600';
        return 'from-red-500 to-pink-600';
    };

    const getScoreTextColor = (score: number) => {
        if (score >= 90) return 'text-emerald-500';
        if (score >= 70) return 'text-blue-500';
        if (score >= 50) return 'text-amber-500';
        if (score >= 35) return 'text-orange-500';
        return 'text-red-500';
    };

    const modules = [
        {
            name: 'Performance',
            id: 'performance',
            score: moduleScores.performance || 0,
            icon: Zap,
            gradient: 'from-yellow-400 to-orange-500',
            bgGradient: 'from-yellow-50 to-orange-50',
            data: report.modules.performance
        },
        {
            name: 'SEO',
            id: 'seo',
            score: moduleScores.seo || 0,
            icon: Search,
            gradient: 'from-green-400 to-emerald-500',
            bgGradient: 'from-green-50 to-emerald-50',
            data: report.modules.seo
        },
        {
            name: 'UX & Accessibility',
            id: 'ux',
            score: moduleScores.ux || 0,
            icon: Eye,
            gradient: 'from-blue-400 to-indigo-500',
            bgGradient: 'from-blue-50 to-indigo-50',
            data: report.modules.ux
        },
        {
            name: 'Content',
            id: 'content',
            score: moduleScores.content || 0,
            icon: FileText,
            gradient: 'from-purple-400 to-pink-500',
            bgGradient: 'from-purple-50 to-pink-50',
            data: report.modules.content
        }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'performance':
                return <PerformanceView data={report.modules.performance} />;
            case 'seo':
                return <SEOView data={report.modules.seo} />;
            case 'ux':
                return <UXMobileView data={report.modules.ux} />;
            case 'content':
                return <ContentView data={report.modules.content} />;
            default:
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Overall Score - Hero Card */}
                        <div className="relative overflow-hidden bg-gradient-to-br from-white to-blue-50/50 rounded-2xl sm:rounded-3xl shadow-xl border border-white/60 p-6 sm:p-8 md:p-12 mb-6 sm:mb-8">
                            {/* Background decoration */}
                            <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl -z-0"></div>

                            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 sm:gap-12">
                                {/* Score Circle */}
                                <div className="relative flex-shrink-0">
                                    <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 relative">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle
                                                cx="50%"
                                                cy="50%"
                                                r="45%"
                                                stroke="#e2e8f0"
                                                strokeWidth="12"
                                                fill="none"
                                            />
                                            <circle
                                                cx="50%"
                                                cy="50%"
                                                r="45%"
                                                stroke="url(#scoreGradient)"
                                                strokeWidth="12"
                                                fill="none"
                                                strokeDasharray={`${(overallScore / 100) * 628} 628`}
                                                strokeLinecap="round"
                                                className="transition-all duration-1000 ease-out"
                                            />
                                            <defs>
                                                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                    <stop offset="0%" className={`${overallScore >= 90 ? 'stop-emerald-500' : overallScore >= 70 ? 'stop-blue-500' : overallScore >= 50 ? 'stop-amber-500' : 'stop-red-500'}`} />
                                                    <stop offset="100%" className={`${overallScore >= 90 ? 'stop-green-600' : overallScore >= 70 ? 'stop-cyan-600' : overallScore >= 50 ? 'stop-orange-600' : 'stop-pink-600'}`} />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <div className={`text-4xl sm:text-5xl md:text-6xl font-black ${getScoreTextColor(overallScore)}`}>
                                                {overallScore}
                                            </div>
                                            <div className="px-3 sm:px-4 py-0.5 sm:py-1 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full mt-1 sm:mt-2">
                                                <div className="text-xs sm:text-sm font-bold text-slate-700">Grade {grade}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Score Details */}
                                <div className="flex-1 text-center md:text-left">
                                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 sm:mb-3">Overall Health Score</h2>
                                    <p className="text-slate-600 text-sm sm:text-base md:text-lg mb-4 sm:mb-6 leading-relaxed">
                                        Your website scored <span className={`font-bold ${getScoreTextColor(overallScore)}`}>{overallScore}/100</span> based on comprehensive analysis across Performance, SEO, UX, and Content quality metrics.
                                    </p>

                                    {/* Risk Domains */}
                                    {report.aggregator?.dominant_risk_domains && report.aggregator.dominant_risk_domains.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
                                            <span className="text-xs sm:text-sm font-semibold text-slate-700 w-full sm:w-auto text-center md:text-left block">Areas to improve:</span>
                                            {report.aggregator.dominant_risk_domains.map((domain: string, idx: number) => (
                                                <span
                                                    key={idx}
                                                    className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-md"
                                                >
                                                    {domain}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex items-center justify-center md:justify-start gap-2 sm:gap-3">
                                        <TrendingUp className="text-emerald-500 flex-shrink-0" size={16} />
                                        <span className="text-slate-600 text-xs sm:text-sm font-medium">
                                            Analysis completed in {((new Date(report.finished_at).getTime() - new Date(report.created_at).getTime()) / 1000).toFixed(1)}s
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Module Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            {modules.map((module) => {
                                const Icon = module.icon;
                                return (
                                    <div
                                        key={module.name}
                                        onClick={() => setActiveTab(module.id)}
                                        className="group relative overflow-hidden bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-slate-300 cursor-pointer"
                                    >
                                        {/* Gradient header */}
                                        <div className={`h-1.5 sm:h-2 bg-gradient-to-r ${module.gradient}`}></div>

                                        <div className="p-4 sm:p-6">
                                            {/* Header */}
                                            <div className="flex items-center justify-between mb-4 sm:mb-6">
                                                <div className="flex items-center gap-2 sm:gap-3">
                                                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${module.gradient} flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                                                        <Icon className="text-white" size={20} />
                                                    </div>
                                                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-900">{module.name}</h3>
                                                </div>
                                                <div className={`text-3xl sm:text-4xl font-black ${getScoreTextColor(module.score)}`}>
                                                    {module.score}
                                                </div>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="h-2 sm:h-3 bg-slate-100 rounded-full overflow-hidden mb-4 sm:mb-6">
                                                <div
                                                    className={`h-full bg-gradient-to-r ${getScoreColor(module.score)} transition-all duration-1000 rounded-full`}
                                                    style={{ width: `${module.score}%` }}
                                                ></div>
                                            </div>

                                            {/* Module-specific metrics */}
                                            <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                                {module.name === 'Performance' && module.data && (
                                                    <>
                                                        <MetricCard label="LCP" value={module.data.metrics?.lcp_s ? `${module.data.metrics.lcp_s.toFixed(2)}s` : 'N/A'} />
                                                        <MetricCard label="CLS" value={module.data.metrics?.cls !== undefined ? module.data.metrics.cls.toFixed(3) : 'N/A'} />
                                                        <MetricCard label="TTFB" value={module.data.metrics?.ttfb_s ? `${module.data.metrics.ttfb_s.toFixed(2)}s` : 'N/A'} />
                                                        <MetricCard label="Confidence" value={module.data.confidence || 'N/A'} />
                                                    </>
                                                )}
                                                {module.name === 'SEO' && module.data && (
                                                    <>
                                                        <MetricCard label="Indexability" value={module.data.indexability_status || 'N/A'} />
                                                        <MetricCard label="Title" value={`${module.data.title_length || 0} chars`} />
                                                        <MetricCard label="H1 Count" value={module.data.h1_count || 0} />
                                                        <MetricCard label="Missing Alt" value={module.data.images_missing_alt_count || 0} />
                                                    </>
                                                )}
                                                {module.name === 'UX & Accessibility' && module.data && (
                                                    <>
                                                        <MetricCard label="Violations" value={module.data.violations_count || 0} />
                                                        <MetricCard label="Critical" value={module.data.violations_by_impact?.critical || 0} color="text-red-600" />
                                                        <MetricCard label="Serious" value={module.data.violations_by_impact?.serious || 0} color="text-orange-600" />
                                                        <MetricCard label="CTAs" value={module.data.ctas_above_fold || 0} />
                                                    </>
                                                )}
                                                {module.name === 'Content' && module.data && (
                                                    <>
                                                        <MetricCard label="Words" value={module.data.word_count || 0} />
                                                        <MetricCard label="Depth" value={module.data.content_depth_status || 'N/A'} />
                                                        <MetricCard label="Readability" value={module.data.flesch_reading_ease ? module.data.flesch_reading_ease.toFixed(1) : 'N/A'} />
                                                        <MetricCard label="Intent" value={module.data.intent_match_level || 'N/A'} />
                                                    </>
                                                )}
                                            </div>

                                            <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                                                <span className="text-sm font-semibold text-blue-600 group-hover:text-blue-700 transition-colors flex items-center justify-center gap-1">
                                                    View Detailed Report <Clock size={14} className="ml-1" />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 pt-4 pb-8">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 space-y-4 sm:space-y-6 md:space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-white/60 sticky top-4 z-50">
                    <div className="w-full md:w-auto">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                            <span className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs font-bold uppercase tracking-wide rounded-full shadow-lg">
                                <CheckCircle2 size={12} className="sm:w-3.5 sm:h-3.5" />
                                Complete
                            </span>
                            <span className="flex items-center gap-1.5 sm:gap-2 text-slate-500 text-xs sm:text-sm">
                                <Clock size={12} className="sm:w-3.5 sm:h-3.5" />
                                {new Date(report.created_at).toLocaleDateString()}
                            </span>
                        </div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 bg-clip-text text-transparent">
                            Website Analysis Report
                        </h1>
                        <div className="flex items-center gap-2 mt-2 text-slate-600">
                            <Globe size={14} className="flex-shrink-0" />
                            <a href={report.url} target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm hover:text-blue-600 transition-colors font-medium truncate">
                                {report.url}
                            </a>
                        </div>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        <button
                            onClick={() => navigate('/')}
                            className="flex-1 md:flex-none bg-white hover:bg-slate-50 text-slate-700 font-semibold py-2.5 px-4 rounded-lg border border-slate-200 shadow-sm transition-all text-sm"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex flex-wrap items-center gap-2 p-1 bg-slate-200/50 rounded-xl overflow-x-auto">
                    {[
                        { id: 'overview', label: 'Overview', icon: FileText },
                        { id: 'performance', label: 'Performance', icon: Zap },
                        { id: 'seo', label: 'SEO', icon: Search },
                        { id: 'ux', label: 'UX & Mobile', icon: Eye },
                        { id: 'content', label: 'Content', icon: AlignLeft }
                    ].map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap ${isActive
                                        ? 'bg-white text-blue-600 shadow-md transform scale-100'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                                    }`}
                            >
                                <Icon size={16} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Main Content Area */}
                <div className="min-h-[500px]">
                    {renderContent()}
                </div>

                {/* Footer Metadata */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-sm border border-white/60 p-4 sm:p-6 mt-8">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-3 sm:mb-4 flex items-center gap-2">
                        <FileText size={18} className="text-slate-600 flex-shrink-0" />
                        Report Details
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 text-xs sm:text-sm">
                        <div>
                            <span className="text-slate-500 font-semibold block mb-1">Report ID</span>
                            <span className="text-slate-900 font-mono text-xs break-all">{report._id}</span>
                        </div>
                        <div>
                            <span className="text-slate-500 font-semibold block mb-1">Status</span>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                <span className="text-slate-900 capitalize font-medium">{report.status}</span>
                            </div>
                        </div>
                        <div className="sm:col-span-2 md:col-span-1">
                            <span className="text-slate-500 font-semibold block mb-1">Final URL</span>
                            <a href={report.final_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 font-medium text-xs break-all">
                                {report.final_url}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper component for metrics
function MetricCard({ label, value, color = 'text-slate-900' }: { label: string; value: string | number; color?: string }) {
    return (
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-md sm:rounded-lg p-2 sm:p-3 border border-slate-200">
            <div className="text-xs text-slate-500 font-semibold uppercase mb-0.5 sm:mb-1">{label}</div>
            <div className={`text-base sm:text-lg font-bold ${color} capitalize`}>{value}</div>
        </div>
    );
}
