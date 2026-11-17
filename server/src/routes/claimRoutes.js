const express = require('express');
const router = express.Router();
const {
  submitClaim,
  getClaimsForItem,
  updateClaimStatus,
  verifyHandoverOtp,
} = require('../controllers/claimController');
const { authenticate } = require('../middleware/auth');
const upload = require('../middleware/upload');

// All claim operations require authentication
router.post('/items/:itemId', authenticate, upload.single('attachment'), submitClaim);
router.get('/items/:itemId', authenticate, getClaimsForItem);
router.put('/:claimId/status', authenticate, updateClaimStatus);
router.post('/items/:itemId/verify-handover', authenticate, verifyHandoverOtp);

module.exports = router;
