import React, { Component } from 'react';

class PreBoilVolume extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      totalWaterVol: '',
      grainWeight: '',
    }
  }

  render() {
    const { calculator } = this.props;
    let vol = null;

    const handleInputChange = (e: any) => {
      const type = e.target.name;
      this.setState({[type]: e.target.value});
    }

    const results = () => {
      const result = calculator(this.state.totalWaterVol, this.state.grainWeight);
       if (!isNaN(result) && isFinite(result) && result > 0) {
         vol = 'gal';
         return result;
       }
    }

    return (
      <div>
        <h2>Pre-Boil Volume</h2>
        <div>
          <label htmlFor="totalWaterVol">Total Water Volume</label><br />
          <input
            name="totalWaterVol"
            type="number"
            value={this.state.totalWaterVol}
            onChange={handleInputChange}
          ></input><br />
          <label htmlFor="grainWeight">Malt Weight (lbs)</label><br />
          <input
            name="grainWeight"
            type="number"
            value={this.state.grainWeight}
            onChange={handleInputChange}
          ></input><br />
        </div>
        <div>
          <h3>Result:</h3>
          <p className="result">{results()} <label>{vol}</label></p>
        </div>
      </div>
    );
  }
}

export default PreBoilVolume;
