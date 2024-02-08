import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { RestoreFromTrash } from '@material-ui/icons';

function ItemListItem({ auctionItem: auctionItem, onDelete }: { auctionItem: any, onDelete: (auctionItemId: string) => void }) {
  const handleDelete = () => {
    onDelete(auctionItem.id);
  };

  // const handleRestore = () => {
  //   onRestore(auction.id);
  // };

  return (
    <ListItem>
      <ListItemText primary={auctionItem.name} secondary={auctionItem.description} />
      <ListItemSecondaryAction>
        <IconButton edge="end" aria-label="delete" onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

export default ItemListItem;
