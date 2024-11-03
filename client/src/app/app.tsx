import { BrowserRouter as BR, Route as R, Routes } from 'react-router-dom';
import { lazy, Suspense as S } from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';

import { Toaster } from 'react-hot-toast';
const Board = lazy(() => import('./components/board/Board'));
const Ticket = lazy(() => import('./components/ticket/TicketHOC'));
const Not = lazy(() => import('./components/util/404'));

function App() {
  return (
    <main className={`bg-c-111 flex light-theme m-auto justify-center`}>
      <Provider store={store}>
        <BR>
          <Routes>
            <R
              path='tickets/:id'
              element={
                <S>
                  <Ticket />
                </S>
              }>
            </R>
            <R
              path='/'
              element={
                <S>
                  <Board />
                </S>
              }
            />
            <R
              path="*"
              element={<Not />}
            />
          </Routes>
        </BR>
      </Provider>
      <Toaster />
    </main>
  );
}

export default App;
