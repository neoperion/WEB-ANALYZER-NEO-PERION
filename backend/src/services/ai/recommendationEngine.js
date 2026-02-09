const llmService = require('./llmService');
const insightGenerator = require('./insightGenerator');

/**
 * Recommendation Engine - Orchestrates AI-powered recommendations
 */
class RecommendationEngine {
  /**
   * Generate comprehensive recommendations for all modules
   */
  async generateRecommendations(analysisData, options = {}) {
    const { modules, aggregator } = analysisData;
    const { module = 'overall' } = options;

    try {
      if (module === 'overall') {
        return await this._generateOverallRecommendations(analysisData);
      } else {
        return await this._generateModuleRecommendations(module, modules[module]);
      }
    } catch (error) {
      console.error('[RecommendationEngine] Error:', error);
      return this._getFallbackRecommendations(module, modules);
    }
  }

  /**
   * Generate overall (dashboard) recommendations
   */
  async _generateOverallRecommendations(analysisData) {
    console.log('[AI] Generating overall recommendations...');

    // Get AI insights
    const aiInsights = await llmService.generateOverallRecommendations(analysisData);

    // Get prioritized action plan
    const actionPlan = await insightGenerator.generateActionPlan(analysisData);

    // Detect bottlenecks
    const bottlenecks = insightGenerator.detectBottlenecks(analysisData.modules);

    // Estimate impact
    const allFixes = [];
    ['seo', 'performance', 'ux', 'content'].forEach(m => {
      if (analysisData.modules[m]?.fixes) {
        allFixes.push(...analysisData.modules[m].fixes);
      }
    });
    const impact = insightGenerator.estimateImpact(allFixes.slice(0, 10));

    return {
      type: 'overall',
      aiInsights,
      actionPlan,
      bottlenecks: bottlenecks.slice(0, 3),
      estimatedImpact: impact,
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * Generate module-specific recommendations
   */
  async _generateModuleRecommendations(moduleName, moduleData) {
    console.log(`[AI] Generating ${moduleName} recommendations...`);

    if (!moduleData) {
      return { type: moduleName, recommendations: [], message: 'No data available' };
    }

    let aiRecommendations;
    switch (moduleName) {
      case 'seo':
        aiRecommendations = await llmService.generateSEORecommendations(moduleData);
        break;
      case 'performance':
        aiRecommendations = await llmService.generatePerformanceRecommendations(moduleData);
        break;
      case 'ux':
        aiRecommendations = await llmService.generateUXRecommendations(moduleData);
        break;
      case 'content':
        aiRecommendations = await llmService.generateContentRecommendations(moduleData);
        break;
      default:
        aiRecommendations = { summary: 'Module not found', recommendations: [] };
    }

    // Add priority scoring to fixes
    const prioritizedFixes = insightGenerator.prioritizeFixes(moduleData.fixes || []);

    return {
      type: moduleName,
      aiInsights: aiRecommendations,
      topFixes: prioritizedFixes.slice(0, 5).map(fix => ({
        ...fix,
        roi: (fix.impact_pct / fix.effort_hours).toFixed(1)
      })),
      quickWins: prioritizedFixes.filter(f => f.effort_hours <= 2 && f.impact_pct >= 10).slice(0, 3),
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * Fallback recommendations if AI fails
   */
  _getFallbackRecommendations(module, modules) {
    if (module === 'overall') {
      return {
        type: 'overall',
        aiInsights: {
          executiveSummary: 'Analysis complete. Review module-specific recommendations below.',
          topPriorities: ['Fix critical SEO issues', 'Optimize page load speed', 'Improve accessibility'],
          quickWins: ['Add meta descriptions', 'Compress images', 'Fix color contrast']
        },
        actionPlan: { immediate: [], shortTerm: [], longTerm: [], totalFixes: 0 },
        bottlenecks: [],
        estimatedImpact: { scoreImprovement: 0, conversionLift: 0 }
      };
    }

    const moduleData = modules[module];
    return {
      type: module,
      aiInsights: {
        summary: `${module} analysis complete.`,
        recommendations: []
      },
      topFixes: (moduleData?.fixes || []).slice(0, 5),
      quickWins: []
    };
  }
}

module.exports = new RecommendationEngine();
