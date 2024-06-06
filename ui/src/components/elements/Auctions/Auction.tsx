import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import AuctionItemGroup from '../Items/AuctionItemGroup';
import { useTranslation } from 'react-i18next';

const OPTIONS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false, // Use 24-hour format
};

function Auction({ auction }: any) {
  const { t } = useTranslation();
  const LOCALE = t('localTimeFormat');
  const auctionStartTime: Date = new Date(auction.startTime);
  const formattedAuctionStartTime: string = auctionStartTime.toLocaleString(LOCALE, OPTIONS);
  const auctionEndTime: Date = new Date(auction.endTime);
  const formattedAuctionEndTime: string = auctionEndTime.toLocaleString(LOCALE, OPTIONS);

  return (
    <ListItem key={auction.id} className="hover:bg-gray-100 grid grid-cols-3 gap-4">
      <div>      
        <ListItemText primary={auction.name}/>
        <ListItemText primary={t('startsAt') + formattedAuctionStartTime}/>
        { auction.endTime ? 
          <ListItemText primary={t('endsAt') + formattedAuctionEndTime}/> 
          : <></>
        }
      </div>
      <AuctionItemGroup auctionItems={auction.auctionItems} className="col-span-2"></AuctionItemGroup>
    </ListItem>
  );
}

export default Auction;
