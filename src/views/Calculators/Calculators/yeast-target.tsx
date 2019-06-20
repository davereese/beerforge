import React, { Component } from 'react';

class YeastTargetPitchingRate extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      og: '',
      volume: '',
      target: '0.75',
    }
  }

  render() {
    const { calculator } = this.props;
    let label = '';

    const handleInputChange = (e: any) => {
      const type = e.target.name;
      this.setState({[type]: e.target.value});
    }

    const results = () => {
      const result = calculator(this.state.og, this.state.volume, this.state.target);
      if (!isNaN(result) && isFinite(result) && result > 0) {
        label = 'billion cells';
        return result;
      } else {
        label = '';
      }
    }

    return (
      <div>
        <h2>Target Yeast<br />Pitching Rate</h2>
        <div>
          <label htmlFor="og">Original Gravity</label><br />
          <input
            name="og"
            type="number"
            value={this.state.og}
            onChange={handleInputChange}
          ></input><br />
          <label htmlFor="volume">Volume</label><br />
          <input
            name="volume"
            type="number"
            value={this.state.volume}
            onChange={handleInputChange}
          ></input><br />
          <label htmlFor="target">Target Rate<br />(million cells / ml / °Plato)</label><br />
          <select
            name="target"
            value={this.state.target}
            onChange={handleInputChange}
          >
            <option value="0.35">0.35 (Mfr. rate for Ale)</option>
            <option value="0.5">0.5 (Mfr. rate for Ale)</option>
            <option value="0.75">0.75 (Ale)</option>
            <option value="1.0">1.0 (Ale)</option>
            <option value="1.25">1.25 (High OG Ale)</option>
            <option value="1.5">1.5 (Lager)</option>
            <option value="1.75">1.75 (Lager)</option>
            <option value="2.0">2.0 (High OG Lager)</option>
          </select><br />
        </div>
        <div>
          <h3>Result:</h3>
          <p className="result">{results()} <label>{label}</label></p>
        </div>
      </div>
    );
  }
}

export default YeastTargetPitchingRate;
