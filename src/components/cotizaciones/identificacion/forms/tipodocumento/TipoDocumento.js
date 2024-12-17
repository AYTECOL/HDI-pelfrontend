import React, { Component } from 'react';
import classNames from 'classnames';

import store from 'store';
import {
  saveIdentificationValue,
  setGeneralSetIdentifications,
  updateTypeDoc,
} from '../../../../../store/actions';
import Identifications from '../../../../../services/Identifications';
import Loading from '../../../../globals/loading/Loading';
import Helpers from '../../../../../common/helpers/helpers';

class TipoDocumento extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      options: { identifications: [] },
      error: false,
    };
  }

  static toggleDisable(status) {
    if (status === true) {
      Helpers.disabled('#doc-type');
    } else {
      Helpers.enabled('#doc-type');
    }
  }

  static getTypeDocuments() {
    return this.state.options.identifications;
  }

  componentDidMount() {
    this._isMounted = true;
    Loading.toggle(true);
    this.getOptions();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  async getOptions() {
    let data = await Identifications.get();
    if (this.props.notJuridicOption) {
      data.identifications = data.identifications.filter(
        (item) => item.type_person !== 'Jurídica'
      );
    }
    this.setState({
      ...this.state,
      options: data,
    });
    store.dispatch(setGeneralSetIdentifications(data?.identifications || []));
    if (typeof this.props.hideLoader === 'undefined') {
      Loading.toggle(false);
    }
    if (this.props?.sendIdentifications)
      this.props.sendIdentifications(this.state.options.identifications);
  }

  validateEmpty = (e) => {
    e = e.target;
    if (e.value.length < 1) {
      if (this._isMounted) {
        this.setState({
          ...this.state,
          error: true,
        });
      }
    }
    let type = e.selectedOptions[0].getAttribute('data');
    let typeDocument = 1;
    if (type === 'Jurídica') typeDocument = 2;
    store.dispatch(saveIdentificationValue(e));
    store.dispatch(updateTypeDoc(typeDocument));
    if (this._isMounted) {
      this.setState({
        ...this.state,
        value: e.value,
      });
    }
  };

  getIdentifications() {
    return this.state.options.identifications;
  }

  render() {
    const { disabled, value, onChange } = this.props;
    const { error, options } = this.state;
    const { identifications } = options;
    return (
      <div className={'form-group input-select ' + error}>
        <label htmlFor="doc-type">Tipo de identificación</label>
        <select
          disabled={disabled === true}
          name="code"
          id="doc-type"
          className={classNames(
            disabled && 'disabled',
            'form-control',
            !value ? 'not-value' : ''
          )}
          value={value}
          onChange={onChange || this.validateEmpty}
        >
          {identifications.map((option) => (
            <option
              key={option.code}
              value={option.code}
              data={option.type_person}
            >
              {option.description}
            </option>
          ))}
        </select>
      </div>
    );
  }
}

export default TipoDocumento;
