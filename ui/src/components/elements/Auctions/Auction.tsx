import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import AuctionItemGroup from '../Items/AuctionItemGroup';

function Auction({ auction }: any) {
  return (
    <ListItem key={auction.id} className="hover:bg-gray-100 grid grid-flow-row-dense grid-cols-3">
      <ListItemText primary={auction.name} secondary={auction.description} />
      <AuctionItemGroup auctionItems={auction.auctionItems}></AuctionItemGroup>
    </ListItem>
  );
}

export default Auction;
