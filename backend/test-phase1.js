const axios = require('axios');

// Simple test script for Phase 1 implementation
async function testPhase1() {
  console.log('🧪 Testing Phase 1: API Gateway & AI Powerhouse\n');

  const baseURL = 'http://localhost:4000/api';

  try {
    // Test 1: Health check
    console.log('[1/5] Testing health endpoint...');
    const healthRes = await axios.get(`${baseURL}/health`);
    console.log('✅ Health check passed:', healthRes.data);
    console.log('');

    // Test 2: Full analysis
    console.log('[2/5] Testing full analysis endpoint...');
    const fullRes = await axios.post(`${baseURL}/analyze`, {
      url: 'https://izhaiyam.com'
    });
    console.log('✅ Full analysis completed');
    console.log('   Report ID:', fullRes.data.reportId);
    console.log('   Health Score:', fullRes.data.website_health_score);
    console.log('');

    const reportId = fullRes.data.reportId;

    // Test 3: Get full report with AI insights
    console.log('[3/5] Testing report retrieval with AI insights...');
    const reportRes = await axios.get(`${baseURL}/report/${reportId}`);
    console.log('✅ Report retrieved');
    if (reportRes.data.aiRecommendations) {
      console.log('   AI Insights generated:', Object.keys(reportRes.data.aiRecommendations));
    } else {
      console.log('   ⚠️  No AI insights (this is okay if AI is disabled)');
    }
    console.log('');

    // Test 4: Get SEO-specific report
    console.log('[4/5] Testing SEO module-specific endpoint...');
    const seoRes = await axios.get(`${baseURL}/report/${reportId}/seo`);
    console.log('✅ SEO module data retrieved');
    console.log('   SEO Score:', seoRes.data.aggregator.module_scores.seo);
    if (seoRes.data.aiRecommendations) {
      console.log('   SEO AI insights:', seoRes.data.aiRecommendations.type);
    }
    console.log('');

    // Test 5: Analyze SEO only
    console.log('[5/5] Testing SEO-only analysis endpoint...');
    const seoOnlyRes = await axios.post(`${baseURL}/analyze/seo`, {
      url: 'https://izhaiyam.com'
    });
    console.log('✅ SEO-only analysis completed');
    console.log('   Report ID:', seoOnlyRes.data.reportId);
    console.log('');

    console.log('\n🎉 Phase 1 testing complete! All endpoints working.\n');
    console.log('📋 Summary:');
    console.log('   ✅ API Gateway with module-specific endpoints');
    console.log('   ✅ Selective module execution');
    console.log('   ✅ AI Powerhouse integration');
    console.log('   ✅ Report retrieval with module filtering');

  } catch (error) {
    console.error('\n❌ Test failed:',error.response?.data || error.message);
  }
}

testPhase1();
