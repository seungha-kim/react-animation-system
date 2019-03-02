import React from "react";
import ReactDOM from "react-dom";

// TODO: Slider
function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <Time />
    </div>
  );
}

const { Provider, Consumer: SystemConsumer } = React.createContext(null);

class SystemProvider extends React.Component {
  constructor(props) {
    super(props);
    const addPanel = ({
      label = "No name",
      name = "",
      min = 0,
      max = 10,
      step = 1,
      defaultValue = 0
    } = {}) => {
      this.setState(prev => ({
        panels: [
          ...prev.panels,
          {
            label,
            name,
            min,
            max,
            step,
            defaultValue
          }
        ]
      }));
    };
    const setValue = (name, value) => {
      this.setState(prev => ({
        values: {
          ...prev.values,
          [name]: value
        }
      }));
    };
    this.state = {
      panels: [],
      addPanel,
      setValue
    };
  }
  render() {
    return <Provider value={this.state}>{this.props.children}</Provider>;
  }
}

function withSystem(WrappedComponent) {
  return props => {
    return (
      <SystemConsumer>
        {value => <WrappedComponent {...props} {...value} />}
      </SystemConsumer>
    );
  };
}

const Time = animate(({ time }) => {
  const period = Math.PI / 50;
  return (
    <div style={{ position: "relative" }}>
      {new Array(30).fill(null).map((_, i) => {
        const localTime = delay(time / 10, 10 * i);
        const f = Math.sin(localTime * period) + period;
        return (
          <div
            key={i}
            style={{
              display: "inline-block",
              position: "relative",
              width: "10px",
              height: "10px",
              backgroundColor: "red",
              top: `${f * 10}px`
            }}
          />
        );
      })}
    </div>
  );
});

// const Time = animate(({ time }) => {
//   return <div>{time}</div>;
// });

function animate(WrappedComponent) {
  return function Animate(props) {
    return (
      <Animator
        render={({ time }) => <WrappedComponent {...props} time={time} />}
      />
    );
  };
}

class Animator extends React.Component {
  state = {
    time: 0
  };

  _isMounted = false;

  tick = () => {
    if (this._isMounted) {
      this.setState({
        time: Date.now() - this.initial
      });
      requestAnimationFrame(this.tick);
    }
  };

  componentDidMount() {
    this.initial = Date.now();
    this._isMounted = true;
    this.tick();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { time } = this.state;
    const render = this.props.render;
    return <React.Fragment>{render({ time })}</React.Fragment>;
  }
}

// hook X withIndex 훅으로 안됨.
// 이렇게 쓸 수 있는, 이러면서도 성능 좋은
// svg에도 will-change 같은게 있나?
// const MyAnimation = compose(
//   withPanel({ title: 'CircleDots', hidden: false, panelWidth: 500 }),
//   withAnimation({ autoPlay: true }), // -> autoplay, pause, 속도조절, rewind
//   withSlider({
//     label: 'Num of Dots',
//     name: 'numDots',
//     min: 1,
//     max: 10,
//     step: 1,
//     default: 5,
//   }),
//   map 쓰는거 어려우니까...
//   withIndex({ name: 'row', num: 10, delay: 100, converter: (props, index) => newProps })
//   withIndex({ name: 'col', num: 10, delay: 100})
// )(props => {
//   return ...
// })

// 삼각함수의 용도
// 파동
// 회전
// easing

// 절대값, 올림, 내림
// 펄린 노이즈
// https://github.com/josephg/noisejs

function delay(time, delay) {
  return Math.max(0, time - delay);
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
