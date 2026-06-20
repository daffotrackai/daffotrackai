import { useEffect, useState } from 'react';

export default function useLocalStorageState(key, defaultValue) {
  const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem(key);

    if (storedValue === null) {
      return typeof defaultValue === 'function' ? defaultValue() : defaultValue;
    }

    try {
      return JSON.parse(storedValue);
    } catch {
      return storedValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}