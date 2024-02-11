import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { Typography } from '@material-ui/core';

function ItemListItem({ auctionItem: auctionItem, onDelete }: { auctionItem: any, onDelete: (auctionItemId: string) => void }) {
  const handleDelete = () => {
    onDelete(auctionItem.id);
  };


  return (
    <Card sx={{ maxWidth: 345, minWidth: 160 }}>
      <CardMedia
        component="img"
        image={auctionItem.photos[0]?.photoUrl}
        alt="Your Image"
        className="w-32 h-32 object-cover"
      />
      <Typography variant="body1">{auctionItem.name}</Typography>
        <IconButton edge="end" aria-label="delete" onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>
    </Card>

  );
}

export default ItemListItem;
