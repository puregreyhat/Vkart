import { useState, useEffect } from 'react';

export function useDarkMode() {
  const [darkMode, setDarkMode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Load dark mode from localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const storedDarkMode = localStorage.getItem('vcart_darkMode');
      const isDark = storedDarkMode === 'true';
      setDarkMode(isDark);
      
      // Apply dark mode class to html element
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  // Save dark mode to localStorage and update body class when it changes
  const toggleDarkMode = (value?: boolean) => {
    const newValue = value !== undefined ? value : !darkMode;
    setDarkMode(newValue);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('vcart_darkMode', newValue.toString());
    }
    
    if (typeof document !== 'undefined') {
      if (newValue) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  return { darkMode, setDarkMode: toggleDarkMode };
}

export function useUsername() {
  const [username, setUsername] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false);

  // Load username from localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const storedUsername = localStorage.getItem('vcart_username');
      if (storedUsername) {
        setUsername(storedUsername);
      }
    }
  }, []);

  // Save username to localStorage when it changes
  const saveUsername = (name: string) => {
    setUsername(name);
    if (name && typeof localStorage !== 'undefined') {
      localStorage.setItem('vcart_username', name);
    }
  };

  return { username, setUsername: saveUsername };
}
