import React, { Component } from 'react';
import isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';
import GoogleMapReact from 'google-map-react';

import './Map.scss';
import store from '../../../../store';
import { setAddresMap } from '../../../../store/actions';
import GetAddresInfo from '../../../../services/AddresCoordenates';
import Helpers from '../../../../common/helpers/helpers';
import { withCities } from '../hooks/cities';
import Marker from './Marker';

class MapBase extends Component {
  place = {
    address: '',
    city: '',
    department: '',
  };

  elementError = '.wrapper-map';

  hasValidCoordinates = (m) =>
    Boolean(m?.longitude && m?.latitude && m.latitude !== 0 && m.longitude !== 0);

  /**
   *
   * @readonly
   * @typedef {import('react-google-maps').GoogleMapProps} defaultOptions
   * @return {(defaultOptions["defaultOptions"])}
   */
  get defaultOptions() {
    return {
      streetViewControl: false,
      scaleControl: false,
      mapTypeControl: false,
      panControl: true,
      zoomControl: true,
      rotateControl: false,
      fullscreenControl: false,
    };
  }

  constructor(props) {
    super(props);
    const { mapsOptions } = store.getState();
    const {
      longitude,
      latitude,
      options: { zoom },
    } = mapsOptions;

    this.state = {
      isMarkerShown: true,
      zoom,
      markerPosition: {
        lat: latitude,
        lng: longitude,
      },
    };
  }

  static async reqAddress(address) {
    return GetAddresInfo.get(address);
  }

  componentDidMount() {
    this.setAddres(this.props);
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.setAddres(this.props);
    }
  }

  setAddres = async (newProps) => {
    const {
      cotizacion: {
        identification: { address, city, department },
      },
      citiesProps,
      mapsOptions,
    } = newProps;

    const place = { address, city, department };
    const placeComplete = Boolean(address && city && department);
    const placeChanged = !isEqual(this.place, place);

    // 1) Si el usuario cambió address/city/department y está completo → geocodifica SIEMPRE
    if (placeComplete && placeChanged) {
      this.place = place;
      Helpers.removeClass(this.elementError, 'error');

      const cityObject = {
        ...(await citiesProps.getCity({ city, departament: department })),
      };

      try {
        const data = await MapBase.reqAddress(`${address}, ${cityObject.city} ${cityObject.department}`);
        if (data.lng && data.lat) {
          this.setState(
            () => ({ markerPosition: data, isMarkerShown: true }),
            () => {
              store.dispatch(setAddresMap({ longitude: data.lng, latitude: data.lat }));
            }
          );
        } else {
          // Si falla geocoding y NO hay coords previas válidas, marcamos error
          if (!this.hasValidCoordinates(mapsOptions)) {
            this.setError();
            store.dispatch(setAddresMap({ longitude: 0, latitude: 0 }));
          }
        }
      } catch {
        if (!this.hasValidCoordinates(mapsOptions)) {
          this.setError();
          store.dispatch(setAddresMap({ longitude: 0, latitude: 0 }));
        }
      }
      return;
    }

    // 2) Si NO cambió el place, prioriza las coordenadas guardadas (retomar)
    if (this.hasValidCoordinates(mapsOptions)) {
      Helpers.removeClass(this.elementError, 'error');
      const { latitude, longitude } = mapsOptions;
      const next = { lat: latitude, lng: longitude };
      if (!isEqual(this.state.markerPosition, next)) {
        this.setState(() => ({ markerPosition: next, isMarkerShown: true }));
      }
      return; // ¡clave! no seguimos a setError() ni geocodificamos por dirección
    }

    // 3) Sin coords válidas y sin place completo → error visual + coords 0
    if (!placeComplete) {
      this.setError();
      store.dispatch(setAddresMap({ longitude: 0, latitude: 0 }));
    }
  };

  setError = () => {
    this.setState({ isMarkerShown: false });
    Helpers.addClass(this.elementError, 'error');
    store.dispatch(
      setAddresMap({
        longitude: 0,
        latitude: 0,
      })
    );
  };

  /**
   * @param {GoogleMapReact.ClickEventValue} e
   */
  onMapClick = async (e) => {
    const { lat, lng } = e;
    this.setState({ markerPosition: { lat, lng }, isMarkerShown: true });
    Helpers.removeClass(this.elementError, 'error');

    store.dispatch(
      setAddresMap({
        longitude: lng,
        latitude: lat,
      })
    );
  };

  render() {
    const { googleMapURL } = this.props;
    const { zoom, markerPosition, isMarkerShown } = this.state;
    console.log("Coordenadas obtenidas en el mapa (API de GOOGLE): ", markerPosition);
    return (
      <GoogleMapReact
        bootstrapURLKeys={{
          //key: googleMapURL,
          key: 'AIzaSyBL2heuQJheIysvzCbWXghuwDLu1Ga9dt4',
        }}
        defaultZoom={zoom}
        defaultCenter={markerPosition}
        center={markerPosition}
        zoom={zoom}
        onClick={this.onMapClick}
        defaultOptions={this.defaultOptions}
        disableDefaultUI
      >
        {isMarkerShown && <Marker {...markerPosition} />}
      </GoogleMapReact>
    );
  }
}

export default withCities(
  connect(({ cityDescription, cotizacion, mapsOptions }) => ({
    cityDescription,
    cotizacion,
    mapsOptions,
  }))(MapBase)
);
