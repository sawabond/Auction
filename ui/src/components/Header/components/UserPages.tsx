import React from 'react';
import Page from './Page';

function UserPages() {
  return (
    <React.Fragment>
        <Page pageName="myBoughtItems" url="/items/my-bought-items"></Page>
    </React.Fragment>
  );
}

export default UserPages;
