import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
//Component
import store from "../../../../store";
import {AllPlans as AllPlansCreator, indexPlanSelected} from "../../../../actions";
import Sticky from "../../../../common/helpers/sticky/Sticky";
import Masknumbermoney from "../../../../common/helpers/masknumbermoney/Masknumbermoney";
import Loading from "../../../globals/loading/Loading";
import CreateOrUpdateValoration from "../../../../services/CreateOrUpdateValoration";
import BtnContinue from "../forms/btncontinue/BtnContinue";
import DeterminePolizaPrima from "../../../../services/DeterminePolizaPrima";
import Coberturas from "../coberturas/Coberturas";

class Index extends Component {

    constructor(props) {
        super(props);
        this.state = {
            step: parseInt(this.props.match.params.step),
            plans: [],
            index: 1,
        };
        for (let i = 0; i < 3; i++) this.state.plans[i] = {name: "------"};
    }

    componentDidMount() {
        new Sticky("wrapper-tabs");
        this.unsubscribe = store.subscribe(() => {
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

    componentWillUnmount() {
        this.unsubscribe();
    }

    changeIndexPlan = index => e => {
        store.dispatch(indexPlanSelected(index));
    };

    static async sendAndValidate(plans, index, id) {
        Loading.toggle(true);
        await CreateOrUpdateValoration.save();
        let plan = plans[index];
        plan = Coberturas.calcValue(plan);
        plan = BtnContinue.toNumberCoverrange(plan);

        if( typeof plans[index].coverages[0].values[0] !== "undefined" ){
            console.log(plans[index].coverages[0].values[0].value_show);
        }
        let total = await DeterminePolizaPrima.get(plan, id);
        if (typeof total.prospect !== "undefined") {
            plans[index].value = total.prospect;
            plans[index].prima = total;
            store.dispatch(AllPlansCreator(plans));
        }
        Loading.toggle(false);
    }

    render() {
        return (
            <div className="wrapper-tabs">
                <div className="row tabs text-center">
                    {typeof this.state.plans !== "undefined" && this.state.plans.map((option, key) =>
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