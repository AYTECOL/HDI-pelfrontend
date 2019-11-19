import React, { Component } from "react";
import {
  GoogleMap,
  Marker,
  withGoogleMap,
  withScriptjs
} from "react-google-maps";
import "./Map.scss";
import store from "../../../../store";
import { setAddresMap } from "../../../../actions";
import GetAddresInfo from "../../../../services/AddresCoordenates";
import Helpers from "../../../../common/helpers/helpers/Helpers";

class MapBase extends Component {
  stime = 0;
  constructor(props) {
    super(props);

    let storeState = store.getState();
    this.state = {
      address: storeState.cotizacion.identification.address,
      longitude: storeState.mapsOptions.longitude,
      latitude: storeState.mapsOptions.latitude,
      isMarkerShown: true,
      zoom: storeState.mapsOptions.options.zoom,
      el: ".wrapper-map",
      mapOption: {},
      city: storeState.cotizacion.identification.city,
      department: storeState.cotizacion.identification.department
    };
    this.state.markerPosition = {
      lat: this.state.latitude,
      lng: this.state.longitude
    };
  }

  componentWillMount() {
    clearTimeout(this.stime);
  }

  static async reqAddress(address) {
    return await GetAddresInfo.get(address).then(response => {
      return response;
    });
  }

  componentDidMount() {
    this.unsubscribe = store.subscribe(() => {
      let storeState = store.getState();
      const {
        address,
        city,
        department
      } = storeState.cotizacion.identification.address;
      if (
        address !== "" ||
        this.state.city !== city ||
        this.state.department !== department
      ) {
        this.setState(
          {
            ...this.state,
            city: city,
            department: department,
            address: address
          },
          () => {
            clearTimeout(this.stime);
            Helpers.removeClass(this.state.el, "error");
            this.stime = setTimeout(() => {
              let state = store.getState();
              MapBase.reqAddress(
                address +
                  ", " +
                  state.pdf_info["city"] +
                  " " +
                  state.cityDescription
              ).then(data => {
                if (!!data.lng && !!data.lat) {
                  this.setState({
                    ...this.state,
                    markerPosition: data,
                    isMarkerShown: true
                  });
                  store.dispatch(
                    setAddresMap({
                      longitude: data.lng,
                      latitude: data.lat
                    })
                  );
                } else {
                  this.setState({
                    ...this.state,
                    isMarkerShown: false
                  });
                  Helpers.addClass(this.state.el, "error");
                }
              });
            }, 250);
          }
        );
      } else if (address === "") {
        this.setState({
          ...this.state,
          isMarkerShown: false
        });
        Helpers.addClass(this.state.el, "error");
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
    clearTimeout(this.stime);
  }

  async onMapClick(e) {
    return await GetAddresInfo.getAdressByCoors(e.latLng).then(response => {
      this.setState({
        address: response,
        markerPosition: e.latLng,
        isMarkerShown: true
      });
      Helpers.removeClass(this.state.el, "error");
      // store.dispatch(saveIdentificationValue({
      //     name: 'address',
      //     value: response
      // }));
    });
  }

  render() {
    return (
      <GoogleMap
        defaultZoom={this.state.zoom}
        defaultCenter={this.state.markerPosition}
        center={this.state.markerPosition}
        zoom={this.state.zoom}
        onClick={this.onMapClick.bind(this)}
        defaultOptions={{
          streetViewControl: false,
          scaleControl: false,
          mapTypeControl: false,
          panControl: true,
          zoomControl: true,
          rotateControl: false,
          fullscreenControl: false
        }}
        disableDefaultUI
      >
        {this.state.isMarkerShown && (
          <Marker position={this.state.markerPosition} />
        )}
      </GoogleMap>
    );
  }
}

export default withScriptjs(withGoogleMap(MapBase));
