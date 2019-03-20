import React from 'react';
import {connect} from "react-redux";
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import store from '../../store';

import './Map.scss';

import { setAddresMap } from '../../actionCreators';

import './Map.scss';
import GetAddresInfo from '../../services/AddresCoordenates';
class  Map  extends React.Component {
    constructor(props) {
        super(props);

        this.state = { 
            show: false,
            address: "",
            mapsOptions:{
                longitude: -74.0436118,
                latitude: 4.681545,
                options:{
                    zoom: 20
                }
            }
        };

        window.stime = null;
        store.subscribe(async () => {
            let storeState = store.getState();
            let address = storeState.cotizacion.identification.address;
            if( address != "" ){
                if( this.state.address != address ){
                    var it = this;
                    clearTimeout(window.stime);
                    window.stime = setTimeout(async function () {
                        let data = await it.reqAddress(address);
                        if( typeof data.longitude != "undefined" && typeof data.latitude != "undefined" ){
                            it.setState({
                                ...it.state,
                                address: address,
                                mapsOptions: {
                                    ...it.state.mapsOptions,
                                    longitude: data.longitude,
                                    latitude: data.latitude,
                                }
                            });
                        }
                    },1000);
                }
            }
        });
    }

    async reqAddress(address){
        return await GetAddresInfo.get(address)
            .then(response => {
                let map = {
                    longitude: response.lng,
                    latitude: response.lat
                }
                return map;
            });
    }
    
    render() {
        
        const { longitude, latitude, options: { zoom } } = this.state.mapsOptions;
        
        const MyMapComponent = withScriptjs(withGoogleMap((props) =>
        <GoogleMap
            defaultZoom={zoom}
            defaultCenter={{ lat: latitude, lng: longitude }}
            zoom={zoom}
            defaultOptions={{
                streetViewControl: false,
                scaleControl: false,
                mapTypeControl: false,
                panControl: false,
                zoomControl: false,
                rotateControl: false,
                fullscreenControl: false
              }}
            disableDefaultUI
        >
            {props.isMarkerShown && <Marker position={{ lat: latitude, lng: longitude }} />}
        </GoogleMap>
        ));

        return (
        <div>
            <MyMapComponent isMarkerShown
                            googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyBgo1kZwdmm7WnRiT9rkfXcVn87QJha6AU"
                            loadingElement={<div style={{ height: `100%` }} />}
                            containerElement={<div style={{ height: `400px` }} />}
                            mapElement={<div style={{ height: `100%` }} />}/>
        </div>
       
    );
                }
};

export default Map;