let arr: Array<Object> = []

let getSum = (x: number, y: number = 1): number => x + y

interface MoreThanZero {
  (x: number, y: number): boolean
}

let more: MoreThanZero = (x: number, y: number) => x + y > 0 ? true : false

function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string {
  if (typeof x === 'number') {
    return Number(x.toString().split('').reverse().join(''));
  } else if (typeof x === 'string') {
    return x.split('').reverse().join('');
  }
}
