import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: {
      translation: {
        addAuctionItemTitle: 'Add Auction Item',
        startingPrice: 'Starting Price',
        startingPricePositive: 'Starting price must be positive',
        startingPriceRequired: 'Starting price is required',
        minimalBid: 'Minimal Bid',
        minimalBidPositive: 'Minimal bid must be positive',
        minimalBidRequired: 'Minimal bid is required',
        itemName: 'Item Name',
        itemNameMax: 'Item name must be less than 50 characters',
        itemNameRequired: 'Item name is required',
        itemDescription: 'Item Description',
        itemDescriptionMax: 'Item description must be less than 500 characters',
        itemDescriptionRequired: 'Item description is required',
        auctionItemAddedSuccess: 'Auction item added successfully',
        auctionItemAddedError: 'Error adding auction item',
        add: 'Add',
        addMultiple: 'Add Multiple',
      },
    },
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
