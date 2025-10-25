"use client";

import { useState, useEffect, useCallback } from 'react';

type SetValue<T> = T | ((val: T) => T);

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: SetValue<T>) => void] {
  return useStorage('local', key, initialValue);
}

export function useSessionStorage<T>(key: string, initialValue: T): [T, (value: SetValue<T>) => void] {
  return useStorage('session', key, initialValue);
}

function useStorage<T>(type: 'local' | 'session', key: string, initialValue: T): [T, (value: SetValue<T>) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const storage = type === 'local' ? window.localStorage : window.sessionStorage;
      const item = storage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading ${type}Storage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: SetValue<T>) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        const storage = type === 'local' ? window.localStorage : window.sessionStorage;
        storage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting ${type}Storage key "${key}":`, error);
    }
  }, [key, storedValue, type]);

  return [storedValue, setValue];
}