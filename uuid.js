var uuid = require('node-uuid');
console.log(uuid.v1())
console.log(uuid.v4())
console.log(uuid.v4().replace(/-/g, '').replace(/[A-Za-z]/g, ''))

console.log(new Date().getTime())