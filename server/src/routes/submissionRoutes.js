import express from 'express';
import { submitAssignment } from '../controllers/submissionController.js';

const router = express.Router();

router.post('/', submitAssignment);

export default router;
