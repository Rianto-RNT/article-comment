/**
 * Direction:
 * Find missing number from the list
 *
 * Expected Result:
 * 8
 */
const numbers = [9, 6, 4, 2, 3, 5, 7, 0, 1];

function result(numbers) {
  // Your Code Here
  let missingNumber = [];

  minNum = Math.min(...numbers);
  maxNum = Math.max(...numbers);

  for (let i = minNum; i < maxNum; i++) {
    if (numbers.indexOf(i) < 0) {
      missingNumber.push(i);
    }
  }

  return missingNumber;
}

console.log(result(numbers));
