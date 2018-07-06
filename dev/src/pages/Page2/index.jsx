import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  func,
  string,
  shape,
  arrayOf,
} from 'prop-types';
// import { hot } from 'react-hot-loader';
import { NavLink } from 'react-router-dom';
import receiveCountries from '../../actions/countries';
import './Page2.scss';

/* eslint no-console: ["error", { allow: ["log", "error"] }] */

const propTypes = {
  fetchCountries: func.isRequired,
  countries: arrayOf(string).isRequired,
  match: shape({
    params: shape({
      pageName: string,
    }),
  }).isRequired,
};

class Page2 extends Component {
  static fetchOnHydrate(dispatch) {
    return [dispatch(receiveCountries())];
  }

  componentDidMount() {
    const { fetchCountries } = this.props;
    return fetchCountries();
  }

  render() {
    const { countries, match } = this.props;
    console.log('Countries: %o', countries.join(','));
    return (
      <div>
        Page opened via route:
        {match.params.pageName}
        <ul>
          {countries.map(country => (
            <li key={country}>
              {country}
            </li>
          ))}
        </ul>
        <NavLink to="/">
          Go to 1
        </NavLink>
      </div>
    );
  }
}

Page2.propTypes = propTypes;

const mapStateToProps = ({ countries }) => ({ countries: countries.countries });
const mapActionsToProps = dispatch => ({
  fetchCountries: () => dispatch(receiveCountries),
});

export default connect(mapStateToProps, mapActionsToProps)(Page2);
