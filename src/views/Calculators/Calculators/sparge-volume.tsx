import React, { Component } from 'react';

class SpargeVolume extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      totalV: '',
      mashV: '',
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
      const result = calculator(this.state.totalV, this.state.mashV);
      if (!isNaN(result) && isFinite(result) && result > 0) {
        label = 'gal';
        return result;
      }
    }

    return (
      <div>
        <h2>Sparge Water Volume</h2>
        <div>
          <label htmlFor="totalV">Total water volume</label><br />
          <input
            name="totalV"
            type="number"
            value={this.state.totalV}
            onChange={handleInputChange}
          ></input><br />
          <label htmlFor="mashV">Mash water volume</label><br />
          <input
            name="mashV"
            type="number"
            value={this.state.mashV}
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

export default SpargeVolume;
