import List from '@material-ui/core/List';
import ItemListItem from './ItemListItem';

function ItemList({ auctionItems } : any) {
  if (!auctionItems) {
    return <div>No items to display</div>;
  }

  return (
    <div className="mx-auto my-4 overflow-auto">
      <List className="flex flex-col gap-4">
        {auctionItems.map((auctionItem: any) => (
          <ItemListItem key={auctionItem.id} auctionItem={auctionItem}/>
        ))}
      </List>
    </div>
  );
}

export default ItemList;
