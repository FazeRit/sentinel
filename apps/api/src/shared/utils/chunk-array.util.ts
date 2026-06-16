export function chunkArray<T>(array: Array<T>, size: number): Array<Array<T>> {
  const result: Array<Array<T>> = [];
  const length = array.length;

  for (let i = 0; i < length; i += size) {
    result.push(array.slice(i, i + size));
  }

  return result;
}
