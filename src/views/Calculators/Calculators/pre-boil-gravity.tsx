import React, { Component } from 'react';

class PreBoilGravity extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      og: '',
      volume: '',
      grainVol: '',
      totalWaterVol: '',
    }
  }

  render() {
    const { calculator } = this.props;

    const handleInputChange = (e: any) => {
      const type = e.target.name;
      this.setState({[type]: e.target.value});
    }

    const results = () => {
      const result = calculator(this.state.og, this.state.grainVol, this.state.totalWaterVol, this.state.volume);
       return !isNaN(result) && isFinite(result) && result > 1 ? result : '';
    }

    return (
      <div>
        <h2>Pre-Boil Gravity</h2>
        <div>
        <label htmlFor="grainVol">Malt Weight (lbs)</label><br />
          <input
            name="grainVol"
            type="number"
            value={this.state.grainVol}
            onChange={handleInputChange}
          ></input><br />
          <label htmlFor="totalWaterVol">Total Water Volume</label><br />
          <input
            name="totalWaterVol"
            type="number"
            value={this.state.totalWaterVol}
            onChange={handleInputChange}
          ></input><br />
          <label htmlFor="volume">Post-boil Volume (gal)</label><br />
          <input
            name="volume"
            type="number"
            value={this.state.volume}
            onChange={handleInputChange}
          ></input><br />
          <label htmlFor="og">Original Gravity</label><br />
          <input
            name="og"
            type="number"
            value={this.state.og}
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

export default PreBoilGravity;
