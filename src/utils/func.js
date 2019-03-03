export function compose(...funcs) {
  return funcs.reduce((composed, f) => (...args) => composed(f(...args)));
}
