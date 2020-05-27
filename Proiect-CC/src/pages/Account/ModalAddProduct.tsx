import React from "react";
import withFirebaseAuth, {
  WrappedComponentProps,
} from "react-with-firebase-auth";
import firebaseApp from "../../Utils/configFirebase";
import * as firebase from "firebase";
import "./account.style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import { messaging } from "../../init-fcm";
import ShowPost from "./ShowPost";
import FormProduct from "./FormProduct";
import axios from "axios";
// const firebaseDB = firebase.database();

export interface IAppProps {
  user?: WrappedComponentProps;
  signOut?: WrappedComponentProps;
  history?: any;
  loading?: WrappedComponentProps;
}

export interface IAppState {
  isSubscribe: boolean;
  messageToSend: string;
}

class ModalAddProduct extends React.Component {
  render() {
    return (
      <>
        {/* Start Modal */}
        <div
          className="modal fade bd-example-modal-lg"
          id="logoutModal2"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content " id="backgroundTransparent">
              <div className="modal-body">
                <FormProduct />
              </div>
            </div>
          </div>
        </div>
        {/* End Modal */}
      </>
    );
  }
}

const firebaseAppAuth = firebaseApp.auth();

const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};

export default ModalAddProduct;
