import React, { Component } from 'react';

class TotalWater extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      batchSize: '',
      grainWeight: '',
      boilTime: '',
      boilOff: '',
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
      const result = calculator(parseInt(this.state.batchSize), parseInt(this.state.boilTime), parseInt(this.state.boilOff), parseInt(this.state.grainWeight));

       if (this.state.batchSize && this.state.boilTime && this.state.boilOff && this.state.grainWeight && !isNaN(result) && isFinite(result)) {
         label = 'gal';
         return result;
       }
    }

    return (
      <div>
        <h2>Total Water Needed</h2>
        <div>
          <label htmlFor="batchSize">Batch Size</label><br />
          <input
            name="batchSize"
            type="number"
            value={this.state.batchSize}
            onChange={handleInputChange}
          ></input><br />
          <label htmlFor="grainWeight">Malt Weight (lbs)</label><br />
          <input
            name="grainWeight"
            type="number"
            value={this.state.grainWeight}
            onChange={handleInputChange}
          ></input><br />
          <label htmlFor="boilTime">Boil Time (min)</label><br />
          <input
            name="boilTime"
            type="number"
            value={this.state.boilTime}
            onChange={handleInputChange}
          ></input><br />
          <label htmlFor="boilOff">Evaporation Rate %/hr</label><br />
          <input
            name="boilOff"
            type="number"
            value={this.state.boilOff}
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

export default TotalWater;
