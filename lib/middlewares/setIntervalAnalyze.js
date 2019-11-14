const analyzeInterest = require('./analyzeInterest');

async function setIntervalAnalyze() {
  const interval = parseInt(process.env.ANALYZE_INTERVAL) * 86400000;
  if (process.env.ANALYZE_INTERVAL_ISENABLED) {
    setInterval(() => {
      analyzeInterest();
    }, interval);
  }
}

module.exports = setIntervalAnalyze;
