const filter = (arr, filterFunc) => {
  const filtered = [];
  for (let i = 0; i < arr.length; i++) {
    if (filterFunc(arr[i], i, arr)) {
      filtered.push(arr[i]);
    }
  }
};

const map = (arr, mapFunc) => {
  const mapped = [];
  for (let i = 0; i < arr.length; i++) {
    filtered.push(mapFunc(arr[i], i, arr));
  }
};

export {
  filter,
  map
}