import React, { Component } from 'react';

class StrikeVolume extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      ratio: '',
      weight: '',
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
      const result = calculator(this.state.weight, this.state.ratio);
      if (!isNaN(result) && isFinite(result) && result > 0) {
        label = 'gal';
        return result;
      }
    }

    return (
      <div>
        <h2>Strike Water Volume</h2>
        <div>
          <label htmlFor="weight">Malt Weight (lbs)</label><br />
          <input
            name="weight"
            type="number"
            value={this.state.weight}
            onChange={handleInputChange}
          ></input><br />
          <label htmlFor="ratio">Quarts per lb of grain</label><br />
          <input
            name="ratio"
            type="number"
            value={this.state.ratio}
            onChange={handleInputChange}
          ></input>
        </div>
        <div>
          <h3>Result:</h3>
          <p className="result">{results()} <label>{label}</label></p>
        </div>
      </div>
    );
  }
}

export default StrikeVolume;
