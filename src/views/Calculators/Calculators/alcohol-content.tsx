import React, { Component } from 'react';

class AlcoholContent extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      og: '',
      fg: '',
      formula: 'ABV',
    }
  }

  render() {
    const { calculator } = this.props;
    let alc = null;

    const handleInputChange = (e: any) => {
      const type = e.target.name;
      this.setState({[type]: e.target.value});
    }

    const handleCheckboxChange = (e: any) => {
      const value = this.state.formula === 'ABV' ? 'ABW' : 'ABV';
      this.setState({formula: value});
    }

    const ABVResults = () => {
      const result = calculator(this.state.og, this.state.fg, this.state.formula);
      if (!isNaN(result) && isFinite(result) && result > 0) {
        alc = this.state.formula;
        return result + '%';
      } else {
          return '';
      }
    }

    return (
      <div>
        <h2>Alcohol Content</h2>
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
          <input
            type="checkbox"
            id="abvFormula"
            name="formula"
            value={this.state.formula}
            onChange={handleCheckboxChange}
            className="toggle"
          ></input>
          <label htmlFor="abvFormula">ABV<span className="toggle"></span>ABW</label><br />
        </div>
        <div>
          <h3>Result:</h3>
          <p className="result">{ABVResults()} <label>{alc}</label></p>
        </div>
      </div>
    );
  }
}

export default AlcoholContent;
