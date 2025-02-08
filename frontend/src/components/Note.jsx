import React, { useState } from 'react';
import { RiEraserFill, RiDeleteBin6Fill } from "react-icons/ri";
import axios from 'axios';
import { FiMaximize, FiMinimize } from "react-icons/fi";

const Note = ({ noteData, closeNote, onNoteDelete }) => {
  const { title, textContent, audioFile, imageFile, audioTranscript, createdAt, _id } = noteData;
  const [activeTab, setActiveTab] = useState('note');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedTextContent, setEditedTextContent] = useState(textContent);

  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = new Date(createdAt).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleDeleteNote = async () => {
    try {
      await axios.delete(`http://localhost:8000/notes/${_id}`);
      onNoteDelete(_id);
      closeNote();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleEditNote = async () => {
    try {
      const updatedNote = {
        title: editedTitle,
        textContent: editedTextContent,
        audioFile,
        imageFile,
        audioTranscript,
      };

      await axios.put(`http://localhost:8000/notes/${_id}`, updatedNote);
      setIsEditing(false);
      closeNote();
      window.location.reload();
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div
        className={`bg-white p-6 rounded-xl ${isFullscreen ? 'w-full h-full' : 'w-[80vw] h-[80vh]'} overflow-y-auto relative transition-all duration-300`}
      >
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={closeNote}
            className="text-3xl text-red-600 hover:text-red-500 transition-colors"
          >
            &times;
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="text-2xl text-gray-600 hover:text-blue-500 transition-colors"
          >
            {isFullscreen ? <FiMinimize /> : <FiMaximize />}
          </button>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center">
            {isEditing ? (
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="text-3xl font-semibold mb-2 w-full p-2 border rounded"
              />
            ) : (
              <h2 className="text-3xl font-semibold mb-2">{title}</h2>
            )}

            <div className="flex items-center space-x-2">
              <button
                className="text-2xl text-blue-600 hover:text-red-500 transition-colors"
                onClick={() => setIsEditing(!isEditing)}
              >
                <RiEraserFill />
              </button>
              <button
                className="text-2xl text-blue-600 hover:text-red-500 transition-colors"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <RiDeleteBin6Fill />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <span>{formattedDate}</span>
            <span>|</span>
            <span>{formattedTime}</span>
          </div>

          {audioFile && (
            <div className="mb-4">
              <audio controls className="w-full">
                <source src={audioFile} type="audio/mp3" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

          <div className="flex justify-center p-2 bg-gray-100 rounded-full w-fit mx-auto mb-4">
            <button
              onClick={() => setActiveTab('note')}
              className={`px-4 py-2 rounded-full ${activeTab === 'note' ? 'bg-blue-500 text-white' : 'text-gray-700'} transition-all`}
            >
              Note
            </button>
            <button
              onClick={() => setActiveTab('transcript')}
              className={`px-4 py-2 rounded-full ${activeTab === 'transcript' ? 'bg-blue-500 text-white' : 'text-gray-700'} transition-all`}
            >
              Audio Transcript
            </button>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg mb-4 flex items-center space-x-2">
            {isEditing ? (
              <textarea
                value={editedTextContent}
                onChange={(e) => setEditedTextContent(e.target.value)}
                className="w-full p-2 border rounded"
              />
            ) : (
              <div className="text-lg text-gray-700">{activeTab === 'note' ? textContent : audioTranscript}</div>
            )}
          </div>

          {imageFile && (
            <div className="mb-4">
              <img src={imageFile} alt="Note Image" className="w-full h-auto rounded-lg" />
            </div>
          )}

          {isEditing && (
            <div className="flex justify-end space-x-4 mt-4">
              <button
                className="px-4 py-2 bg-gray-300 text-black rounded"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={handleEditNote}
              >
                Save
              </button>
            </div>
          )}
        </div>

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl w-[30vw]">
              <p className="text-lg font-semibold mb-4">Are you sure you want to delete this note?</p>
              <div className="flex justify-end space-x-4">
                <button
                  className="px-4 py-2 bg-gray-300 text-black rounded"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded"
                  onClick={handleDeleteNote}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Note;
