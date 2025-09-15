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
      mapsOptions
    } = newProps;
    const place = { address, city, department };

    // 1) Si hay coordenadas guardadas válidas, PRIORIDAD total → centra el mapa y termina.
    if (this.hasValidCoordinates(mapsOptions)) {
      Helpers.removeClass(this.elementError, 'error');
      const { latitude, longitude } = mapsOptions;
      if (
        !isEqual(this.state.markerPosition, { lat: latitude, lng: longitude })
      ) {
        this.setState(() => ({
          markerPosition: { lat: latitude, lng: longitude },
          isMarkerShown: true,
        }));
      }
      return; // evitamos geocodificar por dirección
    }
    /**
     * @type {{
     * code_city: number,
     * code_department: number,
     * city: string
     * department: string
     * }}
     */
    const cityObject = {
      ...(await citiesProps.getCity({ city, departament: department })),
    };

    // 2) Sin coordenadas válidas: fallback al flujo por dirección
    if (!city || !department || !address) this.setError();
    else if (!isEqual(this.place, place)) {
      this.place = place;
      Helpers.removeClass(this.elementError, 'error');
      MapBase.reqAddress(
        address + ', ' + cityObject.city + ' ' + cityObject.department
      ).then((data) => {
        if (data.lng && data.lat) {
          this.setState(
            () => ({
              markerPosition: data,
              isMarkerShown: true,
            }),
            () => {
              store.dispatch(
                setAddresMap({
                  longitude: data.lng,
                  latitude: data.lat,
                })
              );
            }
          );
        } else {
          this.setError();
          store.dispatch(
            setAddresMap({
              longitude: 0,
              latitude: 0,
            })
          );
        }
      });
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
