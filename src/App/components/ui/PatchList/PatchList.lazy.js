import React, { lazy, Suspense } from 'react';

const LazyPatchList = lazy(() => import('./PatchList'));

const PatchList = props => (
  <Suspense fallback={null}>
    <LazyPatchList {...props} />
  </Suspense>
);

export default PatchList;
