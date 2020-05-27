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
import ModalAddProduct from "./ModalAddProduct";
// const firebaseDB = firebase.database();
import ViewProductCard from "./ViewProductCard";
import "./ViewFullProduct.style.scss";
export interface IAppProps {
  user?: WrappedComponentProps;
  signOut?: WrappedComponentProps;
  history?: any;
  loading?: WrappedComponentProps;
}

export interface IAppState {
  isSubscribe: boolean;
  messageToSend: string;
  isFetching: boolean;
  products: any[];
  typeOfProduct: string;
  category: string;
  description: string;
  price: number;
  priceM: number;
  auction: boolean;
  searchText: string;
  mainPhoto: string;
  currentBid: number;
  productsKeys: any;
  bids: any[];
  bidsKeys: any;
}

class MyBids extends React.Component<
  IAppProps & WrappedComponentProps,
  IAppState
> {
  componentDidMount() {
    firebase
      .database()
      .ref("/products")
      .on("value", (snapshot) => {
        if (snapshot && snapshot.exists()) {
          this.setState({
            products: Object.values(snapshot.val()),
            productsKeys: Object.keys(snapshot.val()),
            isFetching: false,
          });
        }
      });
    firebase
      .database()
      .ref("/bids")
      .on("value", (snapshot) => {
        if (snapshot && snapshot.exists()) {
          this.setState({
            bids: Object.values(snapshot.val()),
            bidsKeys: Object.keys(snapshot.val()),
            isFetching: false,
          });
        }
      });
  }

  constructor(props: any) {
    super(props);
    this.state = {
      isSubscribe: false,
      messageToSend: "",
      isFetching: true,
      products: [],
      productsKeys: [],
      typeOfProduct: "",
      category: "",
      description: "some description",
      price: 0,
      priceM: 9999,
      auction: false,
      searchText: "",
      mainPhoto: "",
      currentBid: 0,
      bids: [],
      bidsKeys: [],
    };
  }

  routeChange() {
    let path = `/`;
    this.props.history.push(path);
  }
  handleLogout = (event: any) => {
    this.props.signOut();
    this.routeChange();
  };

  render() {
    const { user } = this.props;
    return (
      <div className="wrapper account" id="viewProductPage">
        <ul
          className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
          id="accordionSidebar"
        >
          <Link
            to="/"
            className="sidebar-brand d-flex align-items-center justify-content-center"
          >
            <i className="fas fa-infinity"></i> Infinite Loop
          </Link>
          <hr className="sidebar-divider my-0" />
          <li className="nav-item active">
            <Link to="/account" className="nav-link">
              <i className="fas fa-fw fa-tachometer-alt"></i>
              <span>Produse</span>
            </Link>
          </li>
          <li className="nav-item active">
            <a
              className="nav-link"
              href="#"
              data-toggle="modal"
              data-target="#logoutModal2"
            >
              <i className="fas fa-fw fa-tachometer-alt"></i>
              <span>Add Product</span>
            </a>
          </li>

          <hr className="sidebar-divider" />
          <div className="sidebar-heading">Options</div>

          <li className="nav-item">
            <a
              className="nav-link collapsed"
              href="#2"
              data-toggle="collapse"
              data-target="#collapsePages"
              aria-expanded="true"
              aria-controls="collapsePages"
            >
              <i className="fas fa-fw fa-folder"></i>
              <span>Pages</span>
            </a>
            <div
              id="collapsePages"
              className="collapse"
              aria-labelledby="headingPages"
              data-parent="#accordionSidebar"
            >
              <div className="bg-white py-2 collapse-inner rounded">
                <h6 className="collapse-header">Login Screens:</h6>
                <Link className="collapse-item" to="/">
                  Home
                </Link>
                <Link className="collapse-item" to="/#whatwedo">
                  What We Do
                </Link>
                <Link className="collapse-item" to="/#testimonials">
                  Testimonials
                </Link>
                <Link className="collapse-item" to="/#gallery">
                  Gallery
                </Link>
                <Link className="collapse-item" to="/#contact">
                  Contact
                </Link>
              </div>
            </div>
          </li>

          <hr className="sidebar-divider d-none d-md-block" />

          <div className="text-center d-none d-md-inline">
            <button
              className="rounded-circle border-0"
              id="sidebarToggle"
            ></button>
          </div>
        </ul>
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content" style={{ minHeight: "100%" }}>
            <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item dropdown no-arrow mx-1">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#2"
                    id="messagesDropdown"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <i className="fas fa-envelope fa-fw"></i>

                    <span className="badge badge-danger badge-counter">1</span>
                  </a>
                </li>

                <div className="topbar-divider d-none d-sm-block"></div>

                <li className="nav-item dropdown no-arrow">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#2"
                    id="userDropdown"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <span className="mr-2 d-none d-lg-inline text-gray-600 small">
                      {user && user.displayName}
                    </span>
                    {user && (
                      <img
                        className="img-profile rounded-circle"
                        src={(user && user.photoURL) || ""}
                        alt="asd"
                      ></img>
                    )}
                  </a>

                  <div
                    className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                    aria-labelledby="userDropdown"
                  >
                    <a className="dropdown-item" href="#1">
                      <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                      Profile
                    </a>
                    <a className="dropdown-item" href="#1">
                      <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                      Settings
                    </a>
                    <a className="dropdown-item" href="#1">
                      <i className="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
                      Activity Log
                    </a>
                    <div className="dropdown-divider"></div>
                    <a
                      className="dropdown-item"
                      href="#1"
                      data-toggle="modal"
                      data-target="#logoutModal"
                    >
                      <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                      Logout
                    </a>
                  </div>
                </li>
              </ul>
            </nav>

            <div className="container-fluid">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/account">Products</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    My Bids
                  </li>
                </ol>
              </nav>
              <div className="row">
                {this.state.isFetching === false ? (
                  <div className="form-group col-md-12">
                    <table className="table table-hover col-md-12">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Name</th>
                          <th scope="col">Vezi</th>
                          <th scope="col">BID</th>
                          <th scope="col">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.bids.map((bid: any, index: any) => {
                          if (bid.uid === firebase.auth().currentUser!.uid)
                            return (
                              <tr>
                                <th scope="row">{index + 1}</th>
                                <td>{bid.productName}</td>
                                <td><Link to={`/view/${bid.uidProduct}`}>Vezi</Link></td>
                                <td>{bid.currentBid}</td>
                                <td>{bid.status || "In progress"} </td>
                              </tr>
                            );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div
                    className="spinner-grow"
                    style={{ width: "3rem", height: "3rem" }}
                    role="status"
                  >
                    <span className="sr-only">Loading...</span>
                  </div>
                )}
              </div>
              <div className="row"></div>
            </div>
          </div>
        </div>
        <ModalAddProduct />
        {/* Start Modal */}
        <div
          className="modal fade"
          id="logoutModal"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Ready to Leave?
                </h5>
                <button
                  className="close"
                  type="button"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                Select "Logout" below if you are ready to end your current
                session.
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  type="button"
                  data-dismiss="modal"
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  type="button"
                  data-dismiss="modal"
                  onClick={this.handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* End Modal */}
      </div>
    );
  }
}

const firebaseAppAuth = firebaseApp.auth();

const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};

export default withRouter(
  connect()(
    withFirebaseAuth({
      providers,
      firebaseAppAuth,
    })(MyBids)
  )
);
