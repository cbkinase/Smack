import React, { useState } from 'react';
import SelectedUserRightBarContext from './SelectedUserRightBarContext';

const SelectedUserRightBarProvider = ({ children }) => {
  const [selectedUserRightBar, setSelectedUserRightBar] = useState(null);

  return (
    <SelectedUserRightBarContext.Provider value={[selectedUserRightBar, setSelectedUserRightBar]}>
      {children}
    </SelectedUserRightBarContext.Provider>
  );
};

export default SelectedUserRightBarProvider;
