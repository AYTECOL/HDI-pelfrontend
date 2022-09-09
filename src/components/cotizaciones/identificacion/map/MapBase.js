import React, { Component } from 'react';
import isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';
import GoogleMapReact from 'google-map-react';

import './Map.scss';
import store from '../../../../store';
import { setAddresMap, saveIdentificationValue } from '../../../../actions';
import GetAddresInfo from '../../../../services/AddresCoordenates';
import Helpers from '../../../../common/helpers/helpers/Helpers';
import { withCities } from '../hooks/cities';
import Marker from './Marker';

class MapBase extends Component {
  place = {
    address: '',
    city: '',
    department: '',
  };

  elementError = '.wrapper-map';

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

  componentWillReceiveProps(newProps) {
    this.setAddres(newProps);
  }

  setAddres = async (newProps) => {
    const {
      cotizacion: {
        identification: { address, city, department },
      },
      citiesProps,
    } = newProps;
    const place = { address, city, department };
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

    if (!city || !department || !address) this.setError();
    else if (!isEqual(this.place, place)) {
      this.place = place;
      Helpers.removeClass(this.elementError, 'error');
      MapBase.reqAddress(
        address + ', ' + cityObject.city + ' ' + cityObject.department
      ).then((data) => {
        if (data.lng && data.lat) {
          this.setState(
            {
              ...this.state,
              markerPosition: data,
              isMarkerShown: true,
            },
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
        }
      });
    }
  };

  setError = () => {
    this.setState({
      ...this.state,
      isMarkerShown: false,
    });
    Helpers.addClass(this.elementError, 'error');
  };

  /**
   * @param {GoogleMapReact.ClickEventValue} e
   */
  onMapClick = async (e) => {
    const { lat, lng } = e;
    return GetAddresInfo.getAdressByCoors({ lat, lng }).then((response) => {
      this.place.address = response;
      this.setState({
        markerPosition: { lat, lng },
        isMarkerShown: true,
      });
      Helpers.removeClass(this.elementError, 'error');
      /* store.dispatch(
        saveIdentificationValue({
          name: 'address',
          value: response,
        })
      ); */
    });
  };

  render() {
    const { googleMapURL } = this.props;
    const { zoom, markerPosition, isMarkerShown } = this.state;
    return (
      <GoogleMapReact
        bootstrapURLKeys={{
          client: googleMapURL,
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
  connect(({ cityDescription, cotizacion }) => ({
    cityDescription,
    cotizacion,
  }))(MapBase)
);
