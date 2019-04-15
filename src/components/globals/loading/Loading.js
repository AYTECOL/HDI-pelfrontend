import React, {Component} from 'react';
import './Loading.scss';
import {ReactComponent as LoadingSvg} from './Loading.svg';
import store from "../../../store";

class Loading extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: store.getState().ShowLoader
        };
        this.animation();
        store.subscribe(async () => {
            let active = store.getState().ShowLoader;
            if (active !== this.state.active) {
                this.setState({
                    active: active
                })
            }
        });
    }

    animation() {
        console.log(this.state.active);
        if (this.state.active === false) return;
        let status = true;
        setInterval(function () {
            status = !status;
            if (status === true) {
                document.querySelector(".loader-background").setAttribute("class", "loader-background active");
                setTimeout(function () {
                    document.querySelector(".loader-background-2").setAttribute("class", "loader-background-2");
                }, 150);
            } else {
                document.querySelector(".loader-background-2").setAttribute("class", "loader-background-2 active");
                setTimeout(function () {
                    document.querySelector(".loader-background").setAttribute("class", "loader-background");
                }, 150);
            }
        }, 2500);
    }

    render() {
        if (this.state.active === false) return <div></div>;
        return (
            <div className="app-loader">
                <div className="content-loader">
                    <div className="image">
                        <LoadingSvg/>
                    </div>
                    <p>Estamos trabajando por favor espere...</p>
                </div>
            </div>
        );
    }
}

export default Loading;
