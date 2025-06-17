// src/main.jsx - Version avec i18n
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { I18nProvider } from './hooks/useI18n';
import App from './App.jsx';
import './input.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </StrictMode>
);