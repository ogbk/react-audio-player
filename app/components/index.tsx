import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import '../sass/styles.sass';

// @ts-expect-error
const root = createRoot(document.getElementById('root'));
root.render(<App />);
