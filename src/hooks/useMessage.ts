import { useState, useCallback } from 'react';
import type { Message } from '../types';

export const useMessage = () => {
  const [message, setMessage] = useState<Message | null>(null);

  const showMessage = useCallback((text: string, type: Message['type'] = 'info') => {
    setMessage({ text, type });
    const timer = setTimeout(() => setMessage(null), 4000);
    return () => clearTimeout(timer);
  }, []);

  const clearMessage = useCallback(() => setMessage(null), []);

  return { message, showMessage, clearMessage };
};
