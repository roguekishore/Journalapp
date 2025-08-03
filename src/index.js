import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css'; 
import './firebase'; 
import store from './store';
import { Provider } from 'react-redux';

if (process.env.NODE_ENV === "production") {
  const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
  navigator.serviceWorker.register(swUrl).then((registration) => {
    console.log("Service Worker registered: ", registration);
  }).catch((error) => {
    console.log("Service Worker registration failed: ", error);
  });
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
