import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
//Component
import store from '../../../../store';
import {
  AllPlans as AllPlansCreator,
  indexPlanSelected,
  setLoadingPlanPerspective,
} from '../../../../store/actions';
import Sticky from '../../../../common/helpers/sticky/Sticky';
import Masknumbermoney from '../../../../common/helpers/masknumbermoney/Masknumbermoney';
import Loading from '../../../globals/loading/Loading';
import CreateOrUpdateValoration from '../../../../services/CreateOrUpdateValoration';
import BtnContinue from '../forms/btncontinue/BtnContinue';
import DeterminePolizaPrima from '../../../../services/DeterminePolizaPrima';
import Coberturas from '../coberturas/Coberturas';
import { connect } from 'react-redux';

class Index extends Component {
  /**
   * @param {any[]} plans
   */
  static async sendAndValidate(plans, index, id, refrechAllPlans = false) {
    Loading.toggle(true);
    try {
      await CreateOrUpdateValoration.save();
      await this.refrechPolizaPrima(plans[index], {
        planSelected: index,
        quotateId: id,
      });
      if (refrechAllPlans) {
        const otherPlans = [...plans.keys()].filter(
          (key) => String(key) !== String(index)
        );
        const newPlans = plans.map((plan) =>
          Coberturas.calcValue({ ...Coberturas.setHiredCoverages(plan) })
        );
        for (const plan of otherPlans) {
          this.refrechPolizaPrima(newPlans[plan], {
            planSelected: plan,
            quotateId: id,
          }).catch((e) => {
            console.log(e);
          });
        }
      }
    } catch (error) {
      Loading.toggle(false);
      throw error;
    }
    Loading.toggle(false);
  }

  static async refrechPolizaPrima(plan, { planSelected: i, quotateId }) {
    const newPlan = BtnContinue.toNumberCoverrange(plan);
    await store.dispatch(setLoadingPlanPerspective({ plan: i, state: true }));
    await DeterminePolizaPrima.get(newPlan, quotateId, false)
      .then((total) => {
        store.dispatch((dispatch, getState) => {
          // The last value of the plans is obtained
          const { AllPlans } = getState();
          if (typeof total.prospect !== 'undefined') {
            AllPlans[i].value = total.prospect;
            AllPlans[i].prima = total;
            dispatch(AllPlansCreator(AllPlans));
          }
        });
      })
      .finally(() => {
        store.dispatch(setLoadingPlanPerspective({ plan: i, state: false }));
      });
  }

  componentDidMount() {
    this.sticky = new Sticky('wrapper-tabs');
  }

  componentWillUnmount() {
    if (this.sticky) this.sticky.destroy();
  }

  changeIndexPlan = (newIndex) => async (e) => {
    const {
      match: { params },
    } = this.props;
    let plan;
    await store.dispatch((dispatch) => {
      dispatch(indexPlanSelected(newIndex));
      let storeState = store.getState();
      let plans = storeState.AllPlans;
      plan = Coberturas.setHiredCoverages(plans[newIndex]);
      plan = Coberturas.calcValue(plan);
      plans[newIndex] = plan;
      dispatch(AllPlansCreator(plans));
      return Promise.resolve();
    });
    if (plan) {
      Index.refrechPolizaPrima(plan, {
        planSelected: newIndex,
        quotateId: params.id,
      });
    }
  };

  render() {
    const { loadingPlansPerspective, plans, index } = this.props;
    return (
      <div className="wrapper-tabs">
        <div className="row tabs text-center">
          {typeof plans !== 'undefined' &&
            plans.map((option, key) => {
              const loading = !!loadingPlansPerspective[key];
              const active = +index === key;
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

export default withRouter(
  connect(({ loadingPlansPerspective, indexPlan, AllPlans }) => ({
    loadingPlansPerspective,
    index: indexPlan,
    plans: AllPlans,
  }))(Index)
);
