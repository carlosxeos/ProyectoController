/* eslint-disable prettier/prettier */
import React, {createContext, useState} from 'react';
// Crear contexto global
export const AppContext = createContext(null);

export const AppProvider = ({children}) => {
  const [sessionData, setSessionData] = useState({biometricType: -2}); // Variable solo mientras la app está en uso

  return (
    <AppContext.Provider value={{sessionData, setSessionData}}>
      {children}
    </AppContext.Provider>
  );
};
