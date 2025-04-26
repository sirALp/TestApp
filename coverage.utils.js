const fs = require('fs');
const path = require('path');

const getCoverage = () => {
    try {
        const coveragePath = path.join(process.cwd(), 'coverage', 'coverage-summary.json');
        const coverageData = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
        return coverageData.total.lines.pct;
    } catch (error) {
        console.error(error);
        return null;
    }
};

module.exports = { getCoverage };