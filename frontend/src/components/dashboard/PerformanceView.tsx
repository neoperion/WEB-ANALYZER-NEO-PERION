import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { Zap, AlertTriangle, Clock, Activity } from 'lucide-react';

interface PerformanceViewProps {
    data: any;
}

const PerformanceView: React.FC<PerformanceViewProps> = ({ data }) => {
    if (!data) return <div className="p-8 text-center text-slate-500">No performance data available.</div>;

    const metrics = [
        { name: 'LCP (s)', value: data.metrics?.lcp_s || 0, threshold: 2.5, good: '< 2.5s' },
        { name: 'TTFB (s)', value: data.metrics?.ttfb_s || 0, threshold: 0.8, good: '< 0.8s' },
        { name: 'Speed Index (s)', value: data.metrics?.speed_index_s || 0, threshold: 3.4, good: '< 3.4s' },
    ];

    const clsValue = data.metrics?.cls || 0;

    const getScoreColor = (score: number) => {
        if (score >= 90) return 'text-emerald-500';
        if (score >= 50) return 'text-amber-500';
        return 'text-red-500';
    };

    const getMetricStatus = (value: number, threshold: number) => {
        return value <= threshold ? 'Good' : 'Needs Improvement';
    };

    const getMetricColor = (value: number, threshold: number) => {
        return value <= threshold ? '#34d399' : '#fbbf24'; // Emerald-400 or Amber-400
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 rounded-xl">
                        <Zap className="w-8 h-8 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Performance Analysis</h2>
                        <p className="text-slate-500 text-sm">Core Web Vitals & Loading Speed</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className={`text-4xl font-black ${getScoreColor(data.score || 0)}`}>
                        {data.score || 0}
                    </div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Score</div>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Visual Chart */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-indigo-500" />
                        Core Metrics Overview
                    </h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={metrics} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    width={100}
                                    tick={{ fill: '#64748b', fontSize: 12 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="value" barSize={32} radius={[0, 4, 4, 0]}>
                                    {metrics.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={getMetricColor(entry.value, entry.threshold)} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Detailed Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {metrics.map((metric, idx) => (
                        <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col justify-between hover:border-indigo-100 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-slate-500 font-medium text-sm">{metric.name}</span>
                                <Clock className="w-4 h-4 text-slate-300" />
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-slate-900">{metric.value.toFixed(2)}</span>
                            </div>
                            <div className="mt-2 flex items-center justify-between">
                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${metric.value <= metric.threshold ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                    {getMetricStatus(metric.value, metric.threshold)}
                                </span>
                                <span className="text-xs text-slate-400">Target: {metric.good}</span>
                            </div>
                        </div>
                    ))}

                    {/* CLS Special Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col justify-between hover:border-indigo-100 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-slate-500 font-medium text-sm">CLS (Layout Shift)</span>
                            <Activity className="w-4 h-4 text-slate-300" />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-slate-900">{clsValue.toFixed(3)}</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${clsValue <= 0.1 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                {clsValue <= 0.1 ? 'Stable' : 'Unstable'}
                            </span>
                            <span className="text-xs text-slate-400">Target: &lt; 0.1</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Performance Issues List */}
            {data.issues && data.issues.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-amber-500" />
                            Diagnostic Issues
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-600 text-xs font-bold">
                            {data.issues.length} Issues
                        </span>
                    </div>
                    <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
                        {data.issues.map((issue: any, index: number) => (
                            <div key={index} className="p-4 hover:bg-slate-50 transition-colors flex gap-4 items-start">
                                <div className="mt-1.5 flex-shrink-0">
                                    {(issue.severity === 'critical' || issue.severity === 'high') ? (
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-500 ring-4 ring-red-100"></div>
                                    ) : (
                                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-amber-100"></div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-4">
                                        <h4 className="text-sm font-semibold text-slate-900 leading-tight">{issue.description || issue.id}</h4>
                                        <span className={`flex-shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border ${issue.severity === 'critical' ? 'bg-red-50 text-red-600 border-red-100' :
                                                issue.severity === 'high' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                                    'bg-amber-50 text-amber-600 border-amber-100'
                                            }`}>
                                            {issue.severity || 'Medium'}
                                        </span>
                                    </div>
                                    {issue.details && (
                                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{JSON.stringify(issue.details)}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PerformanceView;
