import generate from './generateCSV.js';
import credentials from './credentials.js';
import statusColor from './statusColor.js';
import getSevenPayId from './readtxt.js';
import 'dotenv/config'

const checkStatus = async (pages, browse) => {

const page = await pages

  console.log(`Getting transaction details...\n`)

  await page.goto(`${credentials.prod.url}`, {
      waitUntil: "domcontentloaded",
  })

  await new Promise(r => setTimeout(r, 1500))
  await page.reload();

  let declined = [];


  try {
    const references = await getSevenPayId(); 

    for (let i = 0; i < references.length; i++) {

      await new Promise(r => setTimeout(r, 1000))
      await page.click('[id="clearDateCreatedFrom"]')   
      await page.type('[id="sevenPayID"]', references[i])
      await page.click('[value="Search"]')
      await new Promise(r => setTimeout(r, 500))

      const sevenPayID = await page.$('.list table tbody tr td > a');

      if(sevenPayID){
        const data = await page.evaluate(() => {
          let transationDetails = {
            sevenpayid: document.querySelector('.list table tbody tr > td:nth-child(1)').innerText,
            merchant: document.querySelector('.list table tbody tr > td:nth-child(2)').innerText,
            merchantRef: document.querySelector('.list table tbody tr > td:nth-child(3)').innerText,
            amount: document.querySelector('.list table tbody tr > td:nth-child(4)').innerText,
            pos: document.querySelector('.list table tbody tr > td:nth-child(5)').innerText,
            storeNo: document.querySelector('.list table tbody tr > td:nth-child(6)').innerText,
            storeName: document.querySelector('.list table tbody tr > td:nth-child(7)').innerText,
            businessDate: document.querySelector('.list table tbody tr > td:nth-child(8)').innerText,
            paymentStatus: document.querySelector('.list table tbody tr > td:nth-child(9)').innerText
          }
          return transationDetails
        });

        if(data.paymentStatus === 'PAID' || data.paymentStatus === 'FOR VALIDATION' || data.paymentStatus === 'DECLINED'){
          console.log(`7 connect reference: ${statusColor.red}${references[i]}${statusColor.white}`)
          console.log(`Payment status: ${statusColor.red}${data.paymentStatus}${statusColor.white}`);
          console.log(data)
          declined.push([data.sevenpayid, data.merchant, data.merchantRef, data.amount.replaceAll(",", ""), data.pos, data.storeNo, data.storeName, data.businessDate, data.paymentStatus])
        } else {
          console.log(`7 connect reference: ${statusColor.green}${references[i]}${statusColor.white}`)
          console.log(`Payment status: ${statusColor.green}${data.paymentStatus}${statusColor.green}`);
          console.log(data)
        }
        await new Promise(r => setTimeout(r, 500))
        await page.evaluate(() => {
          const clearPayId = document.getElementById('sevenPayID');
          clearPayId.value = '';
        });
      } else {
        console.log('Transaction not found!');
        await page.goto(credentials.prod.url, { waitUntil: "domcontentloaded"})
      }
    }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    
    console.log('Ending Session...');
    await new Promise(r => setTimeout(r, 1000))
    await page.evaluate(() => {
      document.querySelector('a[href="/logout/index"]').click();
    });
    console.log('Genrating CSV file...');
    generate(declined);
    await browse.close();
};

export default checkStatus
