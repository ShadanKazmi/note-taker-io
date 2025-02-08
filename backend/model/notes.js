const { Schema, model } = require('mongoose')

const noteSchema = new Schema({
    title: {
        type: String,
    },
    textContent: {
        type: String,
    },
    audioTranscript: {
        type: String,
    },
    audioFile: {
        type: String,
    },
    imageFile: {
        type: String,
    },
    favourite:{
        type: Boolean,
    },
    user: [
        { 
            type: Schema.Types.ObjectId,
            ref: 'NotesUser',
            required: true 
        }
    ],
},
    { timestamps: true }
);


const Notes = model('Notes', noteSchema);

module.exports = Notes;