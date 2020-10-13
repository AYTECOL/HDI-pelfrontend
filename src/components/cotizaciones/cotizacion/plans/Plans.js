import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
//Component
import store from "../../../../store";
import {AllPlans as AllPlansCreator, indexPlanSelected, setLoadingPlanPerspective} from "../../../../actions";
import Sticky from "../../../../common/helpers/sticky/Sticky";
import Masknumbermoney from "../../../../common/helpers/masknumbermoney/Masknumbermoney";
import Loading from "../../../globals/loading/Loading";
import CreateOrUpdateValoration from "../../../../services/CreateOrUpdateValoration";
import BtnContinue from "../forms/btncontinue/BtnContinue";
import DeterminePolizaPrima from "../../../../services/DeterminePolizaPrima";
import Coberturas from "../coberturas/Coberturas";
import { compose } from 'recompose';
import { connect } from 'react-redux';

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

    /**
     * @param {any[]} plans
     */
    static async sendAndValidate(plans, index, id, refrechAllPlans = false) {
        Loading.toggle(true);
        await CreateOrUpdateValoration.save();
        await this.refrechPolizaPrima(plans, { planSelected: index, quotateId: id });
        Loading.toggle(false);
        if (refrechAllPlans) {
          const otherPlans = [...plans.keys()].filter(
            (key) => String(key) !== String(index)
          );
          const newPlans = plans.map((plan) =>
            Coberturas.calcValue({ ...plan })
          );
          for (const plan of otherPlans) {
            this.refrechPolizaPrima(newPlans, {
              planSelected: plan,
              quotateId: id,
            }).catch((e) => {
              console.log(e);
            });
          }
        }
    }

    static async refrechPolizaPrima(plans, { planSelected: i, quotateId }) {
        let plan = plans[i];
        plan = BtnContinue.toNumberCoverrange(plan);
        store.dispatch(setLoadingPlanPerspective({ plan: i, state: true }));
        let total = await DeterminePolizaPrima.get(plan, quotateId, false);
        store.dispatch(setLoadingPlanPerspective({ plan: i, state: false }));
        if (typeof total.prospect !== "undefined") {
            plans[i].value = total.prospect;
            plans[i].prima = total;
            store.dispatch(AllPlansCreator(plans));
        }
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
        let storeState = store.getState();
        let plans = storeState.AllPlans;
        plans[index] = Coberturas.calcValue(plans[index]);
        store.dispatch(AllPlansCreator(plans));
    };

    render() {
        const { loadingPlansPerspective } = this.props;
        return (
          <div className="wrapper-tabs">
            <div className="row tabs text-center">
              {typeof this.state.plans !== 'undefined' &&
                this.state.plans.map((option, key) => {
                  const loading = !!loadingPlansPerspective[key];
                  const active = parseInt(this.state.index) === key;
                  return (
                    <div
                      className="col col-12 col-sm-12 col-md-4 col-lg-4 no-padding"
                      key={key}
                    >
                      <div
                        className={'item-tab ' + (active ? 'active' : '')}
                        onClick={this.changeIndexPlan(key)}
                      >
                        <span>{option.name}</span>
                        {(!loading && (
                          <p>
                            {typeof option.value === 'undefined'
                              ? '$0'
                              : Masknumbermoney.formatToMask(option.value)}
                          </p>
                        )) || (
                          <div className="d-block text-center mt-1">
                            <div
                              className="spinner-border tab-loading"
                              role="status"
                            >
                              <span className="sr-only">Loading...</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        );
    }

}

export default compose(
  withRouter,
  connect(({ loadingPlansPerspective }) => ({ loadingPlansPerspective }))
)(Index);
