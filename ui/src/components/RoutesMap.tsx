import React from 'react';
import { Routes, Route } from 'react-router-dom';
import routes from '../routes';

export default function RoutesMap() {
  return (
    <Routes>
      {routes.map(({ key, path, component: Component }) => (
        <Route key={key} path={path} element={<Component />} />
      ))}
    </Routes>
  );
}
