import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip
} from 'recharts';
import { Search, Globe, Type, Image, Link, AlertCircle } from 'lucide-react';

interface SEOViewProps {
    data: any;
}

const SEOView: React.FC<SEOViewProps> = ({ data }) => {
    if (!data) return <div className="p-8 text-center text-slate-500">No SEO data available.</div>;

    const getScoreColor = (score: number) => {
        if (score >= 90) return 'text-emerald-500';
        if (score >= 50) return 'text-amber-500';
        return 'text-red-500';
    };

    const issuesCount = data.issues?.length || 0;
    const passedChecks = 10 - issuesCount; // Assuming 10 base checks for visualization
    const chartData = [
        { name: 'Passed', value: passedChecks > 0 ? passedChecks : 0, color: '#10b981' }, // emerald-500
        { name: 'Issues', value: issuesCount, color: '#f43f5e' }, // rose-500
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-sky-50 rounded-xl">
                        <Search className="w-8 h-8 text-sky-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">SEO Audit</h2>
                        <p className="text-slate-500 text-sm">Search Engine Optimization & Visibility</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className={`text-4xl font-black ${getScoreColor(data.score || 0)}`}>
                        {data.score || 0}
                    </div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Score</div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Visual Overview */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:col-span-1 flex flex-col items-center justify-center">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 w-full text-left">Health Overview</h3>
                    <div className="h-48 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                            <span className="text-3xl font-bold text-slate-900">{data.score}%</span>
                            <span className="text-xs text-slate-500 font-medium uppercase">Optimization</span>
                        </div>
                    </div>
                    <div className="flex gap-4 mt-4 text-xs font-medium">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            <span className="text-slate-600">Passed</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                            <span className="text-slate-600">Issues</span>
                        </div>
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Indexability */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 hover:border-sky-100 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                            <div className="p-2 bg-slate-50 rounded-lg">
                                <Globe className="w-5 h-5 text-slate-600" />
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${data.indexability_status === 'indexable' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                {data.indexability_status || 'Unknown'}
                            </span>
                        </div>
                        <div className="mt-2">
                            <div className="text-slate-500 text-xs font-medium uppercase tracking-wide">Indexability</div>
                            <div className="text-lg font-bold text-slate-900 mt-0.5">
                                {data.indexability_status === 'indexable' ? 'Search Engines Can Crawl' : 'Crawling Blocked'}
                            </div>
                        </div>
                    </div>

                    {/* Title Analysis */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 hover:border-sky-100 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                            <div className="p-2 bg-slate-50 rounded-lg">
                                <Type className="w-5 h-5 text-slate-600" />
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${(data.title_length >= 30 && data.title_length <= 60) ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                {data.title_length} Chars
                            </span>
                        </div>
                        <div className="mt-2">
                            <div className="text-slate-500 text-xs font-medium uppercase tracking-wide">Page Title</div>
                            <div className="text-lg font-bold text-slate-900 mt-0.5">
                                {(data.title_length >= 30 && data.title_length <= 60) ? 'Optimal Length' : 'Length Needs Optimization'}
                            </div>
                        </div>
                    </div>

                    {/* Headings */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 hover:border-sky-100 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                            <div className="p-2 bg-slate-50 rounded-lg">
                                <Type className="w-5 h-5 text-slate-600" />
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${data.h1_count === 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                {data.h1_count} Tag(s)
                            </span>
                        </div>
                        <div className="mt-2">
                            <div className="text-slate-500 text-xs font-medium uppercase tracking-wide">H1 Structure</div>
                            <div className="text-lg font-bold text-slate-900 mt-0.5">
                                {data.h1_count === 1 ? 'Correctly Structured' : data.h1_count === 0 ? 'Missing H1' : 'Multiple H1s Found'}
                            </div>
                        </div>
                    </div>

                    {/* Image Alt */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 hover:border-sky-100 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                            <div className="p-2 bg-slate-50 rounded-lg">
                                <Image className="w-5 h-5 text-slate-600" />
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${data.images_missing_alt_count === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                {data.images_missing_alt_count} Issues
                            </span>
                        </div>
                        <div className="mt-2">
                            <div className="text-slate-500 text-xs font-medium uppercase tracking-wide">Image Alt Text</div>
                            <div className="text-lg font-bold text-slate-900 mt-0.5">
                                {data.images_missing_alt_count === 0 ? 'All Images Optimized' : 'Missing Descriptions'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SEO Issues List */}
            {data.issues && data.issues.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-sky-500" />
                            SEO Opportunities
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-600 text-xs font-bold">
                            {data.issues.length}
                        </span>
                    </div>
                    <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
                        {data.issues.map((issue: any, index: number) => (
                            <div key={index} className="p-4 hover:bg-slate-50 transition-colors flex gap-4 items-start">
                                <Link className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                    <h4 className="text-sm font-semibold text-slate-900">{issue.description || issue.id}</h4>
                                    {issue.details && (
                                        <p className="text-xs text-slate-500 mt-1">{JSON.stringify(issue.details)}</p>
                                    )}
                                </div>
                                <span className={`flex-shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border ${issue.severity === 'critical' ? 'bg-red-50 text-red-600 border-red-100' :
                                        issue.severity === 'high' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                            'bg-amber-50 text-amber-600 border-amber-100'
                                    }`}>
                                    {issue.severity || 'Medium'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SEOView;
