import React, { Component } from "react";
import {
  GoogleMap,
  Marker,
  withGoogleMap,
  withScriptjs
} from "react-google-maps";
import { connect } from "react-redux";
import { compose } from "redux";
import isEqual from "lodash/isEqual";

import "./Map.scss";
import store from "../../../../store";
import { setAddresMap, saveIdentificationValue } from "../../../../actions";
import GetAddresInfo from "../../../../services/AddresCoordenates";
import Helpers from "../../../../common/helpers/helpers/Helpers";

class MapBase extends Component {
  place = {
    address: "",
    city: "",
    department: ""
  };

  elementError = ".wrapper-map";

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
      fullscreenControl: false
    };
  }

  constructor(props) {
    super(props);
    const { mapsOptions } = store.getState();
    const {
      longitude,
      latitude,
      options: { zoom }
    } = mapsOptions;

    this.state = {
      isMarkerShown: true,
      zoom,
      markerPosition: {
        lat: latitude,
        lng: longitude
      }
    };
  }

  static async reqAddress(address) {
    return await GetAddresInfo.get(address).then(response => {
      return response;
    });
  }

  componentDidMount() {
    this.setAddres(this.props);
  }

  componentWillReceiveProps(newProps) {
    this.setAddres(newProps);
  }

  setAddres = newProps => {
    const {
      pdf_info,
      cityDescription,
      cotizacion: {
        identification: { address, city, department }
      }
    } = newProps;
    const place = { address, city, department };
    if (!isEqual(this.place, place)) {
      this.place = place;
      Helpers.removeClass(this.elementError, "error");
      MapBase.reqAddress(
        address + ", " + pdf_info["city"] + " " + cityDescription
      ).then(data => {
        if (data.lng && data.lat) {
          this.setState(
            {
              ...this.state,
              markerPosition: data,
              isMarkerShown: true
            },
            () => {
              store.dispatch(
                setAddresMap({
                  longitude: data.lng,
                  latitude: data.lat
                })
              );
            }
          );
        } else {
          this.setError();
        }
      });
    } else if (address === "") {
      this.setError();
    }
  };

  setError = () => {
    this.setState({
      ...this.state,
      isMarkerShown: false
    });
    Helpers.addClass(this.elementError, "error");
  };

  onMapClick = async e => {
    return await GetAddresInfo.getAdressByCoors(e.latLng).then(response => {
      this.place.address = response;
      this.setState({
        markerPosition: e.latLng,
        isMarkerShown: true
      });
      Helpers.removeClass(this.elementError, "error");
      store.dispatch(
        saveIdentificationValue({
          name: "address",
          value: response
        })
      );
    });
  };

  render() {
    const { zoom, markerPosition, isMarkerShown } = this.state;
    return (
      <GoogleMap
        defaultZoom={zoom}
        defaultCenter={markerPosition}
        center={markerPosition}
        zoom={zoom}
        onClick={this.onMapClick}
        defaultOptions={this.defaultOptions}
        disableDefaultUI
      >
        {isMarkerShown && <Marker position={markerPosition} />}
      </GoogleMap>
    );
  }
}

export default compose(
  withScriptjs,
  withGoogleMap,
  connect(({ pdf_info, cityDescription, cotizacion }) => ({
    pdf_info,
    cityDescription,
    cotizacion
  }))
)(MapBase);
