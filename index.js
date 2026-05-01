import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';

// Ye ensure karta hai ki app '/app' folder se start ho
export function App() {
  const ctx = require.context('./app');
  return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);
