import React, { Component } from 'react';

class SRM extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      color: '',
      weight: '',
      volume: '',
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
      const result = calculator([{lovibond: this.state.color, weight: this.state.weight}], this.state.volume);
      if (!isNaN(result) && isFinite(result) && result > 0) {
        label = 'SRM';
        return result;
      } else {
          return '';
      }
    }

    return (
      <div>
        <h2>Beer Color</h2>
        <div>
          <label htmlFor="color">Malt Color</label><br />
          <input
            name="color"
            type="number"
            value={this.state.color}
            onChange={handleInputChange}
          ></input><br />
          <label htmlFor="weight">Malt Weight (lbs)</label><br />
          <input
            name="weight"
            type="number"
            value={this.state.weight}
            onChange={handleInputChange}
          ></input><br />
          <label htmlFor="volume">Final Volume (gal)</label><br />
          <input
            name="volume"
            type="number"
            value={this.state.volume}
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

export default SRM;
