import AuctionMessaging from './api/ws/auctionClient';
import { IRoute } from './interfaces/Routes/IRoute';
import AuthPage from './pages/AuthPage/AuthPage';
import Home from './pages/Home/Home';
import Welcome from './pages/Welcome/Welcome';
import CreateAuctionPage from './pages/CreateAuctionPage/CreateAuctionPage';
import AddAuctionItemPage from './pages/AddAuctionItemPage/AddAuctionItemPage';

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
    key: 'create-auction-item',
    title: 'Create auction item',
    path: '/auction/:auctionId/create-auction-item',
    enabled: true,
    component: AddAuctionItemPage,
  },
];

export default routes;
