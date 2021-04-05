export function textToTime(text: string): number {
  const _array = text.split(':');

  const functions = {
    1: (_l: string[]) => Number(_l[0]),
    2: (_l: string[]) => Number(_l[0]) * 60 + Number(_l[1]),
    3: (_l: string[]) =>
      Number(_l[0]) * 60 * 60 + Number(_l[1]) * 60 + Number(_l[2]),
    4: (_l: string[]) =>
      Number(_l[0]) * 60 * 60 * 60 +
      Number(_l[1]) * 60 * 60 +
      Number(_l[2]) * 60 +
      Number(_l[3]),
  };

  const fct = functions[_array.length];
  if (fct) {
    return fct(_array);
  }
}
