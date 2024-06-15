import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { vi } from 'vitest';
import Cookies from 'js-cookie';
import Header from '../../components/Header/Header';
import i18ForTests from '../../i18ForTests';

vi.mock('js-cookie', () => {
  const originalModule = vi.importActual('js-cookie');
  return {
    __esModule: true,
    ...originalModule,
    default: {
      get: vi.fn(),
      remove: vi.fn(),
    },
  };
});

vi.mock('../../components/Header/hooks/useBalance', () => ({
  __esModule: true,
  default: vi.fn(() => ({
    data: { amount: 100 },
    isLoading: false,
    error: null,
  })),
}));

vi.mock('../../hooks/useUserFromToken', () => ({
  __esModule: true,
  default: vi.fn(() => ({
    id: 'user-id',
    email: 'user@example.com',
    roles: ['User'],
  })),
}));

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

describe('Header component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const queryClient = new QueryClient();

  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18ForTests}>
          <MemoryRouter>
            <Header />
          </MemoryRouter>
        </I18nextProvider>
      </QueryClientProvider>
    );

  it('renders the Header component correctly', () => {
    renderComponent();
    expect(screen.getByText('AuctionOnline')).toBeInTheDocument();
    expect(screen.getByLabelText('language selection')).toBeInTheDocument();
  });

  it('displays balance, profile, and logout options for authenticated users', () => {
    (Cookies.get as jest.Mock).mockReturnValue('true');

    renderComponent();

    expect(screen.getByText('balance: 100 currency')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('account of current user'));
    expect(screen.getByText('profile')).toBeInTheDocument();
    expect(screen.getByText('topUp')).toBeInTheDocument();
    expect(screen.getByText('logout')).toBeInTheDocument();
  });

  it('navigates to the profile page when profile menu item is clicked', () => {
    (Cookies.get as jest.Mock).mockReturnValue('true');
    const mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    renderComponent();

    fireEvent.click(screen.getByLabelText('account of current user'));
    fireEvent.click(screen.getByText('profile'));

    expect(mockNavigate).toHaveBeenCalledWith('/profile');
  });

  it('logs out the user when logout menu item is clicked', () => {
    (Cookies.get as jest.Mock).mockReturnValue('true');

    renderComponent();

    fireEvent.click(screen.getByLabelText('account of current user'));
    fireEvent.click(screen.getByText('logout'));

    expect(Cookies.remove as jest.Mock).toHaveBeenCalledWith('token');
    expect(Cookies.remove as jest.Mock).toHaveBeenCalledWith('isAuthenticated');
  });

  it('changes language when a language option is clicked', () => {
    renderComponent();

    fireEvent.click(screen.getByLabelText('language selection'));
    fireEvent.click(screen.getByText('English'));

    expect(i18ForTests.language).toBe('en');

    fireEvent.click(screen.getByLabelText('language selection'));
    fireEvent.click(screen.getByText('Українська'));

    expect(i18ForTests.language).toBe('ua');
  });
});
