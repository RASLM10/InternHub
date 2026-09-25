const express = require('express');
const router = express.Router();
const { getUsers, deleteUser, getAllJobs, deleteJob, getAllApplications, getAllCompanies, getStats } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect, authorize('admin'));

router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.get('/jobs', getAllJobs);
router.delete('/jobs/:id', deleteJob);
router.get('/applications', getAllApplications);
router.get('/companies', getAllCompanies);
router.get('/stats', getStats);

module.exports = router;
