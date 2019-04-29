import React from 'react';
import './Index.scss';
import {withRouter} from "react-router-dom";
//Component
import store from "../../../../store";
import {indexPlanSelected} from "../../../../actions";

class Index extends React.Component {

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
            if (plans.length !== 0 || this.state.index !== index) {
                this.setState({
                    ...this.state,
                    plans: plans,
                    index: index
                });
            }
        });
    }

    changeIndexPlan(index) {
        store.dispatch(indexPlanSelected(index));
    }

    render() {
        return (
            <div className="row tabs text-center">
                {this.state.plans.map((option, key) =>
                    <div className="col col-12 col-sm-12 col-md-4 col-lg-4 no-padding" key={key}>
                        <div className={"item-tab " + (parseInt(this.state.index) === key ? 'active' : '')}
                             onClick={(e) => {
                                 this.changeIndexPlan(key);
                             }}>
                            <span>{option.name}</span>
                            <p>$ 000.000</p>
                        </div>
                    </div>
                )}
            </div>
        )
    }

}

export default withRouter(Index);