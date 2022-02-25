import React, { Component } from 'react';
import classNames from 'classnames';

import store from '../../../../../store';
import { saveInmuebleValue } from '../../../../../actions';

import { connect } from 'react-redux';
import questions from './questions';

class OtherQuestions extends Component {
  static nameModel = 'other_questions';
  static nameModelValue = 'other_questions_value';
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      error: false,
      show: false,
      errorValue: 0,
    };
  }
  /**
   *
   *
   * @static
   * @param {{ id:number, value: boolean }[]} v
   * @returns
   * @memberof OtherQuestions
   */
  static invalidField(v = []) {
    const invalidQuestion = questions.find((question) => {
      const item = v.find(({ id }) => id === question.id);
      return !question.validValues.some(
        (validValue) => item && item.value === validValue
      );
    });
    return invalidQuestion;
  }
  /**
   *
   *
   * @static
   * @param {{ id:number, value: boolean }[]} v
   * @returns
   * @memberof OtherQuestions
   */
  static validateField(v) {
    const valid = !OtherQuestions.invalidField(v);
    return valid;
  }

  static unansweredQuestions(v) {
    return questions.length - ((v && v.length) || 0);
  }

  changeValue = (value) => {
    store.dispatch(
      saveInmuebleValue({
        name: OtherQuestions.nameModelValue,
        value,
      })
    );
  };

  getQuestions = () => {
    const questionsValue = new Map();
    const { value } = this.props;
    if (value instanceof Array)
      value.forEach(({ id, value: questionValue }) =>
        questionsValue.set(id, questionValue)
      );
    return questionsValue;
  };

  mapQuestions = (questionsValue) => {
    const newQuestions = [];
    questionsValue.forEach((value, id) => {
      newQuestions.push({ id, value });
    });
    return newQuestions;
  };

  setQuestion = (id, value) => {
    const questionsValue = this.getQuestions();
    questionsValue.set(id, value);
    this.changeValue(this.mapQuestions(questionsValue));
  };

  render() {
    const { validate } = this.props;
    const value = this.getQuestions();
    return (
      <div className="row">
        <div className="col col-12">
          <h5 className="mt-4">Otras preguntas</h5>
        </div>
        <div className="col col-12">
          <div className={OtherQuestions.nameModel + ' no-icon form-group '}>
            {questions.map((question) => {
              const active = value.get(question.id);
              const error = validate && active === undefined;
              return (
                <React.Fragment key={question.id}>
                  {question.message}
                  <ul className={classNames('select-item', error && 'error')}>
                    <li
                      className={classNames(active && 'active')}
                      onClick={() => this.setQuestion(question.id, true)}
                    >
                      Si
                    </li>
                    <li
                      className={classNames(active === false && 'active')}
                      onClick={() => this.setQuestion(question.id, false)}
                    >
                      No
                    </li>
                  </ul>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(({ Inmueble }) => {
  const { validate } = Inmueble;
  const { nameModel, nameModelValue } = OtherQuestions;
  let active = Inmueble[nameModel];
  let value = Inmueble[nameModelValue];
  return { active, value, validate };
})(OtherQuestions);
