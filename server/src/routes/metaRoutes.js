const express = require('express');
const router = express.Router();
const {
  getCategories,
  getLocations,
  getStats,
  getActivityLogs,
  getNotifications,
  markNotificationRead,
} = require('../controllers/metaController');
const { authenticate } = require('../middleware/auth');

router.get('/categories', getCategories);
router.get('/locations', getLocations);
router.get('/stats', getStats);
router.get('/activity', getActivityLogs);

// Protected notification routes
router.get('/notifications', authenticate, getNotifications);
router.put('/notifications/:id/read', authenticate, markNotificationRead);

module.exports = router;
