/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { ReactElement } from 'react';
import './App.css';
import Main from './components/Main/Main';
import { messaging } from './init-fcm';
import firebase from 'firebase';

const renderNotification = (
  notification: React.ReactNode,
  i: string | number | undefined
) => <li key={i}>{notification}</li>;

interface Props {
  token: any;
}

export interface IAppProps {}

export interface IAppState {
  notifications: any;
  token: any;
}

class App extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);

    this.state = {
      notifications: [],
      token: ''
    };
  }
  registerPushListener = () =>
    navigator.serviceWorker.addEventListener('message', ({ data }) => {
      return this.pushNotification(
        data.data ? data.data : data['firebase-messaging-msg-data'].data.message
      );
    });

  async componentDidMount() {
    // messaging
    //   .requestPermission()
    //   .then(async () => {
    //     const token = await messaging.getToken();
    //     console.log('token', token);

    //     this.setToken(token);
    //   })
    //   .catch(function(err: any) {
    //     console.log('Unable to get permission to notify.', err);
    //   });

    // this.registerPushListener();
  }

  setToken = (token: any) => {
    
  };

  pushNotification = (notification: any) => {
    console.log(notification);
    this.setState({
      notifications: this.state.notifications.concat(notification)
    });
  };

  public render() {
    return <Main />;
  }
}

export default App;
