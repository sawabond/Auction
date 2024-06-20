import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter, useNavigate, useParams } from 'react-router-dom';
import { QueryClient, QueryClientProvider, useMutation } from 'react-query';
import { toast } from 'react-toastify';
import EditAuctionItemPage from '../../pages/EditAuctionItemPage/EditAuctionItemPage';
import i18ForTests from '../../i18ForTests';
import getAuctionItem from '../../pages/EditAuctionItemPage/services/getAuctionItem';
import downloadFileFromS3AndMakeFile from '../../pages/EditAuctionItemPage/services/downloadFileFromS3AndMakeFile';

vi.mock('react-query', async () => {
  const actual =
    await vi.importActual<typeof import('react-query')>('react-query');
  return {
    ...actual,
    useMutation: vi.fn(),
  };
});

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom'
    );
  return {
    ...actual,
    useNavigate: vi.fn(),
    useParams: vi.fn(),
  };
});

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('../../pages/EditAuctionItemPage/services/getAuctionItem');
vi.mock('../../pages/EditAuctionItemPage/services/editAuctionItem');
vi.mock(
  '../../pages/EditAuctionItemPage/services/downloadFileFromS3AndMakeFile'
);

describe('EditAuctionItemPage component', () => {
  const queryClient = new QueryClient();

  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18ForTests}>
          <MemoryRouter>
            <EditAuctionItemPage />
          </MemoryRouter>
        </I18nextProvider>
      </QueryClientProvider>
    );

  beforeEach(() => {
    vi.clearAllMocks();
    (useParams as ReturnType<typeof vi.fn>).mockReturnValue({
      auctionId: '1',
      auctionItemId: '1',
    });
  });

  it('renders the loading state correctly', () => {
    (getAuctionItem as ReturnType<typeof vi.fn>).mockResolvedValueOnce(null);

    renderComponent();

    expect(screen.getByText('loadingAuction')).toBeInTheDocument();
  });

  it('renders the EditAuctionItemPage component correctly after fetching data', async () => {
    const mockAuctionItem = {
      startingPrice: 100,
      minimalBid: 10,
      name: 'Test Auction Item',
      description: 'Test Description',
      photos: [{ photoUrl: 'http://example.com/photo.jpg', name: 'photo.jpg' }],
    };

    (getAuctionItem as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      mockAuctionItem
    );
    (
      downloadFileFromS3AndMakeFile as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce(new File([''], 'photo.jpg'));

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('editAuctionItemTitle')).toBeInTheDocument();
      expect(screen.getByLabelText(/Starting Price/i)).toHaveValue('100');
      expect(screen.getByLabelText(/Minimal Bid/i)).toHaveValue('10');
      expect(screen.getByLabelText(/Item Name/i)).toHaveValue(
        'Test Auction Item'
      );
      expect(screen.getByLabelText(/Item Description/i)).toHaveValue(
        'Test Description'
      );
    });
  });

  it('submits the form when all fields are valid', async () => {
    const mockNavigate = vi.fn();
    (useNavigate as ReturnType<typeof vi.fn>).mockReturnValue(mockNavigate);

    const mockAuctionItem = {
      startingPrice: 100,
      minimalBid: 10,
      name: 'Test Auction Item',
      description: 'Test Description',
      photos: [{ photoUrl: 'http://example.com/photo.jpg', name: 'photo.jpg' }],
    };

    (getAuctionItem as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      mockAuctionItem
    );
    (
      downloadFileFromS3AndMakeFile as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce(new File([''], 'photo.jpg'));

    const mutateMock = vi.fn((values, options) => {
      options.onSuccess();
    });

    (useMutation as ReturnType<typeof vi.fn>).mockImplementation(
      (fn, options) => ({
        mutateAsync: (values: any) => mutateMock(values, options),
      })
    );

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('editAuctionItemTitle')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/Starting Price/i), {
      target: { value: '200' },
    });
    fireEvent.change(screen.getByLabelText(/Minimal Bid/i), {
      target: { value: '20' },
    });
    fireEvent.change(screen.getByLabelText(/Item Name/i), {
      target: { value: 'Updated Auction Item' },
    });
    fireEvent.change(screen.getByLabelText(/Item Description/i), {
      target: { value: 'Updated Description' },
    });

    fireEvent.click(screen.getByText('save'));

    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalledWith(
        expect.objectContaining({
          formData: expect.any(FormData),
          auctionId: '1',
        }),
        expect.objectContaining({
          onSuccess: expect.any(Function),
          onError: expect.any(Function),
        })
      );

      expect(toast.success).toHaveBeenCalledWith('auctionItemSavedSuccess');
      expect(mockNavigate).toHaveBeenCalledWith('/auctions/1/edit');
    });
  });

  it('displays an error message when the mutation fails', async () => {
    const mockAuctionItem = {
      startingPrice: 100,
      minimalBid: 10,
      name: 'Test Auction Item',
      description: 'Test Description',
      photos: [{ photoUrl: 'http://example.com/photo.jpg', name: 'photo.jpg' }],
    };

    (getAuctionItem as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      mockAuctionItem
    );
    (
      downloadFileFromS3AndMakeFile as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce(new File([''], 'photo.jpg'));

    const mutateMock = vi.fn((values, options) => {
      options.onError(new Error('Test error'));
    });

    (useMutation as ReturnType<typeof vi.fn>).mockImplementation(
      (fn, options) => ({
        mutateAsync: (values: any) => mutateMock(values, options),
      })
    );

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('editAuctionItemTitle')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/Starting Price/i), {
      target: { value: '200' },
    });
    fireEvent.change(screen.getByLabelText(/Minimal Bid/i), {
      target: { value: '20' },
    });
    fireEvent.change(screen.getByLabelText(/Item Name/i), {
      target: { value: 'Updated Auction Item' },
    });
    fireEvent.change(screen.getByLabelText(/Item Description/i), {
      target: { value: 'Updated Description' },
    });

    fireEvent.click(screen.getByText('save'));

    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalledWith(
        expect.objectContaining({
          formData: expect.any(FormData),
          auctionId: '1',
        }),
        expect.objectContaining({
          onSuccess: expect.any(Function),
          onError: expect.any(Function),
        })
      );

      expect(toast.error).toHaveBeenCalledWith(
        'auctionItemSavedError: Test error'
      );
    });
  });
});
