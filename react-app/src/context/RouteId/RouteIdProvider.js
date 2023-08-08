import React, { useState } from 'react';
import RouteIdContext from './RouteIdContext';

const RouteIdProvider = ({ children }) => {
  const [routeId, setRouteId] = useState(null);

  return (
    <RouteIdContext.Provider value={[routeId, setRouteId]}>
      {children}
    </RouteIdContext.Provider>
  );
};

export default RouteIdProvider;
