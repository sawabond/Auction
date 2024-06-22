import { Card, CardMedia, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

function AuctionItem({ auctionItem }: any) {
  const { t } = useTranslation();
  return (
    <Card className="MuiBox-root grid items-center gap-2 p-2 w-40">
      <CardMedia
        component="img"
        image={auctionItem.photos[0]?.photoUrl}
        alt={t('yourImage')}
        className="object-cover w-24 h-24"
      />
      <Typography variant="body1" className="text-sm font-semibold">
        {auctionItem.name}
      </Typography>
    </Card>
  );
}

export default AuctionItem;
