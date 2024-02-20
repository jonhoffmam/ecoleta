import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import CreatePoint from './pages/CreatePoint';
import Home from './pages/Home';
import SearchPoint from './pages/SearchPoint';

const Routes = () => {
  return (
    <BrowserRouter>
      <Route Component={Home} path='/' />
      <Route Component={CreatePoint} path='/create-point' />
      <Route Component={SearchPoint} path='/search-point/:typeLocal/:setLocal' />
    </BrowserRouter>
  );
};

export default Routes;
