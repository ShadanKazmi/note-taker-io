const { Router } = require("express");
const mongoose = require("mongoose");
const Notes = require('../model/notes');

const router = Router();

router.get('/:userId', async (req, res) => {
    const{userId} = req.params;
    try {
        const notes = await Notes.find({user: userId});
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch notes' });
    }
});


router.get('/:userId/favourites', async (req, res) => {
    const{userId} = req.params;
    try {
        const notes = await Notes.find({user: userId, favourite: true});
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch notes' });
    }
});

router.get('/note/:noteid', async (req, res) => {
    const { noteid } = req.params;
    try {
        const note = await Notes.findById(noteid);

        if (!note) return res.status(404).json({ error: 'Note not found' });

        res.status(200).json(note);

    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch the note' });
    }
});

router.get('/:userId/search', async (req, res) => {
    const{userId} = req.params;
    const { query } = req.query;
    if (!query) {
        return res.status(400).json({ error: 'Search query is required' });
    }

    try {
        const notes = await Notes.find({
            user: userId,
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { textContent: { $regex: query, $options: 'i' } },
                { audioTranscript: { $regex: query, $options: 'i' } }
            ]
        });

        res.status(200).json(notes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to search notes' });
    }
});


router.post('/', async (req, res) => {
    const { title, textContent, imageFile, audioFile, audioTranscript, userid } = req.body;


    if (!userid || (!textContent && !imageFile && !audioFile && !audioTranscript)) {
        return res.status(400).json({ error: "userId and at least one note type are required." });
    }

    try {
        const newNote = await Notes.create({ title, textContent, imageFile, audioFile, audioTranscript, user: userid });
        res.status(201).json(newNote);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create note' });
    }
});


router.delete('/:noteid', async (req, res) => {
    const { noteid } = req.params;
    try {
        const deletedNote = await Notes.findByIdAndDelete(noteid);
        if (!deletedNote) return res.status(404).json({ error: 'Note not found' });
        res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete the note' });
    }
});

router.put('/:noteid', async (req, res) => {
    const { noteid } = req.params;
    const { title, textContent, imageFile, audioFile, audioTranscript, favourite } = req.body;

    try {
        const updatedNote = await Notes.findByIdAndUpdate(
            noteid,
            { title, textContent, imageFile, audioFile, audioTranscript, favourite },
            { new: true, runValidators: true }
        );

        if (!updatedNote) return res.status(404).json({ error: 'Note not found' });
        res.status(200).json(updatedNote);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update the note' });
    }
});

module.exports = router;