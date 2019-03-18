import React from 'react';
import {connect} from "react-redux";
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"

import './Mapa.scss';

import { setAddresMap } from '../../actionCreators';

import './Mapa.scss';
class  Mapa  extends React.Component{
    render() {
        console.log(this.refs.map);
        const { mapsOptions:{ longitude, latitude, options: { zoom } } } = this.props;
        
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
            {longitude}
            {latitude}
            <MyMapComponent isMarkerShown
                            googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyBgo1kZwdmm7WnRiT9rkfXcVn87QJha6AU"
                            loadingElement={<div style={{ height: `100%` }} />}
                            containerElement={<div style={{ height: `400px` }} />}
                            mapElement={<div style={{ height: `100%` }} />}/>
        </div>
       
    );
                }
};

const mapStateToProps = state => {
    return {
        mapsOptions: state.mapsOptions
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setAddresMap(map) {
            dispatch(setAddresMap(map));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Mapa);