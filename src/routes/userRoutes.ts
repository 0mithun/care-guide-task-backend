import { Router } from 'express';
import { UserRepository } from '../repositories/UserRepository';
import {
  GetProfileUseCase,
  ListUsersUseCase,
  GroupUsersByInterestsUseCase,
  GetUserPostsUseCase,
  CreateUserUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase
} from '../use-cases/UserUseCases';
import { UserController } from '../controllers/UserController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

const userRepository = new UserRepository();
const getProfileUseCase = new GetProfileUseCase(userRepository);
const listUsersUseCase = new ListUsersUseCase(userRepository);
const groupUsersByInterestsUseCase = new GroupUsersByInterestsUseCase(userRepository);
const getUserPostsUseCase = new GetUserPostsUseCase(userRepository);
const createUserUseCase = new CreateUserUseCase(userRepository);
const updateUserUseCase = new UpdateUserUseCase(userRepository);
const deleteUserUseCase = new DeleteUserUseCase(userRepository);

const userController = new UserController(
  getProfileUseCase,
  listUsersUseCase,
  groupUsersByInterestsUseCase,
  getUserPostsUseCase,
  createUserUseCase,
  updateUserUseCase,
  deleteUserUseCase
);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile, aggregations, and Admin CRUD management
 */

// Apply authMiddleware to all routes below
router.use(authMiddleware);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get profile details of the current authenticated user
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Profile details retrieved
 *       401:
 *         description: Unauthorized
 */
router.get('/profile', (req, res) => userController.getProfile(req, res));

/**
 * @swagger
 * /api/users/by-interests:
 *   get:
 *     summary: Group all users by their interests (Scenario 1 Aggregation)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully aggregated users by interests
 *       401:
 *         description: Unauthorized
 */
router.get('/by-interests', (req, res) => userController.groupByInterests(req, res));

/**
 * @swagger
 * /api/users/{id}/posts:
 *   get:
 *     summary: Retrieve a user's details and their posts via lookup (Scenario 2 Aggregation)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User with their list of posts returned
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id/posts', (req, res) => userController.getUserPosts(req, res));

// Apply adminMiddleware to all management routes below
router.use(adminMiddleware);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: List all users (Admin only, paginated)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Paginated users list
 *       403:
 *         description: Forbidden (requires admin role)
 *       401:
 *         description: Unauthorized
 */
router.get('/', (req, res) => userController.listUsers(req, res));

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Add a new user (Admin only)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *               interests:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Username or email already exists
 *       403:
 *         description: Forbidden
 */
router.post('/', (req, res) => userController.createUser(req, res));

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update an existing user (Admin only)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *               interests:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Username or email already taken
 *       404:
 *         description: User not found
 *       403:
 *         description: Forbidden
 */
router.put('/:id', (req, res) => userController.updateUser(req, res));

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Remove a user (Admin only)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       403:
 *         description: Forbidden
 */
router.delete('/:id', (req, res) => userController.deleteUser(req, res));

export default router;
