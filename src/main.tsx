import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import LioraApp from './components/LioraApp.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LioraApp />
  </StrictMode>
);