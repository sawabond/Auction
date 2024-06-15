import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider, useMutation } from 'react-query';
import { vi } from 'vitest';
import { toast } from 'react-toastify';
import CreateAuctionPage from '../../pages/CreateAuctionPage/CreateAuctionPage';
import i18ForTests from '../../i18ForTests';

// Mocking react-query
vi.mock('react-query', async () => {
  const actual =
    await vi.importActual<typeof import('react-query')>('react-query');
  return {
    ...actual,
    useMutation: vi.fn(),
  };
});

// Mocking react-router-dom
vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom'
    );
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

// Mocking react-toastify
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('CreateAuctionPage component', () => {
  const queryClient = new QueryClient();

  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18ForTests}>
          <MemoryRouter>
            <CreateAuctionPage />
          </MemoryRouter>
        </I18nextProvider>
      </QueryClientProvider>
    );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the CreateAuctionPage component correctly', () => {
    renderComponent();
    expect(screen.getByText('createAuctionTitle')).toBeInTheDocument();
    expect(screen.getByLabelText('name')).toBeInTheDocument();
    expect(screen.getByLabelText('description')).toBeInTheDocument();
    expect(screen.getByLabelText('startTime')).toBeInTheDocument();
  });

  it('submits the form when all fields are valid', async () => {
    const mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    const mutateMock = vi.fn((values, options) => {
      options.onSuccess();
    });

    (useMutation as jest.Mock).mockImplementation((fn, options) => ({
      mutate: (values: any) => mutateMock(values, options),
    }));

    renderComponent();

    fireEvent.change(screen.getByLabelText('name'), {
      target: { value: 'Test Auction' },
    });
    fireEvent.change(screen.getByLabelText('description'), {
      target: { value: 'Test Description' },
    });
    fireEvent.change(screen.getByLabelText('startTime'), {
      target: { value: '2024-06-15T10:00' },
    });

    fireEvent.click(screen.getByText('create'));

    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalledWith(
        {
          name: 'Test Auction',
          description: 'Test Description',
          startTime: '2024-06-15T10:00',
          auctionType: 0,
        },
        expect.objectContaining({
          onSuccess: expect.any(Function),
          onError: expect.any(Function),
        })
      );

      expect(toast.success).toHaveBeenCalledWith('auctionCreatedSuccess');
      expect(mockNavigate).toHaveBeenCalledWith('/auctions/my-auctions');
    });
  });

  it('displays an error message when the mutation fails', async () => {
    const mutateMock = vi.fn((values, options) => {
      options.onError(new Error('Test error'));
    });

    (useMutation as jest.Mock).mockImplementation((fn, options) => ({
      mutate: (values: any) => mutateMock(values, options),
    }));

    renderComponent();

    fireEvent.change(screen.getByLabelText('name'), {
      target: { value: 'Test Auction' },
    });
    fireEvent.change(screen.getByLabelText('description'), {
      target: { value: 'Test Description' },
    });
    fireEvent.change(screen.getByLabelText('startTime'), {
      target: { value: '2024-06-15T10:00' },
    });

    fireEvent.click(screen.getByText('create'));

    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalledWith(
        {
          name: 'Test Auction',
          description: 'Test Description',
          startTime: '2024-06-15T10:00',
          auctionType: 0,
        },
        expect.objectContaining({
          onSuccess: expect.any(Function),
          onError: expect.any(Function),
        })
      );

      expect(toast.error).toHaveBeenCalledWith(
        'auctionCreatedError: Test error'
      );
    });
  });
});
