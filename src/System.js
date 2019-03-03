import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import { delay } from "./utils/time";
import { flatMap } from "./utils/arr";
import Panel from "./Panel";

export default class System extends Component {
  static defaultProps = {
    title: "Sliders",
    showPanel: true,
    panelWidth: 500,
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
      values: props.sliders.reduce(
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

    const { panelId } = this.props;
    if (panelId) {
      const parentEl = document.getElementById(this.props.panelId);
      if (parentEl) {
        const _panelEl = document.createElement("div");
        parentEl.appendChild(_panelEl);
        this.setState({
          _panelEl
        });
      }
    }
  }

  componentWillUnmount() {
    this._isMounted = false;

    const { _panelEl } = this.state;
    if (_panelEl) {
      _panelEl.parentNode.removeChild(_panelEl);
    }
  }

  setValue = (name, value) => {
    this.setState(prev => ({
      ...prev,
      values: {
        ...prev.values,
        [name]: value
      }
    }));
  };

  render() {
    const { title, render, sliders, indices } = this.props;
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
    return (
      <>
        {_panelEl &&
          ReactDOM.createPortal(
            <Panel
              title={title}
              setValue={this.setValue}
              sliders={sliders}
              values={this.state.values}
            />,
            _panelEl
          )}
        {elOpts.map((elOpt, index) => (
          <Fragment key={index}>
            {render({ ...this.state, ...this.state.values, ...elOpt })}
          </Fragment>
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
