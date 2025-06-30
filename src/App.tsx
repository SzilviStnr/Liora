import React from 'react';
import LioraApp from './components/LioraApp';
import { UserProvider } from './UserContext';
import PresenceIndicator from './components/PresenceIndicator';

function App() {
 return (
  <UserProvider>
    <LioraApp />
    <PresenceIndicator />
  </UserProvider>
);
}


export default App;