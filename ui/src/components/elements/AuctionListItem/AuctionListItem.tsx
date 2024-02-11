import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

function AuctionListItem({ auction }: any) {
  return (
    <ListItem key={auction.id} className="hover:bg-gray-100">
      <ListItemText primary={auction.name} secondary={auction.description} />
    </ListItem>
  );
}

export default AuctionListItem;