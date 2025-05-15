const fabric = require('fabric');
console.log(typeof fabric);
console.log(Object.keys(fabric));

if (fabric.fabric) {
  console.log("fabric.fabric exists");
  console.log(Object.keys(fabric.fabric));
}
