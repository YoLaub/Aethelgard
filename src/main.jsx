import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './presentation/App.jsx';

// Si tu utilises Tailwind, n'oublie pas de créer un fichier index.css 
// à la racine de 'src' et de l'importer ici :
// import './index.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}