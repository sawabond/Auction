import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';



function ItemListItem({ auctionItem: auctionItem} : { auctionItem: any}) 
{
  const { t } = useTranslation();

  const DeliveryStatus = {
    0: t('notStarted'),
    1: t('inProgress'),
    2: t('delivered'),
  };

  return (
    <Card className="MuiBox-root grid grid-cols-6 items-center gap-4">
      <CardMedia
        component="img"
        image={auctionItem.photos[0]?.photoUrl}
        alt={t('yourImage')}
        className="w-1/3 h-32 object-cover"
      />
      <CardMedia
        component="img"
        image={auctionItem.photos[1]?.photoUrl}
        alt={t('yourImage')}
        className="w-1/3 h-32 object-cover"
      />
      <CardMedia
        component="img"
        image={auctionItem.photos[2]?.photoUrl}
        alt={t('yourImage')}
        className="w-1/3 h-32 object-cover"
      />
      <Typography variant="body1" className="text-lg font-semibold">{auctionItem.name}</Typography>
      <Typography variant="body1">Spent money: {auctionItem.actualPrice}</Typography>
      <Typography variant="body1">{DeliveryStatus[auctionItem.deliveryStatus]}</Typography>
    </Card>
  );
}

export default ItemListItem;
