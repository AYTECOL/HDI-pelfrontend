import React, { Component } from 'react';
import { connect } from 'react-redux';

import './Loading.scss';
import { ReactComponent as LoadingSvg } from './Loading.svg';
import store from '../../../store';
import { setLoading } from '../../../actions';

class Loading extends Component {
  static toggle(status) {
    store.dispatch(setLoading(status));
  }

  render() {
    const { loading } = this.props;
    return (
      <div className={`app-loader ${(!loading && 'hide') || ''}`}>
        <div className="content-loader">
          <div className="image">
            <LoadingSvg />
          </div>
          <p>Estamos trabajando por favor espere...</p>
        </div>
      </div>
    );
  }
}

export default connect(({ loading }) => ({ loading }))(Loading);
