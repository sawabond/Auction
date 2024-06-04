import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

function ItemListItemEdit({ auctionItem: auctionItem, onDelete, onMove }: 
{ 
  auctionItem: any, 
  onDelete: (auctionItemId: string) => void,
  onMove: (auctionItemId: string) => void 
}) 
{
  const { t } = useTranslation();
  const handleDelete = () => {
    onDelete(auctionItem.id);
  };

  const handleMove = () =>  {
    onMove(auctionItem.id);
  };


  return (
    <Card sx={{ maxWidth: 345, minWidth: 160 }}>
      <CardMedia
        component="img"
        image={auctionItem.photos[0]?.photoUrl}
        alt={t('Your image')}
        className="w-32 h-32 object-cover"
      />
      <Typography variant="body1">{auctionItem.name}</Typography>
      <div className='flex justify-between'>
      <IconButton edge="end" aria-label="delete" onClick={handleMove}>
        <EditIcon />
      </IconButton>
      <IconButton edge="end" aria-label="delete" onClick={handleDelete}>
        <DeleteIcon />
      </IconButton>
      </div>
    </Card>

  );
}

export default ItemListItemEdit;
