// src/App.tsx

import React from 'react';
import LioraApp from './components/LioraApp';
import { UserProvider } from './UserContext'; // 💜 Szilvi-t hozod be

function App() {
  return (
    <UserProvider>
      <LioraApp />
    </UserProvider>
  );
}

export default App;
