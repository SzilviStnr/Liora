import React from 'react';
import LioraApp from './components/LioraApp';
import { UserProvider } from './UserContext';

function App() {
  return (
    <UserProvider>
      <LioraApp />
    </UserProvider>
  );
}

export default App;