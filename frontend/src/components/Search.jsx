import React, { useState } from 'react';
import { IoIosSearch } from "react-icons/io";
import axios from 'axios';
import Cookies from 'js-cookie';
import Note from './Note';

const Search = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [error, setError] = useState('');
  const userId = Cookies.get("userId");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setError('Please enter a search query.');
      return;
    }
    setError('');

    try {
      const response = await axios.get(`http://localhost:8000/notes/${userId}/search`, {
        params: { query }
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error(error);
      setError('Failed to fetch search results. Please try again.');
    }
  };

  const handleNoteClick = (note) => {
    setSelectedNote(note);
  };

  const closeNote = () => {
    setSelectedNote(null);
  };

  return (
    <div className="">
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative w-full sm:w-[calc(75vw)]">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="w-full px-4 py-2 pl-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <IoIosSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>

      </form>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {selectedNote ? (
        <Note noteData={selectedNote} closeNote={closeNote} />
      ) : (
        <div className="mt-2">
          {searchResults.map((note) => (
            <div
              key={note._id}
              onClick={() => handleNoteClick(note)}
              className="cursor-pointer p-4 mb-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <h3 className="font-bold text-lg">{note.title}</h3>
              <p className="text-gray-600">{note.textContent}</p>
              {note.audioTranscript && (
                <p className="text-sm text-gray-500 italic">Transcript: {note.audioTranscript}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
