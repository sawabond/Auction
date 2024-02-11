import AuctionMessaging from './api/ws/auctionClient';
import { IRoute } from './interfaces/Routes/IRoute';
import AuthPage from './pages/AuthPage/AuthPage';
import Home from './pages/Home/Home';
import Welcome from './pages/Welcome/Welcome';
import CreateAuctionPage from './pages/CreateAuctionPage/CreateAuctionPage';
import AddAuctionItemPage from './pages/AddAuctionItemPage/AddAuctionItemPage';
import Profile from './pages/Profile/Profile';
import Payment from './pages/Payment/Payment';

const routes: IRoute[] = [
  {
    key: 'home',
    title: 'Home',
    path: '/home',
    enabled: true,
    component: Home,
  },
  {
    key: 'welcome',
    title: 'Welcome',
    path: '/',
    enabled: true,
    component: Welcome,
  },
  {
    key: 'auth',
    title: 'AuthPage',
    path: '/auth',
    enabled: true,
    component: AuthPage,
  },
  {
    key: 'auction',
    title: 'Auction',
    path: '/auction/:auctionId',
    enabled: true,
    component: AuctionMessaging,
  },
  {
    key: 'create-auction',
    title: 'Create auction',
    path: '/create-auction',
    enabled: true,
    component: CreateAuctionPage,
  },
  {
    key: 'add-auction-item',
    title: 'Add auction item',
    path: '/auction/:auctionId/add-auction-item',
    enabled: true,
    component: AddAuctionItemPage,
  },
  {
    key: 'profile',
    title: 'Profile',
    path: '/profile',
    enabled: true,
    component: Profile,
  },
  {
    key: 'payment',
    title: 'Payment',
    path: '/payment',
    enabled: true,
    component: Payment,
  },
];

export default routes;
