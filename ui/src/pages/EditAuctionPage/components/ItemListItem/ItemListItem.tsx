import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

function ItemListItem({ auction, onDelete }: { auction: any, onDelete: (auctionId: string) => void }) {
  const handleDelete = () => {
    onDelete(auction.id);
  };

  return (
    <ListItem>
      <ListItemText primary={auction.name} secondary={auction.description} />
      <ListItemSecondaryAction>
        <IconButton edge="end" aria-label="delete" onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

export default ItemListItem;
