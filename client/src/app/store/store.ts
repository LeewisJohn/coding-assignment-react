import { configureStore } from '@reduxjs/toolkit';
import { api } from '../api/api';
import modelReducer from './slices/ticketSlice';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    ticket: modelReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
