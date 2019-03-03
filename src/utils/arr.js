
export function flatMap(arr, mapper) {
  return arr.reduce(
    (acc, item, index, arr) => [...acc, ...mapper(item, index, arr)],
    []
  );
}