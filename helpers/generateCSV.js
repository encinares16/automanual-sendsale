
import fs from 'fs'
import path from 'path';

const generate = (data) => {
    
    const content = data.map(row => row.join(",")).join("\n");
    const filePath = path.join('output/', 'GCASH PAID TIME-OUT - TEST.csv');
    
    fs.appendFileSync(filePath, content, (err) => {
        if (err) {
            console.error('Fail writing to CSV file', err);
        }
        console.log('CSV file has been saved!');
    });
    data = [];
}

export default generate