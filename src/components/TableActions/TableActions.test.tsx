import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import { TableActionsComponent } from './TableActions.component';
import { actions, mockMethods } from './TableActions.mock';

afterEach(() => {
  jest.clearAllMocks();
});

describe('TableActions', () => {
  it('open menu on button click and close on menu item click', async () => {
    render(<TableActionsComponent actions={actions} />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    fireEvent.click(button);

    actions.forEach((action) => {
      expect(screen.getByText(action.label)).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByRole('menuitem')[2]);
    expect(mockMethods.unstakeMethodMock).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      actions.forEach((action) => {
        expect(screen.queryByText(action.label)).toBeNull();
      });
    });
  });
  it('not fire delegate method when menu item is disabled', async () => {
    render(<TableActionsComponent actions={actions} />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    fireEvent.click(button);

    actions.forEach((action) => {
      expect(screen.getByText(action.label)).toBeInTheDocument();
    });
    fireEvent.click(screen.getAllByRole('menuitem')[0]);

    await waitFor(() => {
      expect(mockMethods.increaseMethodMock).toHaveBeenCalledTimes(0);
    });

    fireEvent.click(screen.getAllByRole('menuitem')[3]);

    await waitFor(() => {
      expect(mockMethods.delegateMethodMock).toHaveBeenCalledTimes(0);
    });
  });
});
