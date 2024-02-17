import AuctionMessaging from './api/ws/auctionClient';
import { IRoute } from './interfaces/Routes/IRoute';
import AuthPage from './pages/AuthPage/AuthPage';
import Home from './pages/Home/Home';
import Welcome from './pages/Welcome/Welcome';
import CreateAuctionPage from './pages/CreateAuctionPage/CreateAuctionPage';
import AddAuctionItemPage from './pages/AddAuctionItemPage/AddAuctionItemPage';
import Profile from './pages/Profile/Profile';
import Payment from './pages/Payment/Payment';
import MyAuctionsPage from './pages/MyAuctionsPage/MyAuctionsPage';
import EditAuctionPage from './pages/EditAuctionPage/EditAuctionPage';

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
    key: 'edit-auction',
    title: 'Edit auction',
    path: '/auction/:auctionId/edit-auction',
    enabled: true,
    component: EditAuctionPage,
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
  {
    key: 'my-auctions-page',
    title: 'My auctions page',
    path: '/my-auctions',
    enabled: true,
    component: MyAuctionsPage,
  },
];

export default routes;
