const express = require('express');
const router = express.Router();

router.post('/analyze', (req, res) => {
    // Placeholder logic
    const { url } = req.body;
    res.json({ message: `SEO analysis started for ${url}`, status: 'pending' });
});

module.exports = router;
