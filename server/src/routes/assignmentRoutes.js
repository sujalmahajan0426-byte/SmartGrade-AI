import express from 'express';
import { listAssignments, addAssignment } from '../controllers/assignmentController.js';

const router = express.Router();

router.get('/', listAssignments);
router.post('/', addAssignment);

export default router;
