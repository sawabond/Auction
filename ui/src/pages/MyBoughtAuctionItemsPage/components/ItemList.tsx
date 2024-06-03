import List from '@material-ui/core/List';
import ItemListItem from './ItemListItem';
import { useTranslation } from 'react-i18next';

function ItemList({ auctionItems } : any) {
  const { t } = useTranslation();

  if (!auctionItems) {
    return <div>{t('noItems')}</div>;
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
