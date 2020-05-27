import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import configureStore from './redux/store/index';
import { registerServiceWorker } from "./register-sw";
const Root = () => (
  <Provider store={configureStore()}>
    <App />
  </Provider>
);

registerServiceWorker();


ReactDOM.render(<Root />, document.getElementById('root'));
