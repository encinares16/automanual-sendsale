import fs from 'fs/promises'; 

const getSevenPayId = async () => {
  try {
    const data = await fs.readFile('references.txt', 'utf8'); 
    const arrays = data.split(/\r?\n/); 
    return arrays;
  } catch (err) {
    console.error('Error reading the text file:', err);
  }
};

( async () => {
  const arrays = await getSevenPayId(); 
})();

export default getSevenPayId

// function delay(time) {
//   return new Promise(function(resolve) { 
//       setTimeout(resolve, time)
//   });
// }