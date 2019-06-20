import React, { Component } from 'react';

class OriginalGravity extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      potential: '',
      weight: '',
      efficiency: '',
      volume: '',
    }
  }

  render() {
    const { calculator } = this.props;

    const handleInputChange = (e: any) => {
      const type = e.target.name;
      this.setState({[type]: e.target.value});
    }

    const results = () => {
      const result = calculator([{potential: this.state.potential, weight: this.state.weight}], this.state.efficiency, this.state.volume);
       return !isNaN(result) && isFinite(result) ? result : '';
    }

    return (
      <div>
        <h2>Original Gravity</h2>
        <div>
          <label htmlFor="potential">Malt Potential</label><br />
          <input
            name="potential"
            type="number"
            value={this.state.potential}
            onChange={handleInputChange}
          ></input><br />
          <label htmlFor="weight">Malt Weight (lbs)</label><br />
          <input
            name="weight"
            type="number"
            value={this.state.weight}
            onChange={handleInputChange}
          ></input><br />
          <label htmlFor="efficiency">Mash Efficiency (%)</label><br />
          <input
            name="efficiency"
            type="number"
            value={this.state.efficiency}
            onChange={handleInputChange}
          ></input><br />
          <label htmlFor="volume">Post-boil Volume (gal)</label><br />
          <input
            name="volume"
            type="number"
            value={this.state.volume}
            onChange={handleInputChange}
          ></input><br />
        </div>
        <div>
          <h3>Result:</h3>
          <p className="result">{results()}</p>
        </div>
      </div>
    );
  }
}

export default OriginalGravity;
