import React from 'react';
import { hot } from 'react-hot-loader';
import { NavLink } from 'react-router-dom';

const Page1 = () => (
  <div>
    Main page
    <NavLink to="/page2">
      Go to 2
    </NavLink>
  </div>
);

export default hot(module)(Page1);
