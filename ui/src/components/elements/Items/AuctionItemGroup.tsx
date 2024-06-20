import { List } from "@material-ui/core";
import AuctionItem from "./AuctionItem";

const MAX_AUCTION_ITEM_GROUP_SIZE = 4;

function AuctionItemGroup({ auctionItems }: any) {
    if (!auctionItems) {
        return <div>No items to display</div>;
    }
    return (
        <div >
            <List className="grid grid-cols-4 grid-rows-1 gap-20">
                {auctionItems.slice(0, MAX_AUCTION_ITEM_GROUP_SIZE).map((auctionItem: any) => (
                    <AuctionItem key={auctionItem.id} auctionItem={auctionItem}/>
                ))}
            </List>
        </div>
    );
}
  
export default AuctionItemGroup;