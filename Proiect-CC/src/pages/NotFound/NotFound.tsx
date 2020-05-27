import React from 'react';
import './NotFound.style.css';
import { Link } from 'react-router-dom';
interface Props {}

const NotFound = (props: Props) => {
  return (
    <div id='notfound'>
      <div className='notfound-bg'></div>
      <div className='notfound'>
        <div className='notfound-404'>
          <h1>404</h1>
        </div>
        <h2>we are sorry, but the page you requested was not found</h2>
        <Link to='/' className='home-btn'>
          Go Home
        </Link>
        <Link to='/#contact' className='contact-btn'>
          Contact us
        </Link>
        {/* <div className='notfound-social'>
          <a href='#2'>
            <i className='fa fa-facebook'></i>
          </a>
          <a href='#2'>
            <i className='fa fa-twitter'></i>
          </a>
          <a href='#2'>
            <i className='fa fa-pinterest'></i>
          </a>
          <a href='#2'>
            <i className='fa fa-google-plus'></i>
          </a>
        </div> */}
      </div>
    </div>
  );
};

export default NotFound;
