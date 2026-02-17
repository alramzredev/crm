import React from 'react';
import logo from '../../images/logo-white.6o4asnu8s0.svg';

export default ({ className, ...props }) => (
  <img src={logo} alt="Logo" className={className} {...props} />
  // <div></div>
);
