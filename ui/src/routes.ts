import AuctionMessaging from './api/ws/auctionClient';
import { IRoute } from './interfaces/Routes/IRoute';
import AuthPage from './pages/AuthPage/AuthPage';
import Home from './pages/Home/Home';
import Welcome from './pages/Welcome/Welcome';
import CreateAuctionPage from './pages/CreateAuctionPage/CreateAuctionPage';

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
    key: 'auction',
    title: 'Auction',
    path: '/create-auction',
    enabled: true,
    component: CreateAuctionPage,
  },
];

export default routes;
