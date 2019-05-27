import React, {Component} from 'react';
import './Loading.scss';
import {ReactComponent as LoadingSvg} from './Loading.svg';
import store from "../../../store";
import Helpers from "../../../common/helpers/helpers/Helpers";

class Loading extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: store.getState().ShowLoader
        };
        this.animation();
    }

    static toggle(status) {
        if (status === true) {
            Helpers.removeClass('.app-loader', 'hide');
        } else {
            setTimeout(() => {
                Helpers.addClass('.app-loader', 'hide');
            }, 1000);
        }
    }

    animation() {
        let status = true;
        setInterval(() => {
            status = !status;
            if (status === true) {
                if (document.querySelector(".loader-background") !== null) {
                    document.querySelector(".loader-background").setAttribute("class", "loader-background active");
                }
                setTimeout(() => {
                    if (document.querySelector(".loader-background-2") !== null) {
                        document.querySelector(".loader-background-2").setAttribute("class", "loader-background-2");
                    }
                }, 150);
            } else {
                if (document.querySelector(".loader-background-2") !== null) {
                    document.querySelector(".loader-background-2").setAttribute("class", "loader-background-2 active");
                }
                setTimeout(() => {
                    if (document.querySelector(".loader-background") !== null) {
                        document.querySelector(".loader-background").setAttribute("class", "loader-background");
                    }
                }, 150);
            }
        }, 2500);
    }

    render() {
        return (
            <div className={"app-loader hide"}>
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
