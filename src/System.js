import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import { delay } from "./utils/time";

function flatMap(arr, mapper) {
  return arr.reduce(
    (acc, item, index, arr) => [...acc, ...mapper(item, index, arr)],
    []
  );
}

export default class System extends Component {
  static defaultProps = {
    showPanel: true,
    panelWidth: 500,
    title: "CircleDots",
    autoPlay: true,
    sliders: [],
    indices: []
  };

  constructor(props) {
    super(props);
    this.state = {
      _elapsed: 0,
      time: 0,
      playing: props.autoPlay,
      ...props.sliders.reduce(
        (values, opt) => ({
          ...values,
          [opt.name]: opt.defaultValue || opt.min || opt.max || 0
        }),
        {}
      )
    };

    this._isMounted = false;
  }

  tick = () => {
    const { playing } = this.state;
    if (this._isMounted && playing) {
      this.setState(prev => {
        const _elapsed = Date.now() - this.initial;
        return {
          time: prev.time + (_elapsed - prev._elapsed),
          _elapsed
        };
      });
      requestAnimationFrame(this.tick);
    }
  };

  componentDidMount() {
    this.initial = Date.now();
    this._isMounted = true;
    this.tick();
    this.setState({
      _panelEl:
        this.props.panelId && document.getElementById(this.props.panelId)
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  setValue = (name, value) => {
    this.setState({
      [name]: value
    });
  };

  getValue = name => {
    return this.state[name];
  };

  render() {
    const { render, sliders, indices } = this.props;
    const { _panelEl, time } = this.state;

    const elOpts = indices.reduce(
      (elOpts, idxOpt) => {
        return flatMap(elOpts, elOpt => {
          return new Array(idxOpt.num).fill(null).map((_, index) => ({
            ...elOpt,
            [idxOpt.name]: index,
            time: delay(elOpt.time, idxOpt.delay * index)
          }));
        });
      },
      [{ time }]
    );
    // for (const idx of _indices) {
    //   const name = idx.name;
    //   const delay = idx.delay || 0;
    //   const value = 2; // FIXME
    //   elOpts = flatMap(elOpts, (elOpt, index) => {
    //     return new Array(value).fill(null).map(() => ({
    //       ...elOpt,
    //       [name]: index,
    //       time: elOpt.time + delay * index
    //     }));
    //   });
    // }
    return (
      <>
        {_panelEl &&
          ReactDOM.createPortal(
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
                {sliders.map((sliderOption, i) => {
                  const { name, min, max, step } = sliderOption;
                  const value = this.getValue(name);
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
                            this.setValue(name, parseInt(e.target.value, 10))
                          }
                        />
                      </td>
                      <td style={{ textAlign: "right" }}>{value}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>,
            _panelEl
          )}
        {elOpts.map((elOpt, index) => (
          <Fragment key={index}>{render({ ...this.state, ...elOpt })}</Fragment>
        ))}
      </>
    );
  }
}

export function withSystem(options = {}) {
  return WrappedComponent => props => {
    return (
      <System
        {...options}
        render={value => <WrappedComponent {...props} {...value} />}
      />
    );
  };
}
