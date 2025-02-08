import React, { useState, useRef } from "react";
import { AiFillAudio } from "react-icons/ai";
import { FaFileImage, FaRegImage } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import { GiRoundStar } from "react-icons/gi";
import Cookies from "js-cookie";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dccwp2cyc/upload";
const UPLOAD_PRESET = "Note Files";

const EditModal = ({ toggleModal, createNote }) => {
  const [title, setTitle] = useState("Default Title");
  const [content, setContent] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [audioTranscript, setAudioTranscript] = useState("");
  const [audioFileUrl, setAudioFileUrl] = useState(null);
  const userId = Cookies.get("userId");
  const mediaRecorderRef = useRef(null);

  const handleSave = () => {
    if (!title.trim() && !content.trim() && !uploadedImageUrl && !audioTranscript && !audioFileUrl) {
      alert("Please add some content before saving.");
      return;
    }

    const newNote = {
      title,
      textContent: content,
      imageFile: uploadedImageUrl,
      audioTranscript,
      audioFile: audioFileUrl,
      userid: userId,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    createNote(newNote);
    toggleModal();
  };

  const startSpeechToTextAndRecordAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/mpeg" });
        await uploadAudioToCloudinary(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start();

      setIsRecording(true);

      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.start();

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setAudioTranscript(transcript);
        console.log("Transcript saved:", transcript);
      };

      recognition.onend = () => {
        setIsRecording(false);
        mediaRecorderRef.current.stop();
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
      };
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const uploadAudioToCloudinary = async (audioBlob) => {
    const formData = new FormData();
    formData.append("file", audioBlob);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.secure_url) {
        setAudioFileUrl(data.secure_url);
        console.log("Uploaded Audio URL:", data.secure_url);
      }
    } catch (error) {
      console.error("Audio upload failed:", error);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.secure_url) {
        setUploadedImageUrl(data.secure_url);
        console.log("Uploaded Image URL:", data.secure_url);
      }
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };

  const handleRemoveImage = () => {
    setUploadedImageUrl(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[80vw] h-[88vh]">
        <button
          onClick={toggleModal}
          className="text-4xl text-red-600 hover:text-red-500 transition-colors"
        >
          <IoIosClose />
        </button>

        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-6 py-4 rounded-lg text-xl focus:outline-none"
            placeholder="Enter title"
          />

          <textarea
            className="w-full px-6 py-4 rounded-lg h-[13vh] resize-none focus:outline-none"
            placeholder="Enter content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <h1>Transcript:</h1>
          <textarea
            className="w-full px-6 py-4 rounded-lg h-[10vh] resize-none focus:outline-none"
            value={audioTranscript}
            onChange={(e) => setAudioTranscript(e.target.value)}
          />

          {uploadedImageUrl && (
            <div className="flex items-center space-x-4 justify-center">
              <FaFileImage className="mt-2" />

              <button
                onClick={handleRemoveImage}
                className="px-2 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition-colors"
              >
                Remove
              </button>
            </div>
          )}

          {audioFileUrl && (
            <div className="flex items-center mt-4 mb-4">
              <audio controls src={audioFileUrl}>
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Save
          </button>
          <div className="flex items-center space-x-4">
            <AiFillAudio
              className={`text-2xl ${isRecording ? "text-red-500" : "text-gray-600"
                } hover:text-blue-500 cursor-pointer transition-colors`}
              onClick={startSpeechToTextAndRecordAudio}
            />
            <label htmlFor="image-upload">
              <FaRegImage className="text-2xl text-gray-600 hover:text-blue-500 cursor-pointer transition-colors" />
            </label>
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
