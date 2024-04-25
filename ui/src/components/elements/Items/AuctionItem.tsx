import { Card, CardMedia, Typography } from "@material-ui/core";

function AuctionItem({ auctionItem }: any) {
    return (
<Card className="MuiBox-root grid items-center gap-2 p-2 w-40">
  <CardMedia
    component="img"
    image={auctionItem.photos[0]?.photoUrl}
    alt="Your Image"
    className="object-cover w-24 h-24"
  />
  <Typography variant="body1" className="text-sm font-semibold">{auctionItem.name}</Typography>
</Card>

      );
  }
  
  export default AuctionItem;