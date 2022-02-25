import React, { Component } from 'react';

import store from '../../../../../store';
import { saveIdentificationValue } from '../../../../../actions';
import Help from '../../../../../common/icons/help';
import { Tooltip } from '../../../../Tooltip';

class Addressadditional extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      value: '',
    };
  }

  componentDidMount() {
    this.unsubscribe = store.subscribe(async () => {
      let storeState = store.getState();
      let value = storeState.cotizacion.identification.addressadditional;
      if (this.state.value !== value) {
        this.setState({
          ...this.state,
          value: value,
        });
      }
    });
  }

  componentDidUpdate() {}

  componentWillUnmount() {
    this.unsubscribe();
  }

  validateEmpty = ({ target }) => {
    const { value } = target;
    let error = false;
    if (value.length > 200) error = true;
    store.dispatch(saveIdentificationValue(target));
    this.setState({
      ...this.state,
      error: error,
      value,
    });
  };

  render() {
    const { error, value } = this.state;
    return (
      <div className={'form-group text-truncate ' + (error ? 'error' : '')}>
        <div className="d-flex position-relative">
          <label htmlFor="addressadditional">
            Información adicional de la dirección
          </label>
          <Tooltip
            className={'ml-auto'}
            placement="left"
            title="No olvides agregar la información adicional de la dirección. Por ejemplo, el número de torre, nombre de conjunto ETC."
          >
            <Help className={'ml-auto icon-primary'} />
          </Tooltip>
        </div>
        <input
          name="addressadditional"
          id="addressadditional"
          type="text"
          value={value}
          autoComplete="addressAdditional"
          className="form-control text-truncate"
          onChange={this.validateEmpty}
          placeholder="Ingrese información como la torre, el apartamento, el nombre del conjunto, etc..."
        />
        <small className="form-text text-muted">
          Ejemplo: Interior 6, apto 201
        </small>
      </div>
    );
  }
}

export default Addressadditional;
