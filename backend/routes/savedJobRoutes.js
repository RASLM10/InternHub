const express = require('express');
const router = express.Router();
const { saveJob, unsaveJob, getSavedJobs } = require('../controllers/savedJobController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', protect, authorize('student'), getSavedJobs);
router.post('/:jobId', protect, authorize('student'), saveJob);
router.delete('/:jobId', protect, authorize('student'), unsaveJob);

module.exports = router;
