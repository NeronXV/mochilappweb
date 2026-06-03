import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import BusinessApp from './apps/business/BusinessApp.tsx';
import './index.css';

const params = new URLSearchParams(window.location.search);
const isBusiness = params.get('app') === 'business';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isBusiness ? <BusinessApp /> : <App />}
  </StrictMode>,
);
