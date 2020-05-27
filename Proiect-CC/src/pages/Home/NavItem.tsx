import React, { FunctionComponent, useState } from 'react';
import { Tooltip } from 'reactstrap';
import * as Scroll from 'react-scroll';
import { Link } from 'react-router-dom';
interface Props {
  scrolling: Boolean;
  link: string;
  id: string;
  text: string;
  titleForTooltip: string;
  icon: string;
}

const NavItem: FunctionComponent<Props> = ({
  scrolling,
  link,
  id,
  text,
  titleForTooltip,
  icon
}) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  return !scrolling ? (
    <>
      <Link to={link} className='nav-link av-nav-link' id={id}>
        <i className={icon}></i>
        <span className="textNavBar">{text}</span>
      </Link>
      <Tooltip
        placement='bottom'
        isOpen={tooltipOpen}
        target={id}
        toggle={() => setTooltipOpen(!tooltipOpen)}
      >
        {titleForTooltip}
      </Tooltip>
    </>
  ) : (
    <Scroll.Link
      activeclassName='active'
      to={link}
      spy={true}
      smooth={true}
      offset={0}
      duration={500}
      className='nav-link av-nav-link'
      href={'#' + link}
    >
      <i className={icon}></i><span className="textNavBar">{text}</span>
    </Scroll.Link>
  );
};
export default NavItem;
