/**
 * Direction:
 * Remove key that have null or undefined value
 *
 * Expected Result:
 * [
 *   { session_name: 'first test', classes: [{ students: [{ student_name: 'budi' }] }] },
 *   { classes: [{ class_name: 'second class', students: [{ student_name: 'adi' }] }] },
 * ]
 */
const data = [
  {
    session_name: "first test",
    classes: [{ class_name: undefined, students: [{ student_name: "budi" }] }],
  },
  {
    session_name: null,
    classes: [
      { class_name: "second class", students: [{ student_name: "adi" }] },
    ],
  },
];

function result(data) {
  // Your Code Here

  for (let i = 0; i < data.length; i++) {
    const obj = data[i];

    for (let key in obj) {
      if (!obj[key]) delete obj[key];
      if (obj[key] && Array.isArray(obj[key])) {
        const array = obj[key];

        for (let j = 0; j < array.length; j++) {
          for (let prop in array[j]) {
            if (!array[j][prop]) delete array[j][prop];
          }
        }
      }
    }
  }

  return data;
}

console.log(result(data));
