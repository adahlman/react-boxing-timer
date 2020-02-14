export function leadingZero(number) {
  return number < 10 ? "0" + number : number;
}

export function lookup(value, toSearch) {
  let keys = Object.keys(toSearch);
  console.log(keys[value - 1]);
}
