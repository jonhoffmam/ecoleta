import React from 'react';
import { BrowserRouter, Route, Routes as RoutesContainer } from 'react-router-dom';

import CreatePoint from './pages/CreatePoint';
import Home from './pages/Home';
import SearchPoint from './pages/SearchPoint';

const Routes = () => {
  return (
    <BrowserRouter>
      <RoutesContainer>
        <Route Component={Home} path='/' />
        <Route Component={CreatePoint} path='/create-point' />
        <Route Component={SearchPoint} path='/search-point/:typeLocal/:setLocal' />
      </RoutesContainer>
    </BrowserRouter>
  );
};

export default Routes;
