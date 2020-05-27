import React, { ReactElement } from 'react';

import classNames from 'classnames';
import './nav.style.css';
import { Link } from 'react-router-dom';
interface Props {
  user?: any;
}

export default function Nav({ user }: Props): ReactElement {
  return (
    <nav
      className={classNames('navbar navbar-expand-md av-navbar scroll', {
        scroll: false
      })}
      id='tmNav'
    >
      <div className=''>
        <div className='av-next'>
          <Link to='/' className='navbar-brand'>
            <i className='fas fa-infinity'></i> Infinite Loop
          </Link>
        </div>
      </div>
    </nav>
  );
}
