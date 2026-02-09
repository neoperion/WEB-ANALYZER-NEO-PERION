const axios = require('axios');

/**
 * LLM Service - HuggingFace Integration
 * Generates AI-powered insights and recommendations
 */
class LLMService {
  constructor() {
    this.apiKey = process.env.HF_API_KEY;
    this.baseURL = 'https://api-inference.huggingface.co/models';
    this.model = 'meta-llama/Meta-Llama-3-8B-Instruct'; // Fast & accurate
    this.temperature = parseFloat(process.env.AI_TEMPERATURE || '0.7');
  }

  /**
   * Generate AI recommendations from analysis data
   * @param {string} prompt - Structured prompt
   * @param {number} maxTokens - Max response tokens
   */
  async generate(prompt, maxTokens = 500) {
    try {
      const response = await axios.post(
        `${this.baseURL}/${this.model}`,
        {
          inputs: prompt,
          parameters: {
            max_new_tokens: maxTokens,
            temperature: this.temperature,
            top_p: 0.9,
            return_full_text: false
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );

      if (response.data && response.data[0]) {
        return response.data[0].generated_text || response.data[0].text || '';
      }
      return '';
    } catch (error) {
      console.error('[LLM] Generation error:', error.response?.data || error.message);
      return null;
    }
  }

  /**
   * Generate overall website recommendations
   */
  async generateOverallRecommendations(analysisData) {
    const { aggregator, modules } = analysisData;
    
    const prompt = `You are a website optimization expert. Analyze this website audit data and provide executive recommendations.

Website Health Score: ${aggregator.website_health_score}/100 (Grade ${aggregator.health_grade})

Module Scores:
- SEO: ${aggregator.module_scores.seo}/100
- Performance: ${aggregator.module_scores.performance}/100
- UX & Accessibility: ${aggregator.module_scores.ux}/100
- Content: ${aggregator.module_scores.content}/100

Top Issues:
${this._formatTopIssues(modules)}

Provide:
1. Executive Summary (2-3 sentences)
2. Top 3 Priority Actions (actionable, specific)
3. Quick Wins (low effort, high impact)

Format as JSON:
{
  "executiveSummary": "...",
  "topPriorities": ["...", "...", "..."],
  "quickWins": ["...", "..."]
}`;

    const result = await this.generate(prompt, 600);
    return this._parseJSON(result) || {
      executiveSummary: `Website scored ${aggregator.website_health_score}/100. Main areas needing attention: ${aggregator.dominant_risk_domains.join(', ')}.`,
      topPriorities: this._extractTopFixes(modules, 3),
      quickWins: this._extractQuickWins(modules)
    };
  }

  /**
   * Generate SEO-specific recommendations
   */
  async generateSEORecommendations(seoData) {
    const prompt = `You are an SEO expert. Review this SEO audit and provide specific recommendations.

SEO Score: ${seoData.score}/100

Issues Found:
${JSON.stringify(seoData.issues, null, 2)}

Provide SEO recommendations in JSON format:
{
  "summary": "Brief SEO assessment",
  "recommendations": [
    {"title": "...", "impact": "high|medium|low", "steps": ["...", "..."]}
  ]
}`;

    const result = await this.generate(prompt, 500);
    return this._parseJSON(result) || {
      summary: `SEO score is ${seoData.score}/100. Focus on ${seoData.issues.critical.length} critical issues.`,
      recommendations: seoData.fixes.slice(0, 5).map(fix => ({
        title: fix.title,
        impact: fix.priority === 1 ? 'high' : fix.priority === 2 ? 'medium' : 'low',
        steps: [fix.description]
      }))
    };
  }

  /**
   * Generate Performance recommendations
   */
  async generatePerformanceRecommendations(perfData) {
    const prompt = `You are a web performance expert. Analyze this performance audit.

Performance Score: ${perfData.score}/100

Key Metrics:
${JSON.stringify(perfData.metrics, null, 2)}

Top Performance Issues:
${JSON.stringify(perfData.issues, null, 2)}

Provide performance optimization recommendations in JSON:
{
  "summary": "Brief performance assessment",
  "recommendations": [
    {"title": "...", "impact": "high|medium|low", "estimatedGain": "...", "steps": ["..."]}
  ]
}`;

    const result = await this.generate(prompt, 500);
    return this._parseJSON(result) || {
      summary: `Performance score is ${perfData.score}/100. Main bottleneck: ${perfData.issues.critical[0]?.title || 'loading speed'}.`,
      recommendations: perfData.fixes.slice(0, 5).map(fix => ({
        title: fix.title,
        impact: fix.priority === 1 ? 'high' : 'medium',
        estimatedGain: `Improve score by ${fix.impact_pct}%`,
        steps: [fix.description]
      }))
    };
  }

  /**
   * Generate UX recommendations
   */
  async generateUXRecommendations(uxData) {
    const prompt = `You are a UX expert. Review this UX/Accessibility audit.

UX Score: ${uxData.score}/100

Accessibility Violations: ${uxData.violations?.length || 0}
Critical Issues: ${uxData.issues?.critical.length || 0}

Provide UX improvement recommendations in JSON:
{
  "summary": "Brief UX assessment",
  "recommendations": [
    {"title": "...", "impact": "high|medium|low", "userImpact": "...", "steps": ["..."]}
  ]
}`;

    const result = await this.generate(prompt, 500);
    return this._parseJSON(result) || {
      summary: `UX score is ${uxData.score}/100. ${uxData.violations?.length || 0} accessibility issues found.`,
      recommendations: uxData.fixes.slice(0, 5).map(fix => ({
        title: fix.title,
        impact: fix.priority === 1 ? 'high' : 'medium',
        userImpact: `Affects ${fix.impact_pct}% of users`,
        steps: [fix.description]
      }))
    };
  }

  /**
   * Generate Content recommendations
   */
  async generateContentRecommendations(contentData) {
    const prompt = `You are a content strategist. Analyze this content audit.

Content Score: ${contentData.score}/100

Readability: ${contentData.readability?.score || 'N/A'}
Key Issues: ${JSON.stringify(contentData.issues, null, 2)}

Provide content improvement recommendations in JSON:
{
  "summary": "Brief content assessment",
  "recommendations": [
    {"title": "...", "impact": "high|medium|low", "benefit": "...", "steps": ["..."]}
  ]
}`;

    const result = await this.generate(prompt, 500);
    return this._parseJSON(result) || {
      summary: `Content score is ${contentData.score}/100. Readability and structure need improvement.`,
      recommendations: contentData.fixes.slice(0, 5).map(fix => ({
        title: fix.title,
        impact: fix.priority === 1 ? 'high' : 'medium',
        benefit: `Improve engagement by ${fix.impact_pct}%`,
        steps: [fix.description]
      }))
    };
  }

  // Helper methods
  _formatTopIssues(modules) {
    const allIssues = [];
    ['seo', 'performance', 'ux', 'content'].forEach(module => {
      if (modules[module]?.issues?.critical) {
        modules[module].issues.critical.slice(0, 2).forEach(issue => {
          allIssues.push(`[${module.toUpperCase()}] ${issue.title}`);
        });
      }
    });
    return allIssues.slice(0, 6).join('\n');
  }

  _extractTopFixes(modules, count = 3) {
    const fixes = [];
    ['seo', 'performance', 'ux', 'content'].forEach(module => {
      if (modules[module]?.fixes) {
        fixes.push(...modules[module].fixes.map(f => ({ ...f, module })));
      }
    });
    return fixes
      .sort((a, b) => a.priority - b.priority || b.impact_pct - a.impact_pct)
      .slice(0, count)
      .map(f => f.title);
  }

  _extractQuickWins(modules) {
    const fixes = [];
    ['seo', 'performance', 'ux', 'content'].forEach(module => {
      if (modules[module]?.fixes) {
        fixes.push(...modules[module].fixes.map(f => ({ ...f, module })));
      }
    });
    return fixes
      .filter(f => f.effort_hours <= 2 && f.impact_pct >= 10)
      .slice(0, 3)
      .map(f => f.title);
  }

  _parseJSON(text) {
    if (!text) return null;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1] || jsonMatch[0]);
      }
      return JSON.parse(text);
    } catch (e) {
      return null;
    }
  }
}

module.exports = new LLMService();
