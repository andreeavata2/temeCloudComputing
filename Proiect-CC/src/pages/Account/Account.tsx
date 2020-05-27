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
  typeOfProductF: string;
  categoryF: string;
  description: string;
  priceN: number;
  priceM: number;
  auctionF: boolean;
  searchText: string;
  productsKeys: any[];
}

class Account extends React.Component<
  IAppProps & WrappedComponentProps,
  IAppState
> {
  componentDidMount() {
    firebase.auth().onAuthStateChanged(this.handleAuthStateChanged);
    firebase
      .database()
      .ref("/products")
      .on("value", (snapshot) => {
        console.log("FireB ", snapshot);
        if (snapshot && snapshot.exists()) {
          console.log(snapshot.val());
          console.log(Object.values(snapshot.val()));
          this.setState({
            products: Object.values(snapshot.val()),
            productsKeys: Object.keys(snapshot.val()),
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
      typeOfProductF: "",
      categoryF: "",
      description: "some description",
      priceN: 0,
      priceM: 9999,
      auctionF: false,
      searchText: "",
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
    return messaging
      .requestPermission()
      .then(() => {
        return this.handleTokenRefresh();
      })
      .then(() => this.checkSubscription())
      .catch(function (err: any) {
        console.log("Unable to get permission to notify.", err);
      });
  };

  handleUnsubscribe = () => {
    messaging
      .getToken()
      .then((token: string) => messaging.deleteToken(token))
      .then(() =>
        firebase
          .database()
          .ref("/tokens")
          .orderByChild("uid")
          .equalTo(firebase.auth().currentUser!.uid)
          .once("value")
      )
      .then((payload: any) => {
        console.log(payload.val());
        const key = Object.keys(payload.val())[0];
        return firebase.database().ref("/tokens").child(key).remove();
      })
      .then(() => this.checkSubscription())
      .catch(() => console.log("unsubscribed failed successfully"));
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
      !title.toLowerCase().includes(searchText) &&
      !description.toLowerCase().includes(searchText)
    ) {
      return false;
    } else if (
      this.state.categoryF !== "" &&
      this.state.categoryF !== category
    ) {
      return false;
    } else if (
      parseInt(price, 10) < this.state.priceN ||
      parseInt(price, 10) > priceM
    ) {
      return false;
    } else if (
      this.state.typeOfProductF !== "" &&
      typeOfProdcut + "F" !== this.state.typeOfProductF
    ) {
      return false;
    }

    return true;
  };

  handleInputChange = (event: any) => {
    let name = event.target.name;
    let value = event.target.value;
    let id = event.target.id;
    if (name === "auctionF") {
      this.setState(({
        auction: !this.state.auctionF,
      } as unknown) as Pick<IAppState, keyof IAppState>);
    } else if (name === "typeOfProductF") {
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
      !this.props.loading && (
        <div className="wrapper account">
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
            <li className="nav-item">
              <Link to="/mybids" className="nav-link">
                <i className="fas fa-fw fa-tachometer-alt"></i>
                <span>My Bids</span>
              </Link>
            </li>
            <li className="nav-item active">
              <Link to="/account" className="nav-link">
                <i className="fas fa-fw fa-tachometer-alt"></i>
                <span>Produse</span>
              </Link>
            </li>
           
            <li className="nav-item ">
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
            <li className="nav-item ">
              <a
                className="nav-link"
                href="#"
                data-toggle="modal"
                data-target="#logoutModal3"
              >
                <i className="fas fa-fw fa-tachometer-alt"></i>
                <span>Send Message To All</span>
              </a>
            </li>

            <hr className="sidebar-divider" />
            <div className="sidebar-heading">Filters</div>
            <form
              className="user col col-md-12"
              style={{ background: "#ffffff6b" }}
            >
              <div className="row no-gutters align-items-center">
                <div className="col ml-3">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Tipul anuntului
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800"></div>
                </div>
              </div>
              <div className="form-group col-md-12">
                <div className="custom-control custom-radio mt-3">
                  <input
                    type="radio"
                    className="custom-control-input"
                    id="vanzareIDF"
                    name="typeOfProductF"
                    onChange={this.handleInputChange}
                    required
                    checked={this.state.typeOfProductF === "vanzareIDF"}
                  />
                  <label className="custom-control-label" htmlFor="vanzareIDF">
                    Vanzare
                  </label>
                </div>
                <div className="custom-control custom-radio">
                  <input
                    onChange={this.handleInputChange}
                    type="radio"
                    className="custom-control-input"
                    id="inchiriereIDF"
                    checked={this.state.typeOfProductF === "inchiriereIDF"}
                    name="typeOfProductF"
                    required
                  />
                  <label
                    className="custom-control-label"
                    htmlFor="inchiriereIDF"
                  >
                    Inchiriere
                  </label>
                </div>
                <div className="custom-control custom-radio">
                  <input
                    onChange={this.handleInputChange}
                    type="radio"
                    className="custom-control-input"
                    id="serviciuIDF"
                    name="typeOfProductF"
                    checked={this.state.typeOfProductF === "serviciuIDF"}
                  />
                  <label className="custom-control-label" htmlFor="serviciuIDF">
                    Serviciu
                  </label>
                </div>
              </div>

              <div className="row no-gutters align-items-center">
                <div className="col ml-3">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Categorie
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800"></div>
                </div>
              </div>
              <div className="form-group col-md-12">
                <select
                  value={this.state.categoryF}
                  name="categoryF"
                  id="categoryF"
                  onChange={this.handleInputChange}
                  className="form-control"
                >
                  <option value="">Toate</option>
                  <option value="Altele">Altele</option>
                  <option value="Telefoane">Telefoane</option>
                  <option value="Masini">Masini</option>
                  <option value="Apartamente">Apartamente</option>
                  <option value="Electronice">Electronice</option>
                </select>
              </div>

              <div className="row no-gutters align-items-center">
                <div className="col ml-3">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Pret Minim
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800"></div>
                </div>
              </div>
              <div className="form-group col-md-12">
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text">RON</span>
                  </div>
                  <input
                    onChange={this.handleInputChange}
                    type="number"
                    className="form-control"
                    aria-label="Amount (to the nearest dollar)"
                    name="priceN"
                    value={this.state.priceN}
                  />
                  <div className="input-group-append">
                    <span className="input-group-text">.00</span>
                  </div>
                </div>
              </div>
              <div className="row no-gutters align-items-center">
                <div className="col ml-3">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Pret Maxim
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800"></div>
                </div>
              </div>
              <div className="form-group col-md-12">
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text">RON</span>
                  </div>
                  <input
                    onChange={this.handleInputChange}
                    type="number"
                    className="form-control"
                    aria-label="Amount (to the nearest dollar)"
                    name="priceM"
                    value={this.state.priceM}
                  />
                  <div className="input-group-append">
                    <span className="input-group-text">.00</span>
                  </div>
                </div>
              </div>
              <div className="row no-gutters align-items-center">
                <div className="col ml-3">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Licitatie
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800"></div>
                </div>
              </div>
              <div className="form-group col-md-12">
                <div className="custom-control custom-switch mt-3">
                  <input
                    checked={this.state.auctionF}
                    onChange={this.handleInputChange}
                    type="checkbox"
                    name="auctionF"
                    id="auctionF"
                    className="custom-control-input"
                  />
                  <label className="custom-control-label" htmlFor="auction">
                    Se poate licita
                  </label>
                </div>
              </div>
            </form>

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
                <form className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                  <div className="input-group">
                    <input
                      type="text"
                      onChange={this.handleInputChange}
                      value={this.state.searchText}
                      name="searchText"
                      className="form-control bg-light border-0 small"
                      placeholder="Search for..."
                    />
                    <div className="input-group-append">
                      <button className="btn btn-primary" type="button">
                        <i className="fas fa-search fa-sm"></i>
                      </button>
                    </div>
                  </div>
                </form>
                <button
                  id="sidebarToggleTop"
                  className="btn btn-link d-md-none rounded-circle mr-3"
                >
                  <i className="fa fa-bars"></i>
                </button>

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

                      <span className="badge badge-danger badge-counter">
                        1
                      </span>
                    </a>

                    <div
                      className="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
                      aria-labelledby="messagesDropdown"
                    >
                      <h6 className="dropdown-header">Message Center</h6>
                      <a
                        className="dropdown-item d-flex align-items-center"
                        href="#1"
                      >
                        <div className="dropdown-list-image mr-3">
                          <img
                            className="rounded-circle"
                            src="https://source.unsplash.com/fn_BT9fwg_E/60x60"
                            alt=""
                          />
                          <div className="status-indicator bg-success"></div>
                        </div>
                        <div className="font-weight-bold">
                          <div className="text-truncate">
                            Hi there! I am wondering if you can help me with a
                            problem I've been having.
                          </div>
                          <div className="small text-gray-500">
                            Emily Fowler · 58m
                          </div>
                        </div>
                      </a>

                      <a
                        className="dropdown-item text-center small text-gray-500"
                        href="#1"
                      >
                        Read More Messages
                      </a>
                    </div>
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
                <div className="d-sm-flex align-items-center justify-content-between mb-4">
                  <h1 className="h3 mb-0 text-gray-800">Anunti</h1>
                  {this.state.isSubscribe ? (
                    <a
                      href="#1"
                      onClick={this.handleUnsubscribe}
                      className="d-none d-sm-inline-block btn btn-sm btn-danger shadow-sm"
                    >
                      <i className="fas fa-minus fa-sm text-white-50"></i>{" "}
                      Unsubscribe
                    </a>
                  ) : (
                    <a
                      href="#1"
                      onClick={this.handleSubscribe}
                      className="d-none d-sm-inline-block btn btn-sm btn-success shadow-sm"
                    >
                      <i className="fas fa-plus fa-sm text-white-50"></i>{" "}
                      Subscribe
                    </a>
                  )}
                </div>
                <div className="row">
                  {this.state.isFetching === false ? (
                    this.state.products.map((product: any, index: any) => {
                      if (this.checkFilters(product) === true)
                        return (
                          <ViewProductCard
                            {...product}
                            index={this.state.productsKeys[index]}
                          />
                        );
                    })
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
          {/* Start Modal */}
          
          <div
            className="modal fade"
            id="logoutModal3"
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
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
                
                  <div className="col-xl-12 col-md-12 mb-4">
                    <div className="card border-left-primary shadow h-100 py-2">
                      <div className="card-body">
                        <div className="row no-gutters align-items-center">
                          <div className="col mr-2">
                            <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                              Send Message To All That Have Subscribed
                            </div>
                            <div className="h5 mb-0 font-weight-bold text-gray-800"></div>
                          </div>
                        </div>
                        <div className="row ">
                          <div className="col mr-12 ">
                            <form
                              className="user"
                              onSubmit={this.handleSubmitMessage}
                            >
                              <div className="form-group">
                                <input
                                  type="text"
                                  value={this.state.messageToSend}
                                  name="messageToSend"
                                  className="form-control form-control-user"
                                  onChange={this.handleInputChange}
                                  id="inputPassword2"
                                  placeholder="Message"
                                />
                              </div>
                              <button
                                type="submit"
                                className="btn btn-primary btn-user btn-block"
                              >
                                Send Message
                              </button>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                 
                </div>
               
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    type="button"
                    data-dismiss="modal"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* End Modal */}
        </div>
      )
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
    })(Account)
  )
);
