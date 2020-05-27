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
  products: any;
  typeOfProduct: string;
  category: string;
  description: string;
  price: number;
  priceM: number;
  auction: boolean;
  searchText: string;
  mainPhoto: string;
  currentBid: number;
}

class ViewFullProduct extends React.Component<
  IAppProps & WrappedComponentProps,
  IAppState
> {
  componentDidMount() {
    firebase.auth().onAuthStateChanged(this.handleAuthStateChanged);
    firebase
      .database()
      .ref(`/products/${window.location.pathname.substr(6)}`)
      .on("value", (snapshot) => {
        console.log("FireB ", snapshot.key);
        if (snapshot && snapshot.exists()) {
          let vall = snapshot.val();
          this.setState({
            products: snapshot.val(),
            mainPhoto: vall.filesToUploadURL[0] || "",
            currentBid: parseInt(vall.price, 10) + 1,
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
      products: {},
      typeOfProduct: "",
      category: "",
      description: "some description",
      price: 0,
      priceM: 9999,
      auction: false,
      searchText: "",
      mainPhoto: "",
      currentBid: 0,
    };
  }

  handleAuthStateChanged = (user: any) => {
    if (user) {
      this.checkSubscription();
    }
  };

  routeChange() {
    let path = `/`;
    this.props.history.push(path);
  }
  handleLogout = (event: any) => {
    this.props.signOut();
    this.routeChange();
  };

  handleSubscribe = (event: any) => {
    const data = { auction: true };
    // update the fields on the child
    firebase
      .database()
      .ref(`/products/${window.location.pathname.substr(6)}`)
      .update(data);
  };

  handleUnsubscribe = () => {
    const data = { auction: false };
    // update the fields on the child
    firebase
      .database()
      .ref(`/products/${window.location.pathname.substr(6)}`)
      .update(data);
  };

  toggleDisableProduct = () => {
    const data = { available: !this.state.products.available || false };

    if (data.available === false) {
      if (this.state.products.bids) {
        let uidWinner = this.state.products.bids[
          this.state.products.bids.length - 1
        ].uid;
        let uidProduct = window.location.pathname.substr(6);
        firebase
          .database()
          .ref("/bids")
          .on("value", (snapshot) => {
            if (snapshot && snapshot.exists()) {
              let bids = Object.values(snapshot.val());
              let bidsKeys = Object.keys(snapshot.val());
              bids.map((bid: any, index: any) => {
                if (bid.uid === uidWinner && bid.uidProduct === uidProduct) {
                  // match
                  let idOfBids = bidsKeys[index];
                  const data = { status: "winner" };
                  // update the fields on the child
                  firebase.database().ref(`/bids/${idOfBids}`).update(data);
                }
              });
            }
          });
      }
    }
    // update the fields on the child
    firebase
      .database()
      .ref(`/products/${window.location.pathname.substr(6)}`)
      .update(data);
  };
  handleTokenRefresh = () => {
    return messaging.getToken().then((token: string) => {
      console.log(token);

      firebase.database().ref("/tokens").push({
        token,
        uid: firebase.auth().currentUser!.uid,
      });
    });
  };

  checkSubscription = () => {
    firebase
      .database()
      .ref("/tokens")
      .orderByChild("uid")
      .equalTo(firebase.auth().currentUser!.uid)
      .once("value")
      .then((payload: any) => {
        if (payload.val()) {
          this.setState({
            isSubscribe: true,
          });
        } else {
          this.setState({
            isSubscribe: false,
          });
        }
      });
  };

  addBid = () => {
    if (this.state.products.bids) {
      let details = {
        uid: firebase.auth().currentUser!.uid,
        name: firebase.auth().currentUser!.displayName,
        currentBid: this.state.currentBid,
      };
      let bids = this.state.products.bids;
      bids.push(details);
      const data = { bids: bids };
      firebase
        .database()
        .ref(`/products/${window.location.pathname.substr(6)}`)
        .update(data);
      firebase
        .database()
        .ref("/bids")
        .push({
          name: firebase.auth().currentUser?.displayName,
          productName: this.state.products.title,
          uid: firebase.auth().currentUser!.uid,
          uidProduct: window.location.pathname.substr(6),
          currentBid: this.state.currentBid,
        })
        .then(() => {
          return this.setState({
            messageToSend: "",
          });
        });
    } else {
      let details = {
        uid: firebase.auth().currentUser!.uid,
        name: firebase.auth().currentUser!.displayName,
        currentBid: this.state.currentBid,
      };
      const data = { bids: [details] };
      // update the fields on the child
      firebase
        .database()
        .ref(`/products/${window.location.pathname.substr(6)}`)
        .update(data);
      firebase
        .database()
        .ref("/bids")
        .push({
          name: firebase.auth().currentUser?.displayName,
          productName: this.state.products.title,
          uid: firebase.auth().currentUser!.uid,
          uidProduct: window.location.pathname.substr(6),
          currentBid: this.state.currentBid,
        })
        .then(() => {
          return this.setState({
            messageToSend: "",
          });
        });
    }
  };

  checkFilters = (product: any) => {
    const { priceM, searchText } = this.state;
    const {
      auction,
      category,
      title,
      description,
      price,
      typeOfProdcut,
    } = product;

    if (
      parseInt(price, 10) < this.state.price ||
      parseInt(price, 10) > priceM
    ) {
      return false;
    } else if (
      !title.toLowerCase().includes(searchText) &&
      !description.toLowerCase().includes(searchText)
    ) {
      console.log(title, searchText, description);
      return false;
    } else if (this.state.category !== "" && this.state.category !== category)
      return false;
    else if (
      this.state.typeOfProduct !== "" &&
      typeOfProdcut !== this.state.typeOfProduct
    )
      return false;

    return true;
  };

  handleInputChange = (event: any) => {
    let name = event.target.name;
    let value = event.target.value;
    let id = event.target.id;
    if (name === "auction") {
      this.setState(({
        auction: !this.state.auction,
      } as unknown) as Pick<IAppState, keyof IAppState>);
    } else if (name === "typeOfProduct") {
      this.setState(({
        [name]: event.target.id,
      } as unknown) as Pick<IAppState, keyof IAppState>);
    } else
      this.setState(({
        [name]: value,
      } as unknown) as Pick<IAppState, keyof IAppState>);
  };

  handleSubmitMessage = (event: any) => {
    event.preventDefault();

    firebase
      .database()
      .ref("/notifications")
      .push({
        user: firebase.auth().currentUser?.displayName,
        message: this.state.messageToSend,
        image: firebase.auth().currentUser?.photoURL,
        link: window.location.href,
      })
      .then(() => {
        return this.setState({
          messageToSend: "",
        });
      });
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
                    {this.state.products.title}
                  </li>
                </ol>
              </nav>
              <div className="row">
                {this.state.isFetching === false ? (
                  <div className="card">
                    <div className="container-fliud">
                      <div className="wrapper row">
                        <div className="preview col-md-6">
                          <div className="preview-pic tab-content">
                            <div className="tab-pane active" id="pic-1">
                              <img src={this.state.mainPhoto} />
                            </div>
                            <div className="tab-pane" id="pic-2">
                              <img src={this.state.mainPhoto} />
                            </div>
                            <div className="tab-pane" id="pic-3">
                              <img src={this.state.mainPhoto} />
                            </div>
                            <div className="tab-pane" id="pic-4">
                              <img src={this.state.mainPhoto} />
                            </div>
                            <div className="tab-pane" id="pic-5">
                              <img src="http://placekitten.com/400/252" />
                            </div>
                          </div>
                          <ul className="preview-thumbnail nav nav-tabs">
                            {this.state.products.filesToUploadURL.map(
                              (img: any) => {
                                return (
                                  <li className="active">
                                    <a
                                      data-target="#pic-1"
                                      data-toggle="tab"
                                      onClick={() =>
                                        this.setState({ mainPhoto: img })
                                      }
                                    >
                                      <img src={img} />
                                    </a>
                                  </li>
                                );
                              }
                            )}
                          </ul>
                        </div>
                        <div className="details col-md-6">
                          <h3 className="product-title">
                            {this.state.products && this.state.products.title}
                          </h3>
                          <div className="rating">
                            <div className="stars">
                              <span className="fa fa-star checked"></span>
                              <span className="fa fa-star checked"></span>
                              <span className="fa fa-star checked"></span>
                              <span className="fa fa-star"></span>
                              <span className="fa fa-star"></span>
                            </div>
                            <span className="review-no">41 reviews</span>
                          </div>
                          <p className="product-description">
                            {this.state.products.description}
                          </p>
                          <h4 className="price">
                            Pret Curent:{" "}
                            <span>
                              RON
                              {(this.state.products.bids &&
                                this.state.products.bids[
                                  this.state.products.bids.length - 1
                                ].currentBid) ||
                                this.state.products.price}
                            </span>
                          </h4>
                          <ul className="list-group">
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                              Categorie
                              <span className="badge badge-info p-2">
                                {this.state.products.category}
                              </span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                              Persoana de contact
                              <span className="badge badge-primary p-2">
                                {this.state.products.contactPerson}
                              </span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                              Locatie
                              <span className="badge badge-info p-2">
                                {this.state.products.city}
                              </span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                              Email
                              <span className="badge badge-primary p-2">
                                {this.state.products.email}
                              </span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                              Telefon
                              <span className="badge badge-info p-2">
                                {this.state.products.phone}
                              </span>
                            </li>
                          </ul>
                          <div className="action">
                            {this.state.products.uid ===
                              firebase.auth().currentUser?.uid &&
                            this.state.products.available ? (
                              <a
                                href="#1"
                                onClick={this.toggleDisableProduct}
                                className="d-none d-sm-inline-block btn btn-sm btn-danger shadow-sm m-1"
                              >
                                <i className="fas fa-minus fa-sm text-white-50"></i>{" "}
                                Close Product
                              </a>
                            ) : (
                              this.state.products.uid ===
                                firebase.auth().currentUser?.uid && (
                                <a
                                  href="#1"
                                  onClick={this.toggleDisableProduct}
                                  className="d-none d-sm-inline-block btn btn-sm btn-success shadow-sm"
                                >
                                  <i className="fas fa-plus fa-sm text-white-50"></i>{" "}
                                  Open Product
                                </a>
                              )
                            )}
                            {this.state.products.uid !==
                              firebase.auth().currentUser?.uid &&
                            this.state.products.auction ? (
                              <>
                                <div className="row no-gutters align-items-center">
                                  <div className="col ">
                                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                      Introdu suma dorita | Suma minima:
                                      {parseInt(
                                        (this.state.products.bids &&
                                          this.state.products.bids[
                                            this.state.products.bids.length - 1
                                          ].currentBid) ||
                                          this.state.products.price
                                      ) + 1}
                                    </div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800"></div>
                                  </div>
                                </div>
                                {this.state.products.bids &&
                                this.state.products.bids[
                                  this.state.products.bids.length - 1
                                ].uid === firebase.auth().currentUser!.uid ? (
                                  <h3>You have the highest bid for now</h3>
                                ) : (
                                  <>
                                    <div className="form-group col-md-6">
                                      <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                          <span className="input-group-text">
                                            RON
                                          </span>
                                        </div>
                                        <input
                                          type="number"
                                          className="form-control"
                                          aria-label="Amount (to the nearest dollar)"
                                          name="currentBid"
                                          value={this.state.currentBid}
                                          onChange={(e: any) =>
                                            this.setState({
                                              currentBid: e.target.value,
                                            })
                                          }
                                          min={
                                            parseInt(
                                              this.state.products.price
                                            ) + 1
                                          }
                                          placeholder={`Minim ${
                                            parseInt(
                                              this.state.products.price
                                            ) + 1
                                          }`}
                                        />
                                        <div className="input-group-append">
                                          <span className="input-group-text">
                                            .00
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="form-group col-md-6">
                                      <button
                                        onClick={this.addBid}
                                        className="add-to-cart btn btn-default"
                                        type="button"
                                      >
                                        Add Bid
                                      </button>
                                    </div>
                                  </>
                                )}
                              </>
                            ) : (
                              <h1>You can't bid on this product</h1>
                            )}

                            {this.state.products.uid ===
                            firebase.auth().currentUser?.uid ? (
                              this.state.products.available &&
                              this.state.products.auction ? (
                                <a
                                  href="#1"
                                  onClick={this.handleUnsubscribe}
                                  className="d-none d-sm-inline-block btn btn-sm btn-danger shadow-sm m-1"
                                >
                                  <i className="fas fa-minus fa-sm text-white-50"></i>{" "}
                                  Close Auction
                                </a>
                              ) : (
                                this.state.products.available && (
                                  <a
                                    href="#1"
                                    onClick={this.handleSubscribe}
                                    className="d-none d-sm-inline-block btn btn-sm btn-success shadow-sm"
                                  >
                                    <i className="fas fa-plus fa-sm text-white-50"></i>{" "}
                                    Open Auction
                                  </a>
                                )
                              )
                            ) : null}

                            {/* {this.state.products.uid ===
                              firebase.auth().currentUser?.uid &&
                            this.state.products.available &&
                            this.state.products.auction ? (
                              <a
                                href="#1"
                                onClick={this.handleUnsubscribe}
                                className="d-none d-sm-inline-block btn btn-sm btn-danger shadow-sm m-1"
                              >
                                <i className="fas fa-minus fa-sm text-white-50"></i>{" "}
                                Close Auction
                              </a>
                            ) : (
                              this.state.products.available && (
                                <a
                                  href="#1"
                                  onClick={this.handleSubscribe}
                                  className="d-none d-sm-inline-block btn btn-sm btn-success shadow-sm"
                                >
                                  <i className="fas fa-plus fa-sm text-white-50"></i>{" "}
                                  Open Auction
                                </a>
                              )
                            )} */}
                            {/* <button
                              className="add-to-cart btn btn-default"
                              type="button"
                            >
                              add to cart
                            </button> */}
                          </div>
                        </div>
                      </div>
                    </div>
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
    })(ViewFullProduct)
  )
);
