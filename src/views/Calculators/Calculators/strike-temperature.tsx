import React, { Component } from 'react';

class StrikeTemperature extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      ratio: '',
      temp1: '',
      temp2: '',
      factor: '',
    }
  }

  render() {
    const { calculator } = this.props;
    let label = null;

    const handleInputChange = (e: any) => {
      const type = e.target.name;
      this.setState({[type]: e.target.value});
    }

    const results = () => {
      const result = calculator(this.state.temp1, this.state.temp2, this.state.ratio, this.state.factor);
      if (!isNaN(result) && isFinite(result) && result > 0) {
        label = '°F';
        return result;
      }
    }

    return (
      <div>
        <h2>Strike Water Temperature</h2>
        <div>
          <label htmlFor="ratio">Quarts per lb of grain</label><br />
          <input
            name="ratio"
            type="number"
            value={this.state.ratio}
            onChange={handleInputChange}
          ></input><br />
          <label htmlFor="temp1">Malt Temperature (°F)</label><br />
          <input
            name="temp1"
            type="number"
            value={this.state.temp1}
            onChange={handleInputChange}
          ></input><br />
          <label htmlFor="temp2">Target Temperature (°F)</label><br />
          <input
            name="temp2"
            type="number"
            value={this.state.temp2}
            onChange={handleInputChange}
          ></input><br />
          <label htmlFor="factor">Adjustment Factor</label><br />
          <input
            name="factor"
            type="number"
            value={this.state.factor}
            onChange={handleInputChange}
          ></input><br />
        </div>
        <div>
          <h3>Result:</h3>
          <p className="result">{results()} <label>{label}</label></p>
        </div>
      </div>
    );
  }
}

export default StrikeTemperature;
