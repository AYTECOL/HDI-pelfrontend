import React, {Component} from 'react';
import store from '../../../../store';
import MapBase from './MapBase';
import {ApiKeyGoogle} from '../../../../config';
import './Map.scss';

class Map extends Component {
    constructor(props) {
        super(props);

        this.state = {
            show: false,
            error: false
        };
    }

    componentDidMount() {
        this.unsubscribe = store.subscribe(async () => {
            let storeState = store.getState();
            if (storeState.errorMap !== this.state.error || storeState.showMap !== this.state.show) {
                this.setState({
                    error: storeState.errorMap,
                    show: storeState.showMap,
                });
            }
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        if (this.state.show === false) return <div className="hide">&nbsp;</div>;
        return (
            <div className={(this.state.show ? "" : "hide") + " wrapper-map " + (this.state.error ? "error" : "")}>
                <MapBase isMarkerShown
                         googleMapURL={"https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=" + ApiKeyGoogle}
                         loadingElement={<div style={{height: `100%`}}/>}
                         containerElement={<div style={{height: `400px`}}/>}
                         mapElement={<div style={{height: `100%`}}/>}/>
                <div className="error-info">
                    <p><span>&nbsp;</span>No encontramos la dirección ingresada, valida en el mapa si es la correcta y
                        continua con el proceso</p>
                </div>
            </div>

        );
    }
}

export default Map;