import List from '@material-ui/core/List';
import ItemListItemEdit from '../ItemListItemEdit/ItemListItemEdit';

function ItemListEdit({ auctionItems, onDelete, onMove }: 
  { 
    auctionItems: any[] | undefined, 
    onDelete: (auctionId: string) => void, 
    onMove: (auctionId: string) => void 
  }) {

  if (!auctionItems) {
    return <div>No items to display</div>;
  }

  return (
    <div className="mx-auto my-4 overflow-auto h-full max-h-[52vh]">
      <List className="grid grid-cols-3 gap-4">
        {auctionItems.map((auctionItem: any) => (
          <ItemListItemEdit key={auctionItem.id} auctionItem={auctionItem} onMove={onMove} onDelete={onDelete} />
        ))}
      </List>
    </div>
  );
}

export default ItemListEdit;
