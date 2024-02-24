import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { Typography } from '@material-ui/core';

function ItemListItem({ auctionItem: auctionItem}: 
{ 
  auctionItem: any, 
}) 
{

  return (
    <Card sx={{ maxWidth: 345, minWidth: 160 }}>
      <CardMedia
        component="img"
        image={auctionItem.photos[0]?.photoUrl}
        alt="Your Image"
        className="w-32 h-32 object-cover"
      />
      <Typography variant="body1">{auctionItem.name}</Typography>
    </Card>

  );
}

export default ItemListItem;
