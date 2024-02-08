import React from 'react';
import List from '@material-ui/core/List';
import ItemListItem from '../ItemListItem/ItemListItem';

function ItemList({ auctionItems, onDelete }: { auctionItems: any[] | undefined, onDelete: (auctionId: string) => void }) {
  // Check if auctionItems is undefined or null before mapping
  if (!auctionItems) {
    return <div>No items to display</div>;
  }

  return (
    <div className="mx-auto my-4">
      <List>
        {auctionItems.map((auctionItem: any) => (
          <ItemListItem key={auctionItem.id} auctionItem={auctionItem} onDelete={onDelete} />
        ))}
      </List>
    </div>
  );
}

export default ItemList;
