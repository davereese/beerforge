import React, { Component } from 'react';

class CO2 extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      temp: '',
      beerVol: '',
      co2Vol: '',
      method: 'cornSugar',
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
      const result = calculator(this.state.temp, this.state.co2Vol, this.state.method, this.state.beerVol);
      if (!isNaN(result) && isFinite(result) && result > 0) {
        label = this.state.method === 'forced' ? 'psi' : 'oz';
        return result;
      } else {
        return '';
      }
    }

    return (
      <div>
        <h2>Carbonation</h2>
        <div>
          <label htmlFor="method">Carbonation Method</label><br />
          <select
            name="method"
            value={this.state.method}
            onChange={handleInputChange}
          >
            <option value="cornSugar">Corn Sugar</option>
            <option value="caneSugar">Cane Sugar</option>
            <option value="dme">DME</option>
            <option value="forced">Forced/Kegged</option>
          </select><br />
          <label htmlFor="beerVol">Beer Volume</label><br />
          <input
            name="beerVol"
            type="number"
            value={this.state.beerVol}
            onChange={handleInputChange}
          ></input><br />
          <label htmlFor="co2Vol">CO2 Target Volume</label><br />
          <input
            name="co2Vol"
            type="number"
            value={this.state.co2Vol}
            onChange={handleInputChange}
          ></input><br />
          <label htmlFor="temp">Temperature</label><br />
          <input
            name="temp"
            type="number"
            value={this.state.temp}
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

export default CO2;
