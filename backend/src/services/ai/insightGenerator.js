const llmService = require('./llmService');

/**
 * Insight Generator - Analyzes patterns and generates insights
 */
class InsightGenerator {
  /**
   * Detect bottlenecks across all modules
   */
  detectBottlenecks(modules) {
    const bottlenecks = [];

    // Check each module for critical issues
    Object.entries(modules).forEach(([moduleName, moduleData]) => {
      if (!moduleData) return;

      const score = moduleData.score || 0;
      const criticalIssues = moduleData.issues?.critical?.length || 0;

      if (score < 50) {
        bottlenecks.push({
          module: moduleName,
          severity: 'high',
          issue: `Low ${moduleName} score (${score}/100)`,
          criticalCount: criticalIssues
        });
      } else if (score < 70) {
        bottlenecks.push({
          module: moduleName,
          severity: 'medium',
          issue: `Moderate ${moduleName} score (${score}/100)`,
          criticalCount: criticalIssues
        });
      }
    });

    return bottlenecks.sort((a, b) => b.criticalCount - a.criticalCount);
  }

  /**
   * Prioritize fixes using ROI scoring
   */
  prioritizeFixes(allFixes) {
    return allFixes
      .map(fix => ({
        ...fix,
        roi: this._calculateROI(fix)
      }))
      .sort((a, b) => {
        // Sort by: Priority (1-4), then ROI (high to low)
        if (a.priority !== b.priority) {
          return a.priority - b.priority;
        }
        return b.roi - a.roi;
      });
  }

  /**
   * Generate actionable plan
   */
  async generateActionPlan(analysisData) {
    const { modules } = analysisData;
    
    // Collect all fixes
    const allFixes = [];
    ['seo', 'performance', 'ux', 'content'].forEach(module => {
      if (modules[module]?.fixes) {
        modules[module].fixes.forEach(fix => {
          allFixes.push({ ...fix, module });
        });
      }
    });

    // Prioritize
    const prioritized = this.prioritizeFixes(allFixes);

    // Group by timeframe
    const immediate = prioritized.filter(f => f.priority === 1).slice(0, 3);
    const shortTerm = prioritized.filter(f => f.priority === 2).slice(0, 5);
    const longTerm = prioritized.filter(f => f.priority >= 3).slice(0, 5);

    return {
      immediate: immediate.map(this._formatFix),
      shortTerm: shortTerm.map(this._formatFix),
      longTerm: longTerm.map(this._formatFix),
      totalFixes: allFixes.length,
      estimatedEffort: this._calculateTotalEffort(prioritized)
    };
  }

  /**
   * Estimate impact of implementing fixes
   */
  estimateImpact(fixes) {
    const impact = {
      scoreImprovement: 0,
      conversionLift: 0,
      seoBoost: 0,
      performanceGain: 0
    };

    fixes.forEach(fix => {
      // Score improvement based on priority and impact
      const weight = fix.priority === 1 ? 1.5 : fix.priority === 2 ? 1.0 : 0.5;
      impact.scoreImprovement += (fix.impact_pct || 0) * weight;

      // Module-specific impacts
      if (fix.module === 'seo') {
        impact.seoBoost += fix.impact_pct || 0;
      } else if (fix.module === 'performance') {
        impact.performanceGain += fix.impact_pct || 0;
        impact.conversionLift += (fix.impact_pct || 0) * 0.3; // ~30% correlation
      } else if (fix.module === 'ux') {
        impact.conversionLift += (fix.impact_pct || 0) * 0.5; // ~50% correlation
      }
    });

    return {
      scoreImprovement: Math.min(Math.round(impact.scoreImprovement), 40),
      conversionLift: Math.min(Math.round(impact.conversionLift), 25),
      seoBoost: Math.min(Math.round(impact.seoBoost), 30),
      performanceGain: Math.min(Math.round(impact.performanceGain), 35)
    };
  }

  // Helper methods
  _calculateROI(fix) {
    const impact = fix.impact_pct || 1;
    const effort = fix.effort_hours || 1;
    return (impact / effort).toFixed(2);
  }

  _formatFix(fix) {
    return {
      title: fix.title,
      module: fix.module,
      priority: fix.priority,
      impact: `${fix.impact_pct}%`,
      effort: `${fix.effort_hours}h`,
      roi: (fix.impact_pct / fix.effort_hours).toFixed(1),
      description: fix.description
    };
  }

  _calculateTotalEffort(fixes) {
    const total = fixes.reduce((sum, fix) => sum + (fix.effort_hours || 0), 0);
    return {
      hours: Math.round(total),
      days: Math.round(total / 8),
      weeks: Math.round(total / 40)
    };
  }
}

module.exports = new InsightGenerator();
