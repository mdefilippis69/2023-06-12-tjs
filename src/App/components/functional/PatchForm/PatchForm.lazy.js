import React, { lazy, Suspense } from 'react';

const LazyPatchForm = lazy(() => import('./PatchForm'));

const PatchForm = props => (
  <Suspense fallback={null}>
    <LazyPatchForm {...props} />
  </Suspense>
);

export default PatchForm;
