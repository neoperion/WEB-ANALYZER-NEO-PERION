const express = require('express');
const router = express.Router();
const { runAnalysisJob } = require('../services/jobRunner');
const ScanResult = require('../models/ScanResult');
const recommendationEngine = require('../services/ai/recommendationEngine');

/**
 * POST /api/analyze
 * Full website analysis (all modules)
 */
router.post('/analyze', async (req, res) => {
  try {
    const { url, emulateMobile = false } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'URL is required'
      });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: 'Invalid URL format'
      });
    }

    console.log(`[API] Starting full analysis for: ${url}`);

    // Run full analysis (all modules)
    const result = await runAnalysisJob(url, { 
      emulateMobile,
      modules: ['seo', 'performance', 'ux', 'content'],
      enableAI: true
    });

    console.log(`[API] Full analysis completed: ${result.reportId}`);

    res.json(result);

  } catch (error) {
    console.error('[API] Analysis error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Analysis failed'
    });
  }
});

/**
 * POST /api/analyze/seo
 * SEO-only analysis
 */
router.post('/analyze/seo', async (req, res) => {
  try {
    const { url, emulateMobile = false } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'URL is required'
      });
    }

    console.log(`[API] Starting SEO analysis for: ${url}`);

    const result = await runAnalysisJob(url, { 
      emulateMobile,
      modules: ['seo'],
      enableAI: true
    });

    res.json(result);

  } catch (error) {
    console.error('[API] SEO analysis error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'SEO analysis failed'
    });
  }
});

/**
 * POST /api/analyze/performance
 * Performance-only analysis
 */
router.post('/analyze/performance', async (req, res) => {
  try {
    const { url, emulateMobile = false } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'URL is required'
      });
    }

    console.log(`[API] Starting Performance analysis for: ${url}`);

    const result = await runAnalysisJob(url, { 
      emulateMobile,
      modules: ['performance'],
      enableAI: true
    });

    res.json(result);

  } catch (error) {
    console.error('[API] Performance analysis error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Performance analysis failed'
    });
  }
});

/**
 * POST /api/analyze/ux
 * UX-only analysis
 */
router.post('/analyze/ux', async (req, res) => {
  try {
    const { url, emulateMobile = false } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'URL is required'
      });
    }

    console.log(`[API] Starting UX analysis for: ${url}`);

    const result = await runAnalysisJob(url, { 
      emulateMobile,
      modules: ['ux'],
      enableAI: true
    });

    res.json(result);

  } catch (error) {
    console.error('[API] UX analysis error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'UX analysis failed'
    });
  }
});

/**
 * POST /api/analyze/content
 * Content-only analysis
 */
router.post('/analyze/content', async (req, res) => {
  try {
    const { url, emulateMobile = false } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'URL is required'
      });
    }

    console.log(`[API] Starting Content analysis for: ${url}`);

    const result = await runAnalysisJob(url, { 
      emulateMobile,
      modules: ['content'],
      enableAI: true
    });

    res.json(result);

  } catch (error) {
    console.error('[API] Content analysis error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Content analysis failed'
    });
  }
});

/**
 * GET /api/report/:reportId/:module?
 * Get report by ID, optionally filtered by module
 * Examples:
 *   /api/report/abc123           -> Full report
 *   /api/report/abc123/seo       -> SEO data only
 *   /api/report/abc123/performance -> Performance data only
 */
router.get('/report/:reportId/:module?', async (req, res) => {
  try {
    const { reportId, module } = req.params;

    const report = await ScanResult.findById(reportId);

    if (!report) {
      return res.status(404).json({
        success: false,
        error: 'Report not found'
      });
    }

    // If module specified, return filtered data with AI recommendations
    if (module && ['seo', 'performance', 'ux', 'content'].includes(module)) {
      const moduleData = {
        _id: report._id,
        url: report.url,
        final_url: report.final_url,
        created_at: report.created_at,
        finished_at: report.finished_at,
        status: report.status,
        module: module,
        aggregator: {
          website_health_score: report.aggregator?.website_health_score,
          health_grade: report.aggregator?.health_grade,
          module_scores: {
            [module]: report.aggregator?.module_scores?.[module]
          }
        },
        modules: {
          [module]: report.modules[module]
        },
        aiRecommendations: null
      };

      // Generate AI recommendations for this module
      if (process.env.ENABLE_AI_INSIGHTS !== 'false') {
        try {
          moduleData.aiRecommendations = await recommendationEngine.generateRecommendations(
            { modules: report.modules, aggregator: report.aggregator },
            { module }
          );
        } catch (error) {
          console.error('[API] AI recommendation error:', error);
        }
      }

      return res.json(moduleData);
    }

    // Return full report with overall AI recommendations
    const fullReport = report.toObject();

    if (process.env.ENABLE_AI_INSIGHTS !== 'false') {
      try {
        fullReport.aiRecommendations = await recommendationEngine.generateRecommendations(
          { modules: report.modules, aggregator: report.aggregator },
          { module: 'overall' }
        );
      } catch (error) {
        console.error('[API] AI recommendation error:', error);
      }
    }

    res.json(fullReport);

  } catch (error) {
    console.error('[API] Report retrieval error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve report'
    });
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'WebAudit AI Backend',
    aiEnabled: process.env.ENABLE_AI_INSIGHTS !== 'false',
    llmProvider: process.env.LLM_PROVIDER || 'huggingface'
  });
});

module.exports = router;

