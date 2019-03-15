import React from 'react';
import {connect} from "react-redux";
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import store from '../../store';
import {
    loadIdentifications,
    validateIdentificationValue,
    saveIdentificationValue,
    autoCompleteCiudadToogle,
    nextStepIndex
} from '../../actionCreators';

import './Mapa.scss';
import { runInThisContext } from 'vm';


store.dispatch(loadIdentifications());

class  Mapa  extends React.Component{
    
    render() {
        const { coords:{ longitude, latitude, options: { zoom } } } = this.props;
        const MyMapComponent = withScriptjs(withGoogleMap((props) =>
        <GoogleMap
            defaultZoom={8}
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

const mapStateToProps = state => {
    return {
        autoCompleteCuidad: state.autoCompleteCuidad,
        stateForm: state.stateForm,
        identifications: state.identifications,
        cotizacion: state.cotizacion,
        cotizacionErrors: state.cotizacionErrors,
        continueButtonDisable: state.continueButtonDisable
    };
};

const mapDispatchToProps = dispatch => {
    return {
        saveIdentificationValue(value) {
            dispatch(saveIdentificationValue(value));
        },
        validateIdentificationValue(cotizacion) {
            dispatch(validateIdentificationValue(cotizacion));
        },
        nextStepIndex() {
            dispatch(nextStepIndex());
        },
        autoCompleteCiudadToogle(){
            dispatch(autoCompleteCiudadToogle());
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Mapa);