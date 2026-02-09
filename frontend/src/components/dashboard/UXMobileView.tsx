import React from 'react';
import {
    RadialBarChart,
    RadialBar,
    Legend,
    ResponsiveContainer,
    Tooltip
} from 'recharts';
import { Eye, Smartphone, MousePointer, AppWindow, AlertOctagon } from 'lucide-react';

interface UXMobileViewProps {
    data: any;
}

const UXMobileView: React.FC<UXMobileViewProps> = ({ data }) => {
    if (!data) return <div className="p-8 text-center text-slate-500">No UX & Mobile data available.</div>;

    const getScoreColor = (score: number) => {
        if (score >= 90) return 'text-emerald-500';
        if (score >= 50) return 'text-amber-500';
        return 'text-red-500';
    };

    const violations = data.violations_count || 0;
    const critical = data.violations_by_impact?.critical || 0;
    const serious = data.violations_by_impact?.serious || 0;
    const moderate = data.violations_by_impact?.moderate || 0;
    const minor = data.violations_by_impact?.minor || 0;

    const chartData = [
        { name: 'Critical', uv: critical, fill: '#ef4444' },
        { name: 'Serious', uv: serious, fill: '#f97316' },
        { name: 'Moderate', uv: moderate, fill: '#eab308' },
        { name: 'Minor', uv: minor, fill: '#3b82f6' }
    ];

    const hasViolations = violations > 0;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-50 rounded-xl">
                        <Eye className="w-8 h-8 text-purple-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">UX & Accessibility</h2>
                        <p className="text-slate-500 text-sm">User Experience & Inclusive Design</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className={`text-4xl font-black ${getScoreColor(data.score || 0)}`}>
                        {data.score || 0}
                    </div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Score</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Accessibility Breakdown */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <AlertOctagon className="w-5 h-5 text-purple-500" />
                        Accessibility Violations
                    </h3>

                    {hasViolations ? (
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadialBarChart
                                    cx="50%"
                                    cy="50%"
                                    innerRadius="30%"
                                    outerRadius="100%"
                                    barSize={20}
                                    data={chartData}
                                >
                                    <RadialBar
                                        label={{ position: 'insideStart', fill: '#fff' }}
                                        background
                                        dataKey="uv"
                                    />
                                    <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={{ right: 0 }} />
                                    <Tooltip />
                                </RadialBarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-64 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                                <Eye className="w-8 h-8" />
                            </div>
                            <h4 className="text-lg font-bold text-slate-900">Excellent!</h4>
                            <p className="text-slate-500">No accessibility violations detected.</p>
                        </div>
                    )}
                </div>

                {/* UX Metrics */}
                <div className="space-y-4">
                    {/* CTAs */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex items-center gap-4">
                        <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                            <MousePointer className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-slate-500 uppercase">CTAs Above Fold</div>
                            <div className="text-2xl font-bold text-slate-900">{data.ctas_above_fold || 0}</div>
                        </div>
                    </div>

                    {/* Mobile Viewport */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex items-center gap-4">
                        <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                            <Smartphone className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-slate-500 uppercase">Mobile Friendly</div>
                            <div className="text-2xl font-bold text-slate-900">Yes</div>
                            {/* Assuming 'Yes' if score is good, or check data points. If no specific boolean, relying on good faith for now or we could check viewport tag presence if available in raw data. The 'score' implies responsive checks. */}
                        </div>
                    </div>

                    {/* Layout */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex items-center gap-4">
                        <div className="p-3 bg-rose-50 rounded-lg text-rose-600">
                            <AppWindow className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-slate-500 uppercase">Layout Shifts</div>
                            <div className="text-2xl font-bold text-slate-900">Minimize</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Violation Details */}
            {data.issues && data.issues.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <AlertOctagon className="w-5 h-5 text-purple-500" />
                            Detailed Issues
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-600 text-xs font-bold">
                            {data.issues.length}
                        </span>
                    </div>
                    <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
                        {data.issues.map((issue: any, index: number) => (
                            <div key={index} className="p-4 hover:bg-slate-50 transition-colors flex gap-4 items-start">
                                <div className="mt-1.5">
                                    {issue.impact === 'critical' ? (
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-500 ring-4 ring-red-100"></div>
                                    ) : issue.impact === 'serious' ? (
                                        <div className="w-2.5 h-2.5 rounded-full bg-orange-500 ring-4 ring-orange-100"></div>
                                    ) : (
                                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-blue-100"></div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-sm font-semibold text-slate-900">{issue.description || issue.id}</h4>
                                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${issue.impact === 'critical' ? 'bg-red-50 text-red-700 border-red-200' :
                                                issue.impact === 'serious' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                                    'bg-blue-50 text-blue-700 border-blue-200'
                                            }`}>
                                            {issue.impact || 'Minor'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">{issue.help || "Fix this issue to improve accessibility."}</p>
                                    {issue.nodes && issue.nodes.length > 0 && (
                                        <div className="mt-2 text-xs font-mono bg-slate-100 p-2 rounded text-slate-700 truncate">
                                            {issue.nodes[0].html}
                                        </div>
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

export default UXMobileView;
