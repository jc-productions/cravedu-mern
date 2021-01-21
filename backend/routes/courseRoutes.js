import express from 'express'
import {
  getCourses,
  getCourseBySlug,
  createCourseQandA,
  getBestCourses,
  createCourseReview,
  setWatched,
} from '../controllers/courseContollers.js'
import { protectedRoute } from '../middlewares/authMiddlewares.js'
const router = express.Router()

router.route('/').get(getCourses)
router.route('/bestsold').get(getBestCourses)

router.route('/:slug').get(getCourseBySlug)
router.route('/:id/reviews').post(protectedRoute, createCourseReview)
router.route('/:id/qanda').post(protectedRoute, createCourseQandA)
router.route('/:id/watch').put(protectedRoute, setWatched)

export default router
