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
import axios from "axios";
// const firebaseDB = firebase.database();

export interface IAppProps {
  handleChange: any;
}

export interface IAppState {
  file: any;
}

class MultipleImagesUpload extends React.Component<IAppProps, IAppState> {
  fileObj: any[] = [];
  fileArray: any[] = [];
  constructor(props: any) {
    super(props);
    this.state = {
      file: [null],
    };
  }

  uploadFile = (i: any, file: any) => {
    const formData = new FormData();
    formData.append("file", file);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    axios
      .post("http://localhost:9001/uploads", formData, config)
      .then((r) => console.log(r.data.url))
      .catch((err) => console.log(err));
  };

  submitFiles = (files: any) => {
    const formData = new FormData();
    files.forEach((file: any, i: any) => {
      this.uploadFile(i, file);
    });
  };

  uploadMultipleFiles = (e: any) => {
    e.preventDefault();
    const files = Array.from(e.target.files);
    // this.submitFiles(files);

    let result = e.target.files;
    this.fileObj.push(result);
    for (let i = 0; i < this.fileObj[0].length; i++) {
      this.fileArray.push(URL.createObjectURL(this.fileObj[0][i]));
    }
    this.setState({ file: this.fileArray });
    this.props.handleChange(files);
  };

  uploadFiles = (e: any) => {
    e.preventDefault();
    console.log(this.state.file);
  };

  render() {
    console.log(this.props);
    return (
      <>
        <div className="row no-gutters align-items-center">
          <div className="col ml-3">
            <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
              Adauga Imagini
            </div>
            <div className="h5 mb-0 font-weight-bold text-gray-800"></div>
          </div>
        </div>
        <div className="form-group col-md-6">
          <input
            type="file"
            name="file"
            className="form-control"
            onChange={this.uploadMultipleFiles}
            multiple
          />
        </div>
        <div className="form-group col-md-6">
          {(this.fileArray || []).map((url) => (
            <img
              src={url}
              alt="..."
              className="img-thumbnail"
              style={{ width: "400px" }}
            ></img>
          ))}
        </div>
      </>
    );
  }
}

export default MultipleImagesUpload;
