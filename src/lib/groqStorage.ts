const GROQ_KEY_STORAGE = 'promptcraft_groq_api_key_v1';

export const getStoredGroqKey = (): string => {
  try {
    return localStorage.getItem(GROQ_KEY_STORAGE) || '';
  } catch (e) {
    console.error('Failed reading Groq API key from localStorage', e);
    return '';
  }
};

export const saveStoredGroqKey = (key: string): void => {
  try {
    if (key.trim()) {
      localStorage.setItem(GROQ_KEY_STORAGE, key.trim());
    } else {
      localStorage.removeItem(GROQ_KEY_STORAGE);
    }
  } catch (e) {
    console.error('Failed saving Groq API key to localStorage', e);
  }
};

export const clearStoredGroqKey = (): void => {
  try {
    localStorage.removeItem(GROQ_KEY_STORAGE);
  } catch (e) {
    console.error('Failed clearing Groq API key', e);
  }
};
