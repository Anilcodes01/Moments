"use client";

import { useState, useRef } from "react";
import axios from "axios";

const CreateMomentWithMentions = () => {
  const [momentText, setMomentText] = useState("");
  const [mentionSuggestions, setMentionSuggestions] = useState<any[]>([]);
  const [showMentionSuggestions, setShowMentionSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);

  // Handle input changes and detect '@' for mentions
  const handleMomentTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMomentText(value);

    // Check if the user is typing an '@' mention
    const atIndex = value.lastIndexOf("@");
    if (atIndex !== -1 && (cursorPosition === null || atIndex > cursorPosition)) {
      const query = value.slice(atIndex + 1).trim();

      if (query) {
        fetchUserSuggestions(query);
        setCursorPosition(atIndex);
        setShowMentionSuggestions(true);
      } else {
        setShowMentionSuggestions(false);
      }
    } else {
      setShowMentionSuggestions(false);
    }
  };

  // Fetch users from the backend API
  const fetchUserSuggestions = async (query: string) => {
    setLoadingSuggestions(true);
    try {
      const { data } = await axios.get(`/api/user/search?query=${query}`);
      setMentionSuggestions(data);
    } catch (error) {
      console.error("Error fetching user suggestions:", error);
      setMentionSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // Handle selecting a suggestion
  const handleSelectSuggestion = (user: any) => {
    if (cursorPosition !== null) {
      const beforeAt = momentText.slice(0, cursorPosition);
      const afterAt = momentText.slice(momentText.lastIndexOf("@") + 1).trim();
      const newText = `${beforeAt}@${user.name} `;
      setMomentText(newText); // Add a trailing space
      setCursorPosition(null);
      setShowMentionSuggestions(false);
    }
  };

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={momentText}
        onChange={handleMomentTextChange}
        rows={6}
        className="block w-full p-4 border text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Write your moment... @ to mention users"
      ></textarea>

      {showMentionSuggestions && mentionSuggestions?.length > 0 && (
        <ul className="absolute bg-white border border-gray-300 rounded-md shadow-md mt-2 w-1/2 max-h-60 overflow-y-auto">
          {mentionSuggestions.map((user) => (
            <li
              key={user.id}
              onClick={() => handleSelectSuggestion(user)}
              className="p-2 cursor-pointer hover:bg-gray-100 flex items-center"
            >
              <img
                src={user.avatarUrl || "/default-avatar.png"}
                alt={user.name}
                className="w-8 h-8 rounded-full mr-2"
              />
              <span>{user.name}</span>
            </li>
          ))}
        </ul>
      )}

      {loadingSuggestions && (
        <div className="absolute bg-white p-2 border border-gray-300 rounded-md shadow-md mt-2 w-1/2 text-center">
          Loading...
        </div>
      )}
    </div>
  );
};

export default CreateMomentWithMentions;
