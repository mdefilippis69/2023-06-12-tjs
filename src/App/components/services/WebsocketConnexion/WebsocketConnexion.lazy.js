import React, { lazy, Suspense } from 'react';

const LazyWebsocketConnexion = lazy(() => import('./WebsocketConnexion'));

const WebsocketConnexion = props => (
  <Suspense fallback={null}>
    <LazyWebsocketConnexion {...props} />
  </Suspense>
);

export default WebsocketConnexion;
