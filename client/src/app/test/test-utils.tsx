import { render } from '@testing-library/react'
import type React from 'react'
import { Provider } from 'react-redux'
import { store } from '../store/store'

function renderWithProviders(
  ui: React.ReactElement
) {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>
      {children}
    </Provider>
  );
  return { store, ...render(ui, { wrapper: Wrapper }) }
}

export { renderWithProviders }
