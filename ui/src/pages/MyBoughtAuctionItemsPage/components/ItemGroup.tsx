import List from '@material-ui/core/List';
import Item from './Item';
import { useTranslation } from 'react-i18next';

function ItemGroup({ auctionItems } : any) {
  const { t } = useTranslation();

  if (!auctionItems) {
    return <div>{t('noItems')}</div>;
  }

  return (
    <div className="mx-auto my-4 overflow-auto">
      <List className="flex flex-col gap-4">
        {auctionItems.map((auctionItem: any) => (
          <Item key={auctionItem.id} auctionItem={auctionItem}/>
        ))}
      </List>
    </div>
  );
}

export default ItemGroup;
