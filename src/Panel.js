import React, { PureComponent } from "react";

export default class Panel extends PureComponent {
  render() {
    const { title, setValue, values, sliders } = this.props;
    return (
      <>
        <h2>{title}</h2>
        <table
          style={{
            fontFamily: "sans-serif",
            backgroundColor: "#eee",
            padding: "10px"
          }}
        >
          <thead>
            <tr>
              <th>Name</th>
              <th>Slider</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {sliders.map((sliderOpt, i) => {
              const { name, min, max, step } = sliderOpt;
              const value = values[name];
              return (
                <tr key={i}>
                  <td>{name}</td>
                  <td>
                    <input
                      type="range"
                      name={name}
                      min={min}
                      max={max}
                      step={step}
                      value={value}
                      onChange={e =>
                        setValue(name, parseInt(e.target.value, 10))
                      }
                    />
                  </td>
                  <td style={{ textAlign: "right" }}>{value}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </>
    );
  }
}
