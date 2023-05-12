import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { mobileNotificationsFirebase } from "./utils/MobileNotificationsProvider";

export const MobileNotificationsContext = React.createContext({});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <MobileNotificationsContext.Provider value={mobileNotificationsFirebase}>
        <App />
      </MobileNotificationsContext.Provider>
  </React.StrictMode>
);
