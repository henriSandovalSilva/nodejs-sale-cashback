const fs = require('fs');

try {
  const salesFile = fs.readFileSync('sales.csv', 'UTF-8').split(/\r?\n/).splice(1).filter(n => n);
  const cashbackFile = fs.readFileSync('cashback.csv', 'UTF-8').split(/\r?\n/).splice(1).filter(n => n);

  let csvOutput = 'id_sale,timestamp_sale,amount_sale,id_cashback,timestamp_cashback,amount_cashback,bitcoin_price\r\n';

  salesFile.forEach((salesElement) => {
    cashbackFile.forEach((cashbackElement, cashbackIndex) => {
      const sales = salesElement.split(',');
      const cashback = cashbackElement.split(',');

      const salesId = sales[0];
      const salesCents = sales[1];
      const salesDate = new Date(sales[2]);

      const cashbackId = cashback[0];
      const cashbackSatochis = cashback[1];
      const cashbackDate = new Date(cashback[2]);

      let salesBrReais = (salesCents / 100).toFixed(2);
      const cashbackBitcoins = (cashbackSatochis * 0.00000001).toFixed(8);

      const bitcoinPrice = (
        ((0.05 / 100) * salesBrReais) /
        cashbackBitcoins
      ).toFixed(2);

      const interval = (cashbackDate.getTime() - salesDate.getTime()) / 1000;

      if (interval >= 0 && interval <= 5) {
        const line = `${salesId},${salesDate.toISOString()},${salesBrReais},${cashbackId},${cashbackDate.toISOString()},${cashbackBitcoins},${bitcoinPrice}`

        if (!csvOutput.includes(`${salesId},${salesDate.toISOString()}`)) {
          csvOutput = csvOutput + line + '\r\n';
        }
      } else if (cashbackFile.length === cashbackIndex + 1) {
        const line = `${salesId},${salesDate.toISOString()},${salesBrReais},null,null,null,null,null`;

        if (!csvOutput.includes(`${salesId},${salesDate.toISOString()}`)) {
          csvOutput = csvOutput + line + '\r\n';
        }
      }
    });
  });

  console.log(csvOutput)
} catch (err) {
  console.error(err);
}