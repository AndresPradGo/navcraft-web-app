import React from 'react';

interface ModelPermissionsContextType {
  isModel: boolean;
  userIsAdmin: boolean;
}

const ModelPermissionsContext =
  React.createContext<ModelPermissionsContextType>(
    {} as ModelPermissionsContextType,
  );

export default ModelPermissionsContext;
