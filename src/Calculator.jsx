/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';

function calculateResult(operand, operator) {
  switch (operator) {
    case '+':
      return +operand[0] + +operand[1];
    case '-':
      return +operand[0] - +operand[1];
    case 'X':
      return +operand[0] * +operand[1];
    case '/':
      return Math.floor(+operand[0] / +operand[1]);
    default:
      return '오류';
  }
}
export default class Calculator extends Component {
  constructor() {
    super();

    this.state = {
      operand: ['0', ''],
      operator: '',
      index: 0,
    };
  }

  componentDidMount() {
    const localState = JSON.parse(localStorage.getItem('state'));

    if (localState) {
      this.setState({
        operand: localState.operand,
        operator: localState.operator,
        index: localState.index,
      });
    }

    window.addEventListener('beforeunload', this.handleBeforeUnload);
    window.addEventListener('unload', this.handleUnload);
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
    window.removeEventListener('unload', this.handleUnload);
  }

  handleBeforeUnload(event) {
    event.preventDefault();
    event.returnValue = '';
  }

  handleUnload = () => {
    localStorage.setItem('state', JSON.stringify(this.state));
  };

  handleClickDigit(digit) {
    if (this.state.operand[0] === '오류') {
      alert('오류입니다. AC를 눌러 값을 초기화해주세요.');
      return;
    }

    if (+(this.state.operand[this.state.index] + digit) >= 1000) {
      alert('숫자는 한번에 최대 3자리 수까지 입력 가능합니다.');
      return;
    }

    switch (this.state.index) {
      case 0:
        this.setState(prevState => ({
          operand: [String(+(prevState.operand[0] + digit)), ''],
        }));
        break;

      case 1:
        this.setState(prevState => ({
          operand: [String(+prevState.operand[0]), String(+(prevState.operand[1] + digit))],
        }));
        break;

      default:
        break;
    }
  }

  handleClickOperation(operator) {
    if (this.state.operand[0] === '오류') {
      alert('오류입니다. AC를 눌러 값을 초기화해주세요.');
      return;
    }

    if (operator === '=') {
      this.calculate(this.state.operand, this.state.operator);
      return;
    }

    if (this.state.operator) {
      return;
    }

    this.setState({
      operator,
      index: 1,
    });
  }

  handleClickModifier() {
    this.setState({
      operand: ['0', ''],
      operator: '',
      index: 0,
    });
  }

  calculate(operand, operator) {
    if (!this.state.operator) {
      return;
    }

    const result = calculateResult(operand, operator);

    if (result === Infinity) {
      this.setState({
        operand: ['오류', ''],
        operator: '',
      });

      return;
    }

    this.setState({
      operand: [String(result), ''],
      operator: '',
      index: 0,
    });
  }

  renderDigit(i) {
    return (
      <button className="digit" type="button" onClick={this.handleClickDigit.bind(this, i)}>
        {i}
      </button>
    );
  }

  renderModifier() {
    return (
      <button type="button" className="modifier" onClick={this.handleClickModifier.bind(this)}>
        AC
      </button>
    );
  }

  renderResult() {
    return (
      <h1 id="total">
        {this.state.operand[0]}
        {this.state.operator}
        {this.state.operand[1]}
      </h1>
    );
  }

  renderOperation(operation) {
    return (
      <button
        type="button"
        className="operation"
        onClick={this.handleClickOperation.bind(this, operation)}
      >
        {operation}
      </button>
    );
  }

  render() {
    console.log(this.state);

    return (
      <div className="calculator">
        {this.renderResult()}
        <div className="digits flex">
          {this.renderDigit('9')}
          {this.renderDigit('8')}
          {this.renderDigit('7')}
          {this.renderDigit('6')}
          {this.renderDigit('5')}
          {this.renderDigit('4')}
          {this.renderDigit('3')}
          {this.renderDigit('2')}
          {this.renderDigit('1')}
          {this.renderDigit('0')}
        </div>
        <div className="modifiers subgrid">{this.renderModifier()}</div>
        <div className="operations subgrid">
          {this.renderOperation('/')}
          {this.renderOperation('X')}
          {this.renderOperation('-')}
          {this.renderOperation('+')}
          {this.renderOperation('=')}
        </div>
      </div>
    );
  }
}
