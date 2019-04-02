import React from 'react';
import {GoogleMap, Marker, withGoogleMap, withScriptjs} from "react-google-maps";
import './Map.scss';
import store from "../../../../store";
import {mapShow, saveIdentificationValue, setAddresMap} from "../../../../actionCreators";
import GetAddresInfo from "../../../../services/AddresCoordenates";

class MapBase extends React.Component {

    constructor(props) {
        super(props);

        let storeState = store.getState();
        this.state = {
            address: "",
            longitude: storeState.mapsOptions.longitude,
            latitude: storeState.mapsOptions.latitude,
            isMarkerShown: true,
            zoom: 20,
            el: document.querySelector(".wrapper-map")
        };
        this.state.markerPosition = {lat: this.state.latitude, lng: this.state.longitude};

        window.stime = null;
        store.subscribe(async () => {
            let storeState = store.getState();
            let address = storeState.cotizacion.identification.address;
            if (this.state.address !== address && address !== "") {
                var it = this;
                clearTimeout(window.stime);
                window.stime = setTimeout(async function () {
                    let state = store.getState();
                    let data = await it.reqAddress(address + ", " + state.cityDescription);
                    store.dispatch(mapShow(true));
                    it.state.el.className = it.state.el.className.replace(" error", "");
                    if (typeof data.lng !== "undefined" && typeof data.lat !== "undefined") {
                        it.setState({
                            ...it.state,
                            address: address,
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
                            address: address,
                            isMarkerShown: false,
                        });
                        it.state.el.className += " error";
                    }
                }, 500);
            }
        });
    }

    async reqAddress(address) {
        return await GetAddresInfo.get(address)
            .then(response => {
                return response;
            });
    }

    async onMapClick(e) {
        return await GetAddresInfo.getAdressByCoors(e.latLng).then(response => {
            this.setState({
                address: response,
                markerPosition: e.latLng,
                isMarkerShown: true,
            });
            this.state.el.className = this.state.el.className.replace(" error", "");
            store.dispatch(saveIdentificationValue({
                name: 'address',
                value: response
            }));
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