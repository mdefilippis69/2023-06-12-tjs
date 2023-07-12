import React, { lazy, Suspense } from 'react';

const LazyPatchEditor = lazy(() => import('./PatchEditor'));

const PatchEditor = props => (
  <Suspense fallback={null}>
    <LazyPatchEditor {...props} />
  </Suspense>
);

export default PatchEditor;
