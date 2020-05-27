import React from "react";
import {Link} from 'react-router-dom'
export default function ViewProductCard(props: any) {
  return (
    <>
      <div className="col-md-2 p-2">
        <div className="card">
          <div className="card-img-block">
            <img
              className="img-fluid firstImageProduct"
              src={props && (props.filesToUploadURL && props.filesToUploadURL[0] || 'https://via.placeholder.com/500x500')}
              alt="Card image cap"
            />
          </div>
          <div className="card-body pt-5 moveTop100">
            <img
              src={props && props.image}
              alt="profile-image "
              className="profile rounded-circle"
            />
            <h6 className="card-title">{props && props.contactPerson}</h6>
            <h4 className="card-title">{props && props.title}</h4>
            <p className="card-text">
            {props && props.description.substring(0,100)+"..."}
            </p>
            <div className="icon-block">
              <span className="badge badge-info mr-3">
                <i className="fas fa-images"></i> 4
              </span>

              <span className="badge badge-info mr-3">
                <i className="fas fa-envelope fa-fw"></i> 5
              </span>

              <span className="badge badge-success mr-3">
                <i className="fas fa-tag"></i> {props && props.price}
              </span>
              
              <span className="badge badge-success mr-3">
              <i className="fas fa-map-marker-alt"></i> Iasi
              </span>
              {props && props.auction && (
                <span className="badge badge-dark mr-3">
                <i className="fas fa-check-circle"></i> Licitatie
              </span>
              )}
              <Link to={`/view/${props.index}`} className="btn btn-primary btn-icon-split btn-sm">
              <span className="icon text-white-50">
                  <i className="far fa-eye"></i>
                </span>
                <span className="text">See More</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
