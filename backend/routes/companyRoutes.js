const express = require('express');
const router = express.Router();
const { getCompanies, createCompany, getCompany, updateCompany } = require('../controllers/companyController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', getCompanies);
router.post('/', protect, authorize('employer', 'admin'), createCompany);
router.get('/:id', getCompany);
router.put('/:id', protect, authorize('employer', 'admin'), updateCompany);

module.exports = router;
