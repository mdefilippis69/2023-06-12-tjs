import React, { lazy, Suspense } from 'react';

const LazyEditableCell = lazy(() => import('./EditableCell'));

const EditableCell = props => (
  <Suspense fallback={null}>
    <LazyEditableCell {...props} />
  </Suspense>
);

export default EditableCell;
