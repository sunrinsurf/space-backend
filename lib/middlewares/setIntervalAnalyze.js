const analyzeInterest = require('./analyzeInterest');

async function setIntervalAnalyze() {
  const interval = parseInt(process.env.ANALYZE_INTERVAL) * 86400000;
  if (process.env.ANALYZE_INTERVAL_ISENABLED) {
    setInterval(() => {
      console.log('Universal Anlayzing');
      analyzeInterest();
      console.log('Universal Anlayzing Complete');
    }, interval);
  }
}

module.exports = setIntervalAnalyze;
