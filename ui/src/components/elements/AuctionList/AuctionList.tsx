import List from '@material-ui/core/List';
import AuctionListItem from '../AuctionListItem/AuctionListItem';

function AuctionList({ auctions }: any) {
  console.log(auctions)
  return (
    <div className="mx-auto my-4">
      <List>
        {auctions.map((auction: any) => (
          <AuctionListItem key={auction.id} auction={auction} />
        ))}
      </List>
    </div>
  );
}

export default AuctionList;
