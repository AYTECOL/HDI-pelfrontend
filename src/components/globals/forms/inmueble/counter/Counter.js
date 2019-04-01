import React, {Component} from 'react';
import './Counter.scss';

class Counter extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className={"msj-total"}>
                <p className="error">Haz diligenciado 3 de 8 campos</p>
            </div>
        );
    }
}

export default Counter;



