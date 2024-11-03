import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import App from './app/app';
import { ErrorBoundary } from 'react-error-boundary';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <ErrorBoundary fallback={<div className='flex items-center justify-center h-screen text-2xl font-bold text-center'>Something went wrong</div>}>
    <App />
  </ErrorBoundary>
);
