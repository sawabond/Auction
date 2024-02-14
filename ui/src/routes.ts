import AuctionMessaging from './api/ws/auctionClient';
import { IRoute } from './interfaces/Routes/IRoute';
import AuthPage from './pages/AuthPage/AuthPage';
import Home from './pages/Home/Home';
import Welcome from './pages/Welcome/Welcome';
import CreateAuctionPage from './pages/CreateAuctionPage/CreateAuctionPage';
import AddAuctionItemPage from './pages/AddAuctionItemPage/AddAuctionItemPage';
import MyAuctionsPage from './pages/MyAuctionsPage/MyAuctionsPage';
import EditAuctionPage from './pages/EditAuctionPage/EditAuctionPage';
import EditAuctionItemPage from './pages/EditAuctionItemPage/EditAuctionItemPage';

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
    path: '/auctions/:auctionId/auction-items/add',
    enabled: true,
    component: AddAuctionItemPage,
  },
  {
    key: 'edit-auction-item',
    title: 'Edit auction item',
    path: '/auctions/:auctionId/auction-items/:auctionItemId/edit',
    enabled: true,
    component: EditAuctionItemPage,
  },
  {
    key: 'my-auctions-page',
    title: 'My auctions page',
    path: '/auctions/my-auctions',
    enabled: true,
    component: MyAuctionsPage,
  },
];

export default routes;
