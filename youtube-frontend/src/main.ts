import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import './style.css';
import { AuthProvider } from './context/auth.context';

createRoot(document.querySelector<HTMLDivElement>('#app')!).render(
  React.createElement(AuthProvider, null, React.createElement(App, null))
);
