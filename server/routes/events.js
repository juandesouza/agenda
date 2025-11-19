const express = require('express');
const { body, validationResult } = require('express-validator');
const Event = require('../models/Event');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all events for the authenticated user
router.get('/', async (req, res) => {
  try {
    const events = await Event.find({ user: req.user._id })
      .sort({ start: 1 })
      .lean();

    // Transform to calendar format
    const formattedEvents = events.map((event) => ({
      id: event._id.toString(),
      title: event.title,
      start: new Date(event.start),
      end: new Date(event.end),
      notes: event.notes || '',
      color: event.color || req.user.color,
      resource: {
        notes: event.notes || '',
        userId: event.user.toString(),
      },
    }));

    res.json({ events: formattedEvents });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Server error fetching events' });
  }
});

// Create event
router.post(
  '/',
  [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ max: 200 })
      .withMessage('Title cannot exceed 200 characters'),
    body('start')
      .isISO8601()
      .withMessage('Valid start date is required')
      .toDate(),
    body('end')
      .isISO8601()
      .withMessage('Valid end date is required')
      .toDate()
      .custom((endDate, { req }) => {
        if (endDate <= req.body.start) {
          throw new Error('End date must be after start date');
        }
        return true;
      }),
    body('notes').optional().trim().isLength({ max: 1000 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, start, end, notes } = req.body;

      const event = await Event.create({
        title,
        start: new Date(start),
        end: new Date(end),
        notes: notes || '',
        user: req.user._id,
        color: req.user.color,
      });

      res.status(201).json({
        event: {
          id: event._id.toString(),
          title: event.title,
          start: event.start,
          end: event.end,
          notes: event.notes,
          color: event.color,
        },
      });
    } catch (error) {
      console.error('Create event error:', error);
      res.status(500).json({ message: 'Server error creating event' });
    }
  }
);

// Update event
router.put(
  '/:id',
  [
    body('title')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Title cannot be empty')
      .isLength({ max: 200 })
      .withMessage('Title cannot exceed 200 characters'),
    body('start').optional().isISO8601().withMessage('Valid start date is required').toDate(),
    body('end').optional().isISO8601().withMessage('Valid end date is required').toDate(),
    body('notes').optional().trim().isLength({ max: 1000 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const event = await Event.findOne({
        _id: req.params.id,
        user: req.user._id,
      });

      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      // Update fields
      if (req.body.title !== undefined) event.title = req.body.title;
      if (req.body.start !== undefined) event.start = new Date(req.body.start);
      if (req.body.end !== undefined) event.end = new Date(req.body.end);
      if (req.body.notes !== undefined) event.notes = req.body.notes;

      // Validate end > start
      if (event.end <= event.start) {
        return res.status(400).json({ message: 'End date must be after start date' });
      }

      await event.save();

      res.json({
        event: {
          id: event._id.toString(),
          title: event.title,
          start: event.start,
          end: event.end,
          notes: event.notes,
          color: event.color,
        },
      });
    } catch (error) {
      console.error('Update event error:', error);
      res.status(500).json({ message: 'Server error updating event' });
    }
  }
);

// Delete event
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Server error deleting event' });
  }
});

module.exports = router;

