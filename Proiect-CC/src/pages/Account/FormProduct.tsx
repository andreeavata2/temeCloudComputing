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
import MultipleImagesUpload from "./MultipleImagesUpload";
import axios from "axios";
// const firebaseDB = firebase.database();

export interface IAppProps {
  user?: WrappedComponentProps;
  signOut?: WrappedComponentProps;
  history?: any;
  loading?: WrappedComponentProps;
  handleImgChange: any;
}

export interface IAppState {
  title: string;
  typeOfProdcut: string;
  category: string;
  description: string;
  price: number;
  auction: boolean;
  city: string;
  contactPerson: string;
  email: string;
  phone: string;
  images: [];
  filesToUpload: [];
  filesToUploadURL:any[];
}

class FormProduct extends React.Component<
  IAppProps & WrappedComponentProps,
  IAppState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      title: "Galaxy S6",
      typeOfProdcut: "serviciuID",
      category: "",
      description: "some description",
      price: 34,
      auction: false,
      city: "Iasi",
      contactPerson: "Dumitru",
      email: "gliga_dumitru@yahoo.com",
      phone: "0759149338",
      images: [],
      filesToUpload: [],
      filesToUploadURL:[]
    };
  }

  handleInputChange = (event: any) => {
    let name = event.target.name;
    let value = event.target.value;
    let id = event.target.id;
    if (name === "auction") {
      this.setState(({
        auction: !this.state.auction,
      } as unknown) as Pick<IAppState, keyof IAppState>);
    } else if (name === "typeOfProdcut") {
      this.setState(({
        [name]: event.target.id,
      } as unknown) as Pick<IAppState, keyof IAppState>);
    } else
      this.setState(({
        [name]: value,
      } as unknown) as Pick<IAppState, keyof IAppState>);
  };

  handleImgChange = (files: any) => {
    this.setState({
      filesToUpload: files,
    });
    this.submitFiles(files);
  };

  uploadFile = async (i: any, file: any) => {
    const formData = new FormData();
    formData.append("file", file);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    let answer = await axios
      .post("http://localhost:9001/uploads", formData, config)
      .then((r) => r.data.url)
      .catch((err) => null);
    return answer;
  };

  submitFiles = async (files: any) => {
    alert('1')
    const formData = new FormData();
    let arrayOfImagesPromise: any[] = [];
    let arrayOfImages: any[] = [];
    files.forEach((file: any, i: any) => {
      arrayOfImagesPromise.push(this.uploadFile(i, file));
    });
    console.log(arrayOfImagesPromise)
    arrayOfImagesPromise.map(async (img: any) => {
     await img.then((val: any) => {
       console.log('val:',val)
       arrayOfImages.push(val)
     });
    });
    this.setState({
      filesToUploadURL : arrayOfImages
    })
    return arrayOfImages;
  };

  handleSubmit = (e: any) => {
    e.preventDefault();
    
    firebase
      .database()
      .ref("/products")
      .push({
        user: firebase.auth().currentUser?.displayName,
        uid:firebase.auth().currentUser?.uid, available:true,
        image: firebase.auth().currentUser?.photoURL,
        ...this.state
      })
      .then(() => {
        alert('Anunt adaugat cu success')
      });
  };
  render() {
    const { user } = this.props;
    return (
      !this.props.loading && (
        <div className="container-fluid p0">
          <div className="row">
            <div className="col-xl-12 col-md-12 mb-4">
              <div className="card border-left-primary shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-mb font-weight-bold text-primary text-uppercase mb-1">
                        Adauga Anunt
                        <button
                          className="close"
                          type="button"
                          data-dismiss="modal"
                          aria-label="Close"
                        >
                          <span aria-hidden="true">×</span>
                        </button>
                      </div>

                      <div className="h5 mb-0 font-weight-bold text-gray-800"></div>
                    </div>
                  </div>

                  <div className="row ">
                    <div className="col mr-12 ">
                      <form onSubmit={this.handleSubmit} className="user">
                        <div className="row no-gutters align-items-center">
                          <div className="col ml-3">
                            <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                              Title
                            </div>
                            <div className="h5 mb-0 font-weight-bold text-gray-800"></div>
                          </div>
                        </div>

                        <div className="form-group col-md-6">
                          <input
                            type="text"
                            name="title"
                            className="form-control form-control-user"
                            id="title"
                            value={this.state.title}
                            placeholder="Title"
                            onChange={this.handleInputChange}
                            required
                          />
                        </div>

                        <div className="row no-gutters align-items-center">
                          <div className="col ml-3">
                            <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                              Tipul anuntului
                            </div>
                            <div className="h5 mb-0 font-weight-bold text-gray-800"></div>
                          </div>
                        </div>
                        <div className="form-group col-md-6">
                          <div className="custom-control custom-radio mt-3">
                            <input
                              type="radio"
                              className="custom-control-input"
                              id="vanzareID"
                              name="typeOfProdcut"
                              onChange={this.handleInputChange}
                              required
                              checked={this.state.typeOfProdcut === "vanzareID"}
                            />
                            <label
                              className="custom-control-label"
                              htmlFor="vanzareID"
                            >
                              Vanzare
                            </label>
                          </div>
                          <div className="custom-control custom-radio">
                            <input
                              onChange={this.handleInputChange}
                              type="radio"
                              className="custom-control-input"
                              id="inchiriereID"
                              checked={
                                this.state.typeOfProdcut === "inchiriereID"
                              }
                              name="typeOfProdcut"
                              required
                            />
                            <label
                              className="custom-control-label"
                              htmlFor="inchiriereID"
                            >
                              Inchiriere
                            </label>
                          </div>
                          <div className="custom-control custom-radio">
                            <input
                              onChange={this.handleInputChange}
                              type="radio"
                              className="custom-control-input"
                              id="serviciuID"
                              name="typeOfProdcut"
                              checked={
                                this.state.typeOfProdcut === "serviciuID"
                              }
                            />
                            <label
                              className="custom-control-label"
                              htmlFor="serviciuID"
                            >
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
                        <div className="form-group col-md-6">
                          <select
                            value={this.state.category}
                            name="category"
                            id="category"
                            onChange={this.handleInputChange}
                            className="form-control"
                          >
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
                              Descriere
                            </div>
                            <div className="h5 mb-0 font-weight-bold text-gray-800"></div>
                          </div>
                        </div>
                        <div className="form-group col-md-6">
                          <textarea
                            className="form-control"
                            placeholder="Descriere Produs"
                            id="description"
                            name="description"
                            value={this.state.description}
                            onChange={this.handleInputChange}
                            rows={3}
                          ></textarea>
                        </div>
                        <div className="row no-gutters align-items-center">
                          <div className="col ml-3">
                            <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                              Pret
                            </div>
                            <div className="h5 mb-0 font-weight-bold text-gray-800"></div>
                          </div>
                        </div>
                        <div className="form-group col-md-6">
                          <div className="input-group mb-3">
                            <div className="input-group-prepend">
                              <span className="input-group-text">RON</span>
                            </div>
                            <input
                              onChange={this.handleInputChange}
                              type="number"
                              className="form-control"
                              aria-label="Amount (to the nearest dollar)"
                              name="price"
                              value={this.state.price}
                            />
                            <div className="input-group-append">
                              <span className="input-group-text">.00</span>
                            </div>
                          </div>
                        </div>

                        <MultipleImagesUpload
                          handleChange={this.handleImgChange}
                        />
                        <div className="row no-gutters align-items-center">
                          <div className="col ml-3">
                            <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                              Licitatie
                            </div>
                            <div className="h5 mb-0 font-weight-bold text-gray-800"></div>
                          </div>
                        </div>
                        <div className="form-group col-md-6">
                          <div className="custom-control custom-switch mt-1">
                            <input
                              checked={this.state.auction}
                              onChange={this.handleInputChange}
                              type="checkbox"
                              name="auction"
                              id="auction"
                              className="custom-control-input"
                            />
                            <label
                              className="custom-control-label"
                              htmlFor="auction"
                            >
                              Accept sa se liciteze asupra pretului
                            </label>
                          </div>
                        </div>

                        <div className="row no-gutters align-items-center">
                          <div className="col ml-3">
                            <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                              Orasul sau Localitatea
                            </div>
                            <div className="h5 mb-0 font-weight-bold text-gray-800"></div>
                          </div>
                        </div>

                        <div className="form-group col-md-6">
                          <input
                            onChange={this.handleInputChange}
                            type="text"
                            name="city"
                            className="form-control form-control-user"
                            id="city"
                            value={this.state.city}
                            placeholder="Iasi, Judetul Iasi"
                            required
                          />
                        </div>
                        <div className="row no-gutters align-items-center">
                          <div className="col ml-3">
                            <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                              Persoana de contact
                            </div>
                            <div className="h5 mb-0 font-weight-bold text-gray-800"></div>
                          </div>
                        </div>

                        <div className="form-group col-md-6">
                          <input
                            onChange={this.handleInputChange}
                            type="text"
                            name="contactPerson"
                            className="form-control form-control-user"
                            id="contactPerson"
                            value={this.state.contactPerson}
                            placeholder="Dumitru"
                            required
                          />
                        </div>
                        <div className="row no-gutters align-items-center">
                          <div className="col ml-3">
                            <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                              Adresa de email
                            </div>
                            <div className="h5 mb-0 font-weight-bold text-gray-800"></div>
                          </div>
                        </div>

                        <div className="form-group col-md-6">
                          <input
                            onChange={this.handleInputChange}
                            type="email"
                            name="email"
                            className="form-control form-control-user"
                            id="email"
                            value={this.state.email}
                            placeholder="gliga_dumitru@yahoo.com"
                            required
                          />
                        </div>
                        <div className="row no-gutters align-items-center">
                          <div className="col ml-3">
                            <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                              Numar de telefon
                            </div>
                            <div className="h5 mb-0 font-weight-bold text-gray-800"></div>
                          </div>
                        </div>

                        <div className="form-group col-md-6">
                          <input
                            onChange={this.handleInputChange}
                            type="number"
                            value={this.state.phone}
                            name="phone"
                            className="form-control form-control-user"
                            id="phone"
                            placeholder="0759149338"
                            required
                          />
                        </div>
                        <div className="form-group col-md-6">
                          <button
                            className="btn btn-danger primary  col-md-4"
                            type="button"
                            data-dismiss="modal"
                          >
                            Cancel
                          </button>
                          <button
                            className="btn btn-primary  col-md-8"
                            type="submit"
                            data-dismiss="modal"
                            onClick={this.handleSubmit}
                          >
                            Adauga
                          </button>
                        </div>
                      </form>
                    
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
    })(FormProduct)
  )
);
