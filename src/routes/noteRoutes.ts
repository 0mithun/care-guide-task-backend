import { Router } from 'express';
import { NoteRepository } from '../repositories/NoteRepository';
import {
  CreateNoteUseCase,
  ListNotesUseCase,
  GetNoteByIdUseCase,
  UpdateNoteUseCase,
  DeleteNoteUseCase
} from '../use-cases/NoteUseCases';
import { NoteController } from '../controllers/NoteController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

const noteRepository = new NoteRepository();
const createNoteUseCase = new CreateNoteUseCase(noteRepository);
const listNotesUseCase = new ListNotesUseCase(noteRepository);
const getNoteByIdUseCase = new GetNoteByIdUseCase(noteRepository);
const updateNoteUseCase = new UpdateNoteUseCase(noteRepository);
const deleteNoteUseCase = new DeleteNoteUseCase(noteRepository);

const noteController = new NoteController(
  createNoteUseCase,
  listNotesUseCase,
  getNoteByIdUseCase,
  updateNoteUseCase,
  deleteNoteUseCase
);

/**
 * @swagger
 * tags:
 *   name: Notes
 *   description: Secured notes management CRUD
 */

router.use(authMiddleware);

/**
 * @swagger
 * /api/notes:
 *   post:
 *     summary: Create a new note
 *     tags: [Notes]
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
 *         description: Note created successfully
 *       400:
 *         description: Title and content are required
 *       401:
 *         description: Unauthorized
 */
router.post('/', (req, res) => noteController.createNote(req, res));

/**
 * @swagger
 * /api/notes:
 *   get:
 *     summary: Get paginated list of notes (users get their own, admins get everyone's)
 *     tags: [Notes]
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
 *         description: List of notes retrieved
 *       401:
 *         description: Unauthorized
 */
router.get('/', (req, res) => noteController.listNotes(req, res));

/**
 * @swagger
 * /api/notes/{id}:
 *   get:
 *     summary: Get a specific note by ID
 *     tags: [Notes]
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
 *         description: Note details returned
 *       403:
 *         description: Access Denied (user does not own note)
 *       404:
 *         description: Note not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', (req, res) => noteController.getNoteById(req, res));

/**
 * @swagger
 * /api/notes/{id}:
 *   put:
 *     summary: Update a note (Owner only)
 *     tags: [Notes]
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
 *         description: Note updated successfully
 *       403:
 *         description: Access Denied
 *       404:
 *         description: Note not found
 *       401:
 *         description: Unauthorized
 */
router.put('/:id', (req, res) => noteController.updateNote(req, res));

/**
 * @swagger
 * /api/notes/{id}:
 *   delete:
 *     summary: Delete a note (Owner only)
 *     tags: [Notes]
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
 *         description: Note deleted successfully
 *       403:
 *         description: Access Denied
 *       404:
 *         description: Note not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', (req, res) => noteController.deleteNote(req, res));

export default router;
