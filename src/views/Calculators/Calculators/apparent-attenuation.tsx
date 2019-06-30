import React, { Component } from 'react';

class ApparentAttenuation extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      og: '',
      fg: '',
    }
  }

  render() {
    const { calculator } = this.props;
    let atten = null;

    const handleInputChange = (e: any) => {
      const type = e.target.name;
      this.setState({[type]: e.target.value});
    }

    const attenuationResults = () => {
      const result = calculator(this.state.og, this.state.fg);
      if (!isNaN(result) && isFinite(result) && result > 0 && result <= 100) {
        atten = '%';
        return result;
      }
    }

    return (
      <div>
        <h2>Apparent Attenuation</h2>
        <div>
          <label htmlFor="og">Original Gravity</label><br />
          <input
            name="og"
            type="number"
            value={this.state.og}
            onChange={handleInputChange}
          ></input><br />
          <label htmlFor="fg">Final Gravity</label><br />
          <input
            name="fg"
            type="number"
            value={this.state.fg}
            onChange={handleInputChange}
          ></input><br />
        </div>
        <div>
          <h3>Result:</h3>
          <p className="result">{attenuationResults()}<label>{atten}</label></p>
        </div>
      </div>
    );
  }
}

export default ApparentAttenuation;
