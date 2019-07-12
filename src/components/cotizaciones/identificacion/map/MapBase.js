import React, {Component} from 'react';
import {GoogleMap, Marker, withGoogleMap, withScriptjs} from "react-google-maps";
import './Map.scss';
import store from "../../../../store";
import {setAddresMap} from "../../../../actions";
import GetAddresInfo from "../../../../services/AddresCoordenates";
import Helpers from "../../../../common/helpers/helpers/Helpers";

class MapBase extends Component {

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
        this.state.markerPosition = {lat: this.state.latitude, lng: this.state.longitude};
        window.stime = null;
    }

    static async reqAddress(address) {
        return await GetAddresInfo.get(address)
            .then(response => {
                return response;
            });
    }

    componentDidMount() {
        this.unsubscribe = store.subscribe(() => {
            let storeState = store.getState();
            let address = storeState.cotizacion.identification.address;
            let city = storeState.cotizacion.identification.city;
            let department = storeState.cotizacion.identification.department;
            if ((this.state.address !== address && address !== "") || (this.state.city !== city) || (this.state.department !== department)) {
                var it = this;
                it.setState({
                    ...it.state,
                    city: city,
                    department: department,
                    address: address
                });
                clearTimeout(window.stime);
                Helpers.removeClass(it.state.el, 'error');
                window.stime = setTimeout(function () {
                    let state = store.getState();
                    MapBase.reqAddress(address + ", " + state.cityDescription).then(function (data) {
                        if (typeof data.lng !== "undefined" && typeof data.lat !== "undefined") {
                            it.setState({
                                ...it.state,
                                markerPosition: data,
                                isMarkerShown: true,
                            });
                            store.dispatch(setAddresMap({
                                longitude: data.lng,
                                latitude: data.lat,
                            }));
                        } else {
                            it.setState({
                                ...it.state,
                                isMarkerShown: false,
                            });
                            Helpers.addClass(it.state.el, 'error');
                        }
                    });
                }, 250);
            } else if (address === "") {
                this.setState({
                    ...this.state,
                    isMarkerShown: false,
                });
                Helpers.addClass(this.state.el, 'error');
            }
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    async onMapClick(e) {
        return await GetAddresInfo.getAdressByCoors(e.latLng).then(response => {
            this.setState({
                address: response,
                markerPosition: e.latLng,
                isMarkerShown: true,
            });
            Helpers.removeClass(this.state.el, 'error');
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
                    fullscreenControl: false,
                }}
                disableDefaultUI
            >{this.state.isMarkerShown && <Marker position={this.state.markerPosition}/>}
            </GoogleMap>
        );
    }
}

export default withScriptjs(withGoogleMap(MapBase));
