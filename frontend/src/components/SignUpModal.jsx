import React, { useState, useContext } from 'react';
import axios from 'axios';
import { appContext } from '../api/AuthandNoteContext';

const SignUpModal = ({ toggleModal }) => {
  const { login, setUserState } = useContext(appContext);
  const [isSignup, setIsSignup] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      if (isSignup) {
        await axios.post('http://localhost:8000/user/signup', formData);
        setIsSignup(false);
        setFormData({ email: formData.email, password: '' });
        setError('Account created successfully. Please login.');
      } else {
        const response = await axios.post('http://localhost:8000/user/login', formData);
        const { token, userId, email, firstName, lastName } = response.data;
  
        login(token, { userId, email, firstName, lastName });
        window.location.reload();
      }
    } catch (error) {
      setError('Error occurred. Please try again.');
    }
  };
  

  const toggleForm = () => {
    setIsSignup(!isSignup);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    });
    setError('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-xl font-bold mb-4">{isSignup ? 'Sign Up' : 'Login'}</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          {isSignup && (
            <>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
                required
              />
            </>
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
            required
          />
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg"
            >
              {isSignup ? 'Sign Up' : 'Login'}
            </button>
            <button onClick={toggleModal} className="px-4 py-2 text-gray-500">
              Cancel
            </button>
          </div>
        </form>
        <button
          onClick={toggleForm}
          className="text-blue-500 text-sm mt-2 hover:underline"
        >
          {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
};

export default SignUpModal;