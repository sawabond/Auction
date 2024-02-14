import * as signalR from '@microsoft/signalr';
import Cookies from 'js-cookie';

class AuctionHubService {
  private connection: signalR.HubConnection | null = null;

  private auctionId: string;

  private onAuctionUpdated: (auction: any) => void;

  constructor(auctionId: string, onAuctionUpdated: (auction: any) => void) {
    this.auctionId = auctionId;
    this.onAuctionUpdated = onAuctionUpdated;
    this.initConnection();
  }

  private async initConnection(): Promise<void> {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_GATEWAY_URL}/auction-hub`, {
        withCredentials: true,
        accessTokenFactory: () => Cookies.get('token') || '',
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    try {
      await this.connection.start();
      console.log('Connection started');
      this.joinGroup();
      this.subscribeToEvents();
    } catch (err) {
      console.error('Connection failed: ', err);
    }
  }

  private async joinGroup(): Promise<void> {
    if (!this.connection) return;
    try {
      await this.connection.invoke('JoinGroup', this.auctionId);
      console.log(`Joined group ${this.auctionId}`);
    } catch (err) {
      console.error('Error invoking JoinGroup:', err);
    }
  }

  private subscribeToEvents(): void {
    this.connection?.on('OnAuctionRunning', (updatedAuction) => {
      console.log('Auction update received:', updatedAuction);
      this.onAuctionUpdated(updatedAuction);
    });

    // Adding more verbose logging for debugging
    this.connection?.on('ItemSold', (item) => {
      console.log('ItemSold event received:', item);
      // Your callback logic here
    });

    console.log('Subscribed to events');
  }

  public async sendBid(bidAmount: number): Promise<void> {
    if (!this.connection) return;
    try {
      await this.connection.invoke('MakeBid', this.auctionId, bidAmount);
      console.log('Bid sent:', bidAmount);
    } catch (error) {
      console.error('Error sending bid:', error);
    }
  }

  public onBidMade(callback: (bid: any) => void): void {
    this.connection?.on('BidMade', callback);
  }

  public disconnect(): void {
    this.connection?.stop().then(() => console.log('Connection stopped'));
  }
}
export default AuctionHubService;
