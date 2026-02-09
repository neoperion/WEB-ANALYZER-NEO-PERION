import React from 'react';
import { FileText, AlignLeft, BookOpen, MessageSquare, CheckCircle, AlertTriangle } from 'lucide-react';

interface ContentViewProps {
    data: any;
}

const ContentView: React.FC<ContentViewProps> = ({ data }) => {
    if (!data) return <div className="p-8 text-center text-slate-500">No content data available.</div>;

    const getScoreColor = (score: number) => {
        if (score >= 90) return 'text-emerald-500';
        if (score >= 50) return 'text-amber-500';
        return 'text-red-500';
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-pink-50 rounded-xl">
                        <FileText className="w-8 h-8 text-pink-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Content Quality</h2>
                        <p className="text-slate-500 text-sm">Structure, Relevance & Readability</p>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Word Count */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 hover:border-pink-100 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-slate-500 font-medium text-xs uppercase tracking-wide">Word Count</span>
                        <AlignLeft className="w-4 h-4 text-pink-400" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{data.word_count || 0}</div>
                    <div className="text-xs text-slate-400 mt-1">Total words on page</div>
                </div>

                {/* Readability */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 hover:border-pink-100 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-slate-500 font-medium text-xs uppercase tracking-wide">Readability</span>
                        <BookOpen className="w-4 h-4 text-pink-400" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900">
                        {data.flesch_reading_ease ? data.flesch_reading_ease.toFixed(1) : 'N/A'}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">Flesch Reading Ease</div>
                </div>

                {/* Content Depth */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 hover:border-pink-100 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-slate-500 font-medium text-xs uppercase tracking-wide">Depth</span>
                        <div className={`w-2 h-2 rounded-full ${data.content_depth_status === 'high' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                    </div>
                    <div className="text-2xl font-bold text-slate-900 capitalize text-sm sm:text-lg">
                        {data.content_depth_status || 'Unknown'}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">Topic coverage</div>
                </div>

                {/* Intent Match */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 hover:border-pink-100 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-slate-500 font-medium text-xs uppercase tracking-wide">Intent</span>
                        <MessageSquare className="w-4 h-4 text-pink-400" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900 capitalize text-sm sm:text-lg">
                        {data.intent_match_level || 'Unknown'}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">User intent alignment</div>
                </div>
            </div>

            {/* Keyword or Topic Analysis - Placeholder as we don't have explicit keyword data in snippets usually, but can show generic tips if empty */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Content Recommendations</h3>
                <div className="space-y-4">
                    {data.score < 50 ? (
                        <div className="flex gap-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
                            <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0" />
                            <div>
                                <h4 className="font-bold text-amber-800 text-sm">Improve Content Quality</h4>
                                <p className="text-sm text-amber-700 mt-1">
                                    Your content score is low. Consider increasing word count, improving readability by using shorter sentences, and ensuring your content matches user search intent.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                            <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                            <div>
                                <h4 className="font-bold text-emerald-800 text-sm">Solid Content Foundation</h4>
                                <p className="text-sm text-emerald-700 mt-1">
                                    Your content is performing well. Continue to post high-quality, relevant content to maintain and improve your score.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Issues List */}
            {data.issues && data.issues.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-pink-500" />
                            Content Issues
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-600 text-xs font-bold">
                            {data.issues.length}
                        </span>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {data.issues.map((issue: any, index: number) => (
                            <div key={index} className="p-4 hover:bg-slate-50 transition-colors flex gap-4 items-start">
                                <div className="mt-1">
                                    <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-semibold text-slate-900">{issue.description || issue.id}</h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContentView;
