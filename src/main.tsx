import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import LioraApp from './components/LioraApp.tsx';
import { UserProvider } from './UserContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <LioraApp />
    </UserProvider>
  </StrictMode>
);