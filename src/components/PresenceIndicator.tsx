import React from 'react';

interface PresenceIndicatorProps {
  depth: number; // Mélység százalékban, 0-100
}

export default function PresenceIndicator({ depth }: PresenceIndicatorProps) {
  return (
    <div id="presence-indicator" title={`Jelenlét: ${depth}%`}>
      <p>Jelenlét: {depth}%</p>
    </div>
  );
}
