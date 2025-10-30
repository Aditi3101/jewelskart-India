import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import axios from 'axios';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Fetch suggestions on typing
  useEffect(() => {
    if (query.trim()) {
      const delayDebounce = setTimeout(() => {
        axios
          .get(`${import.meta.env.VITE_API_URL || 'https://jewelskart-backend.onrender.com'}/api/search?query=${encodeURIComponent(query)}`)
          .then((res) => setSuggestions(res.data))
          .catch(() => setSuggestions([]));
      }, 300);

      return () => clearTimeout(delayDebounce);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsListening(false);
      };
      
      recognitionInstance.onerror = () => {
        setIsListening(false);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, []);

  // Hide suggestions if click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // On enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      navigate(`/search/${encodeURIComponent(query)}`);
      setSuggestions([]);
    }
  };

  // On suggestion click
  const handleSuggestionClick = (name: string) => {
    navigate(`/search/${encodeURIComponent(name)}`);
    setQuery('');
    setSuggestions([]);
  };

  // Voice search toggle
  const toggleVoiceSearch = () => {
    if (!recognition) {
      alert('Voice search is not supported in your browser');
      return;
    }
    
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  return (
    <div
      ref={wrapperRef}
      style={{
        position: 'relative',
        padding: '10px',
        textAlign: 'left',
        maxWidth: '100%',
        width: '400px',
      }}
      className="search-bar-container"
    >
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          id="search-input"
          name="search"
          placeholder="Search for products..."
          value={query}
          autoComplete="off"
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          style={{
            padding: '12px 50px 12px 20px',
            width: '100%',
            border: '1px solid #ccc',
            borderRadius: '30px',
            fontSize: '16px',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
        <button
          onClick={toggleVoiceSearch}
          style={{
            position: 'absolute',
            right: '12px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: isListening ? '#e11d48' : '#6b7280',
            fontSize: '16px',
            padding: '8px',
            borderRadius: '50%',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '32px',
            minHeight: '32px',
          }}
          title={isListening ? 'Stop voice search' : 'Start voice search'}
        >
          {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
        </button>
      </div>

      {suggestions.length > 0 && (
        <ul
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            background: '#fff',
            border: '1px solid #ccc',
            borderTop: 'none',
            width: '100%',
            position: 'absolute',
            left: 0,
            zIndex: 999,
            maxHeight: '250px',
            overflowY: 'auto',
            borderBottomLeftRadius: '10px',
            borderBottomRightRadius: '10px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          }}
        >
          {suggestions.map((item) => (
            <li
              key={item.p_id}
              style={{
                padding: '10px 20px',
                borderBottom: '1px solid #eee',
                cursor: 'pointer',
                fontSize: '15px',
              }}
              onClick={() => handleSuggestionClick(item.p_name)}
            >
              {item.p_name}
            </li>
          ))}
        </ul>
      )}
      
      <style>{`
        @media (max-width: 768px) {
          .search-bar-container {
            width: 100% !important;
            padding: 5px !important;
          }
          .search-bar-container input {
            padding: 10px 45px 10px 15px !important;
            font-size: 14px !important;
          }
          .search-bar-container button {
            right: 8px !important;
            font-size: 14px !important;
            min-width: 28px !important;
            min-height: 28px !important;
            padding: 6px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SearchBar;
