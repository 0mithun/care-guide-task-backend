import { Router } from 'express';
import { PostRepository } from '../repositories/PostRepository';
import { CreatePostUseCase, UpdatePostUseCase, DeletePostUseCase, ListPostsUseCase } from '../use-cases/PostUseCases';
import { PostController } from '../controllers/PostController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

const postRepository = new PostRepository();
const createPostUseCase = new CreatePostUseCase(postRepository);
const updatePostUseCase = new UpdatePostUseCase(postRepository);
const deletePostUseCase = new DeletePostUseCase(postRepository);
const listPostsUseCase = new ListPostsUseCase(postRepository);

const postController = new PostController(
  createPostUseCase,
  updatePostUseCase,
  deletePostUseCase,
  listPostsUseCase
);

router.use(authMiddleware);

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a public post
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post created successfully
 */
router.post('/', (req, res) => postController.createPost(req, res));

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Retrieve all public posts (visible to everyone)
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of public posts
 */
router.get('/', (req, res) => postController.listPosts(req, res));

/**
 * @swagger
 * /api/posts/{id}:
 *   put:
 *     summary: Update an existing post (Owner or Admin only)
 *     tags: [Posts]
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
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post updated successfully
 */
router.put('/:id', (req, res) => postController.updatePost(req, res));

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Delete an existing post (Owner or Admin only)
 *     tags: [Posts]
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
 *         description: Post deleted successfully
 */
router.delete('/:id', (req, res) => postController.deletePost(req, res));

export default router;
