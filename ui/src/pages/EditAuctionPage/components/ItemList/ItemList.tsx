import List from '@material-ui/core/List';
import ItemListItem from '../ItemListItem/ItemListItem';

function ItemList({ auctionItems, onDelete }: { auctionItems: any[] | undefined, onDelete: (auctionId: string) => void }) {
  // Check if auctionItems is undefined or null before mapping
  if (!auctionItems) {
    return <div>No items to display</div>;
  }

  return (
    <div className="mx-auto my-4 overflow-auto h-full max-h-[52vh]">
      <List className="grid grid-cols-3 gap-4">
        {auctionItems.map((auctionItem: any) => (
          <ItemListItem key={auctionItem.id} auctionItem={auctionItem} onDelete={onDelete} />
        ))}
      </List>
    </div>
  );
}

export default ItemList;
