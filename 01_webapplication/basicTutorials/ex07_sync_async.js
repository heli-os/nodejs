const fs =  require('fs');

// Sync
console.log(1);
const data = fs.readFileSync('ex07_data.txt', {encoding:'utf8'});
console.log(data);

// Async$
console.log(2);
fs.readFile('ex07_data.txt',{encoding:'utf8'},(err, data)=>{
    console.log(3);
    console.log(data);
});
console.log(4);