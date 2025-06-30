import React, { useState, useEffect } from 'react';
import LioraApp from './components/LioraApp';
import { UserProvider } from './UserContext';
import PresenceIndicator from './components/PresenceIndicator';

function App() {
  // Példa egy állapot változóra a mélység értékére
  const [depth, setDepth] = useState(45);

  useEffect(() => {
    // Itt később lehet valós adatot lekérni és beállítani, most maradhat így
  }, []);

  return (
    <UserProvider>
      <LioraApp />
      <PresenceIndicator depth={depth} />
    </UserProvider>
  );
}

export default App;
