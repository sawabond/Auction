import React from 'react';
import Page from './Page';

function SellerPages() {
  return (
    <React.Fragment>
        <Page pageName="myAuctions" url="/auctions/my-auctions"></Page>
        <Page pageName="createAuctionTitle" url="/auctions/create"></Page>
    </React.Fragment>
  );
}

export default SellerPages;
