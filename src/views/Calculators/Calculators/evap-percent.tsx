import React, { Component } from 'react';

class EvaporationPercent extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      postBoilV: '',
      preBoilV: '',
      boilTime: '',
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
      const result = calculator(this.state.postBoilV, this.state.preBoilV, this.state.boilTime);
      if (!isNaN(result) && isFinite(result) && result > 0) {
        label = '%';
        return result;
      }
    }

    return (
      <div>
        <h2>Evaporation %/hr</h2>
        <div>
          <label htmlFor="preBoilV">Pre-Boil volume</label><br />
          <input
            name="preBoilV"
            type="number"
            value={this.state.preBoilV}
            onChange={handleInputChange}
          ></input><br />
          <label htmlFor="postBoilV">Post-Boil volume</label><br />
          <input
            name="postBoilV"
            type="number"
            value={this.state.postBoilV}
            onChange={handleInputChange}
          ></input><br />
          <label htmlFor="boilTime">Boil Time (min)</label><br />
          <input
            name="boilTime"
            type="number"
            value={this.state.boilTime}
            onChange={handleInputChange}
          ></input><br />
        </div>
        <div>
          <h3>Result:</h3>
          <p className="result">{results()}<label>{label}</label></p>
        </div>
      </div>
    );
  }
}

export default EvaporationPercent;
