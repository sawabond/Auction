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
import EditAuctionItemPage from './pages/EditAuctionItemPage/EditAuctionItemPage';
import MyBoughtAuctionItemsPage from './pages/MyBoughtAuctionItemsPage/MyBoughtAuctionItemsPage';

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
    path: '/auctions/:auctionId',
    enabled: true,
    component: AuctionMessaging,
  },
  {
    key: 'create-auction',
    title: 'Create auction',
    path: '/auctions/create',
    enabled: true,
    component: CreateAuctionPage,
  },
  {
    key: 'edit-auction',
    title: 'Edit auction',
    path: '/auctions/:auctionId/edit',
    enabled: true,
    component: EditAuctionPage,
  },
  {
    key: 'add-auction-item',
    title: 'Add auction item',
    path: '/auctions/:auctionId/items/add',
    enabled: true,
    component: AddAuctionItemPage,
  },
  {
    key: 'edit-auction-item',
    title: 'Edit auction item',
    path: '/auctions/:auctionId/items/:auctionItemId/edit',
    enabled: true,
    component: EditAuctionItemPage,
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
  {
    key: 'my-auctions-page',
    title: 'My auctions page',
    path: '/auctions/my-auctions',
    enabled: true,
    component: MyAuctionsPage,
  },
  {
    key: 'my-bought-auction-items-page',
    title: 'My auctions page',
    path: '/items/my-bought-items',
    enabled: true,
    component: MyBoughtAuctionItemsPage,
  },
];

export default routes;
