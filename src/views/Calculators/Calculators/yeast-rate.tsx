import React, { Component } from 'react';

class YeastPitchingRate extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      og: '',
      volume: '',
      type: 'liquid',
      number: '',
      date: '',
      grams: '',
      cells: '',
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
      const result = calculator(this.state.type, Number(this.state.cells), Number(this.state.number), this.state.date);
      if (!isNaN(result) && isFinite(result) && result > 0) {
        label = 'billion cells';
        return result;
      } else {
        label = '';
      }
    }

    return (
      <div>
        <h2>Total Yeast Cells</h2>
        <div>
          <label htmlFor="type">Yeast Type</label><br />
          <select
            name="type"
            value={this.state.target}
            onChange={handleInputChange}
          >
            <option value="liquid">Liquid (pack/vial)</option>
            <option value="dry">Dry</option>
          </select><br />
          {this.state.type === 'liquid' &&
            <div>
              <label htmlFor="number">Number of Liquid Packs</label><br />
              <input
                name="number"
                type="number"
                value={this.state.number}
                onChange={handleInputChange}
              ></input><br />
              <label htmlFor="cells">Cell Count</label><br />
              <input
                name="cells"
                type="number"
                value={this.state.cells}
                onChange={handleInputChange}
              ></input><br />
              <label htmlFor="date">Manufactured Date</label><br />
              <input
                name="date"
                type="date"
                value={this.state.date}
                onChange={handleInputChange}
              ></input><br />
            </div>
          }
          {this.state.type === 'dry' &&
            <div>
              <label htmlFor="number">Number of Dry Packs</label><br />
              <input
                name="number"
                type="number"
                value={this.state.number}
                onChange={handleInputChange}
              ></input><br />
              <label htmlFor="cells">Cell Count</label><br />
              <input
                name="cells"
                type="number"
                value={this.state.cells}
                onChange={handleInputChange}
              ></input><br />
            </div>
          }
        </div>
        <div>
          <h3>Result:</h3>
          <p className="result">{results()} <label>{label}</label></p>
        </div>
      </div>
    );
  }
}

export default YeastPitchingRate;
