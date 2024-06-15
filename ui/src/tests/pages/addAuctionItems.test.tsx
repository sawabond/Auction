import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { vi } from 'vitest';
import i18ForTests from '../../i18ForTests';
import AddAuctionItemPage from '../../pages/AddAuctionItemPage/AddAuctionItemPage';
import * as addAuctionItemService from '../../pages/AddAuctionItemPage/services/addAuctionItem';

vi.mock('../../components/AddAuctionItemPage/services/addAuctionItem');

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom'
    );
  return {
    ...actual,
    useNavigate: vi.fn(),
    useParams: () => ({ auctionId: '1' }),
  };
});

describe('AddAuctionItemPage component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const queryClient = new QueryClient();

  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18ForTests}>
          <MemoryRouter>
            <AddAuctionItemPage />
          </MemoryRouter>
        </I18nextProvider>
      </QueryClientProvider>
    );

  it('renders the AddAuctionItemPage component correctly', () => {
    renderComponent();
    expect(screen.getByText('Add Auction Item')).toBeInTheDocument();
    expect(screen.getByLabelText('Starting Price')).toBeInTheDocument();
    expect(screen.getByLabelText('Minimal Bid')).toBeInTheDocument();
    expect(screen.getByLabelText('Item Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Item Description')).toBeInTheDocument();
  });

  it('shows validation errors when required fields are empty', async () => {
    renderComponent();

    fireEvent.click(screen.getByText('Add'));

    await waitFor(() => {
      expect(
        screen.getByText('Starting price is required')
      ).toBeInTheDocument();
      expect(screen.getByText('Minimal bid is required')).toBeInTheDocument();
      expect(screen.getByText('Item name is required')).toBeInTheDocument();
      expect(
        screen.getByText('Item description is required')
      ).toBeInTheDocument();
    });
  });

  it('submits the form when all fields are valid', async () => {
    vi.spyOn(addAuctionItemService, 'default').mockResolvedValue({});

    renderComponent();

    fireEvent.change(screen.getByLabelText('Starting Price'), {
      target: { value: '100' },
    });
    fireEvent.change(screen.getByLabelText('Minimal Bid'), {
      target: { value: '10' },
    });
    fireEvent.change(screen.getByLabelText('Item Name'), {
      target: { value: 'Test Item' },
    });
    fireEvent.change(screen.getByLabelText('Item Description'), {
      target: { value: 'This is a test item' },
    });

    fireEvent.click(screen.getByText('Add'));

    await waitFor(() => {
      expect(addAuctionItemService.default).toHaveBeenCalled();
      expect(addAuctionItemService.default).toHaveBeenCalledWith(
        expect.any(Object),
        '1',
        expect.any(Function)
      );
    });
  });
});
