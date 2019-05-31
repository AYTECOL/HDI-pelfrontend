import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
//Component
import store from "../../../../store";
import {indexPlanSelected} from "../../../../actions";
import Sticky from "../../../../common/helpers/sticky/Sticky";
import Masknumbermoney from "../../../../common/helpers/masknumbermoney/Masknumbermoney";

class Index extends Component {

    constructor(props) {
        super(props);
        this.state = {
            step: parseInt(this.props.match.params.step),
            plans: [],
            index: 1,
        };
        for (let i = 0; i < 3; i++) this.state.plans[i] = {name: "------"};
        store.subscribe(() => {
            let storeState = store.getState();
            let plans = storeState.AllPlans;
            let index = storeState.indexPlan;
            this.setState({
                ...this.state,
                plans: plans,
                index: index
            });
        });
    }

    componentDidMount() {
        new Sticky("wrapper-tabs");
    }

    changeIndexPlan = index => e => {
        store.dispatch(indexPlanSelected(index));
    };

    render() {
        return (
            <div className="wrapper-tabs">
                <div className="row tabs text-center">
                    {this.state.plans.map((option, key) =>
                        <div className="col col-12 col-sm-12 col-md-4 col-lg-4 no-padding" key={key}>
                            <div className={"item-tab " + (parseInt(this.state.index) === key ? 'active' : '')}
                                 onClick={this.changeIndexPlan(key)}>
                                <span>{option.name}</span>
                                <p>{typeof option.value === "undefined" ? '$0' : Masknumbermoney.formatToMask(option.value)}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
    }

}

export default withRouter(Index);