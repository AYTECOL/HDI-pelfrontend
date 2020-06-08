import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import store from '../../../../../store';
import { saveIdentificationValue, updateTypeDoc } from '../../../../../actions';
import Identifications from '../../../../../services/Identifications';
import Loading from '../../../../globals/loading/Loading';
import Helpers from '../../../../../common/helpers/helpers/Helpers';

class TipoDocumento extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      options: { identifications: [] },
      error: false,
    };
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
    this.setState({
      ...this.state,
      options: await Identifications.get(),
    });
    if (typeof this.props.hideLoader === 'undefined') {
      Loading.toggle(false);
    }
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
    let text = '';
    for (let i = 0; i < this.state.options.identifications.length; i++) {
      if (
        parseInt(this.state.options.identifications[i].code) ===
        parseInt(e.value)
      ) {
        text = this.state.options.identifications[i].description;
        break;
      }
    }
    Helpers.updatePdfInfo({
      doc_type: text,
    });
    if (this._isMounted) {
      this.setState({
        ...this.state,
        value: e.value,
      });
    }
  };

  render() {
    const { disabled, value, onChange } = this.props;
    const { error, options } = this.state;
    return (
      <div className={'form-group input-select ' + error}>
        <label htmlFor="doc-type">Tipo de identificación</label>
        <select
          disabled={disabled === true}
          name="code"
          id="doc-type"
          className={classNames(disabled && 'disabled', 'form-control')}
          value={value}
          onChange={onChange || this.validateEmpty}
        >
          {options.identifications.map((option) => (
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

export default connect(({ cotizacion, stateFormIdentificacion }) => ({
  value: cotizacion.identification.code,
  disabled: stateFormIdentificacion !== 0,
}))(TipoDocumento);
