import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Ticket } from '../../api/apiTypes';

interface TicketState {
  isTicketModalOpen: boolean;
  id?: number | null;
  ticket?: Ticket;
}

const initialState: TicketState = {
  isTicketModalOpen: false, // Khởi tạo modal ticket ở trạng thái đóng
};

export const ticketSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setTicketModalState: (state, action: PayloadAction<boolean>) => {
      state.isTicketModalOpen = action.payload;
    },
    toggleTicketModalState: (state) => {
      state.isTicketModalOpen = !state.isTicketModalOpen;
    },
    setTicketId: (state, action: PayloadAction<number | null>) => {
      state.id = action.payload;
    },
  },
});

export const { setTicketModalState, toggleTicketModalState, setTicketId } = ticketSlice.actions;

export default ticketSlice.reducer;
