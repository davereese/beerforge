import React, { Component } from 'react';

class FinalGravity extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      og: '',
      attenuation: '',
    }
  }

  render() {
    const { calculator } = this.props;

    const handleInputChange = (e: any) => {
      const type = e.target.name;
      this.setState({[type]: e.target.value});
    }

    const results = () => {
      const result = calculator(this.state.og, this.state.attenuation);
       return !isNaN(result) && isFinite(result) && result > 0 ? result : '';
    }

    return (
      <div>
        <h2>Final Gravity</h2>
        <div>
          <label htmlFor="og">Original Gravity</label><br />
          <input
            name="og"
            type="number"
            value={this.state.og}
            onChange={handleInputChange}
          ></input><br />
          <label htmlFor="attenuation">Attenuation (%)</label><br />
          <input
            name="attenuation"
            type="number"
            value={this.state.attenuation}
            onChange={handleInputChange}
          ></input>
        </div>
        <div>
          <h3>Result:</h3>
          <p className="result">{results()}</p>
        </div>
      </div>
    );
  }
}

export default FinalGravity;
