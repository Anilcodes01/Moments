'use client';
import Image from 'next/image';
import React, { useState, useRef, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';

interface User {
  id: string;
  name: string;
  avatarUrl: string | null;
}

interface MentionTextareaProps {
  value: string;
  onChange: (value: string, mentions: string[]) => void;
  placeholder?: string;
  className?: string;
}

const MentionTextarea: React.FC<MentionTextareaProps> = ({
  value,
  onChange,
  placeholder = '',
  className = '',
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [mentionQuery, setMentionQuery] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const [mentionedUsers, setMentionedUsers] = useState<string[]>([]);

  const debouncedSearch = useDebouncedCallback(async (query: string) => {
    if (!query) return;

    try {
      const response = await fetch(`/api/user/search?query=${encodeURIComponent(query)}`);
      const users = await response.json();

      if (Array.isArray(users)) {
        setSuggestions(users);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setSuggestions([]);
    }
  }, 300);

  useEffect(() => {
    if (mentionQuery) {
      debouncedSearch(mentionQuery);
    } else {
      setSuggestions([]);
    }
  }, [mentionQuery, debouncedSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const currentPosition = e.target.selectionStart || 0;
    setCursorPosition(currentPosition);

    const textBeforeCursor = newValue.slice(0, currentPosition);
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);

    if (mentionMatch) {
      setMentionQuery(mentionMatch[1]);
      setShowSuggestions(true);
      setSelectedIndex(0);
    } else {
      setShowSuggestions(false);
    }

    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;

    onChange(newValue, mentionedUsers);
  };

  const insertMention = (user: User) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const textBeforeCursor = value.slice(0, cursorPosition);
    const textAfterCursor = value.slice(cursorPosition);
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);

    if (mentionMatch) {
      const startPos = textBeforeCursor.length - mentionMatch[0].length;
      const newText =
        value.slice(0, startPos) + `@${user.name} ` + textAfterCursor;

      setMentionedUsers([...mentionedUsers, user.id]);
      onChange(newText, [...mentionedUsers, user.id]);
      setShowSuggestions(false);

      const newCursorPosition = startPos + user.name.length + 2;
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(newCursorPosition, newCursorPosition);
      }, 0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (suggestions[selectedIndex]) {
          insertMention(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
    }
  };

  const getDropdownPosition = () => {
    if (!textareaRef.current) return { top: 0, left: 0 };

    const textarea = textareaRef.current;
    const { top, left, height } = textarea.getBoundingClientRect();

    return {
      top: top + height + window.scrollY,
      left: left + window.scrollX,
    };
  };

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`block w-full p-2 bg-white border border-gray-300 outline-none rounded-md text-gray-700 resize-none ${className}`}
      />
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className=" z-50 w-full max-h-48  bg-white rounded-md shadow-lg border border-gray-200"
          style={getDropdownPosition()}
        >
          {suggestions.map((user, index) => (
            <div
              key={user.id}
              className={`p-2 cursor-pointer hover:bg-gray-100 flex items-center gap-2 ${
                index === selectedIndex ? 'bg-gray-100' : ''
              }`}
              onClick={() => insertMention(user)}
            >
              {user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-6 h-6 rounded-full"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="font-medium">{user.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MentionTextarea;
