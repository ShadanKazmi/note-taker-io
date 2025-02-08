import React, { useContext, useState } from 'react';
import { RiHome2Fill } from 'react-icons/ri';
import { FaStar } from "react-icons/fa";
import logo from "../assets/logo.jpg";
import { useNavigate } from 'react-router-dom';
import SignUpModal from '../components/SignUpModal';
import { appContext } from '../api/AuthandNoteContext';
import { FaUserTie } from "react-icons/fa";

const Sidebar = () => {
  const [selected, setSelected] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout } = useContext(appContext);
  const navigate = useNavigate();

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleUserClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="flex flex-col justify-between w-64 h-[calc(100vh-40px)] bg-white p-8 rounded-2xl shadow-lg border border-grey m-4 sm:w-16 md:w-32 lg:w-64">
      <div>
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <img src={logo} alt="Logo" className="mr-3 w-8 h-8 rounded-full" />
          <span className="hidden sm:inline">AI Notes</span>
        </h1>
        <hr className="mb-6" />

        <nav className="space-y-4">
          <a
            className={`flex items-center px-2 py-2 rounded-full hover:bg-purple-100 hover:text-purple-500 ${selected === 'home' ? 'text-purple-500' : 'text-gray-700'}`}
            onClick={() => { navigate('/'); setSelected('home'); }}
          >
            <RiHome2Fill className="mr-3" />
            <span className="hidden sm:inline">Home</span>
          </a>
          <a
            className={`flex items-center px-2 py-2 rounded-full hover:bg-purple-100 hover:text-purple-500 ${selected === 'favourites' ? 'text-purple-500' : 'text-gray-700'}`}
            onClick={() => { navigate('/favourites'); setSelected('favourites'); }}
          >
            <FaStar className="mr-3" />
            <span className="hidden sm:inline">Favourites</span>
          </a>
        </nav>
      </div>

      <div className="relative">
        {user ? (
          <div onClick={handleUserClick} className="flex justify-start cursor-pointer text-black-500">
            <FaUserTie className='mr-5' /> 
            <p>Hello {`${user.firstName} ${user.lastName}`}</p>
          </div>
        ) : (
          <p className="cursor-pointer text-black-500" onClick={toggleModal}>Sign Up / Login</p>
        )}

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg">
            <button
              onClick={logout}
              className="w-full px-4 py-2 text-left text-red-500 hover:bg-red-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {isModalOpen && <SignUpModal toggleModal={toggleModal} />}
    </div>
  );
};

export default Sidebar;
