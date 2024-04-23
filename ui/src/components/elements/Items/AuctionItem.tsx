import { Card, CardMedia, Typography } from "@material-ui/core";

function AuctionItem({ auctionItem }: any) {
    return (
        <Card className="MuiBox-root grid items-center gap-4">
          <CardMedia
            component="img"
            image={auctionItem.photos[0]?.photoUrl}
            alt="Your Image"
            className="h-32 object-cover"
          />
          <Typography variant="body1" className="text-lg font-semibold">{auctionItem.name}</Typography>
        </Card>
      );
  }
  
  export default AuctionItem;