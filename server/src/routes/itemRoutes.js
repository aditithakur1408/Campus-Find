const express = require('express');
const router = express.Router();
const {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getPotentialMatches,
} = require('../controllers/itemController');
const { authenticate } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public route to browse items
router.get('/', getItems);

// Public/authenticated detailed view
router.get('/:id', (req, res, next) => {
  // Optional auth middleware so logged in users see their own claim state
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authenticate(req, res, next);
  }
  next();
}, getItemById);

// Matching items
router.get('/:id/matches', getPotentialMatches);

// Protected routes
router.post('/', authenticate, upload.array('images', 4), createItem);
router.put('/:id', authenticate, updateItem);
router.delete('/:id', authenticate, deleteItem);

module.exports = router;
