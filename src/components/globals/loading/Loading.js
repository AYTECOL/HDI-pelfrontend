import React, { Component } from 'react';
import { connect } from 'react-redux';

import './Loading.scss';
import store from '../../../store';
import { setLoading } from '../../../store/actions';

import iconHDI from 'assets/images/hdi_loader.svg';
import iconLoader from 'assets/images/loader.svg';

class Loading extends Component {
  static toggle(status) {
    store.dispatch(setLoading(status));
  }

  render() {
    const { loading } = this.props;
    return (
      <div className={`app-loader ${(!loading && 'hide') || ''}`}>
        <div className="content-loader">
          <div className="libertyLoader">
            <img className="libertyLoader__icon" src={iconHDI} alt="icon" />
            <img className="libertyLoader__gif" src={iconLoader} alt="icon" />
          </div>
          <p>Estamos trabajando por favor espere...</p>
        </div>
      </div>
    );
  }
}

export default connect(({ loading }) => ({ loading }))(Loading);
