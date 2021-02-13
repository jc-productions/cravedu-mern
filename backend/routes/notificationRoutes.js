import express from 'express'
import {
  getNotificationById,
  readNotificationById,
  removeNotificationById,
} from '../controllers/notificationContollers.js'
import { protectedRoute } from '../middlewares/authMiddlewares.js'

const router = express.Router()

router
  .route('/:read')
  .put(protectedRoute, readNotificationById)
  .delete(protectedRoute, removeNotificationById)
router.route('/:id').get(protectedRoute, getNotificationById)

export default router
