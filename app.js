require('dotenv').config();
const express = require('express');
const app = express();
const port = 6001;

app.use(express.json());
app.use(express.static('public'));

const { getCommitsPerWeek } = require('./git.utils');
const { getCICDMetrics } = require('./github.utils');
const { getCoverage } = require('./coverage.utils');

app.get('/api/commits', async (req, res) => {
    const commitsPerWeek = await getCommitsPerWeek();
    res.json(commitsPerWeek);
});

/*app.get('/api/cicd', async (req, res) => {
    const cicdMetrics = await getCICDMetrics();
    res.json(cicdMetrics);
});*/

app.get('/api/cicd', async (req, res) => {
    const cicdMetrics = await getCICDMetrics();
    console.log('[/api/cicd] returning:', cicdMetrics);
    res.json(cicdMetrics);
  });

app.get('/api/coverage', async (req, res) => {
    const coverage = getCoverage();
    res.json({ coverage });
});

app.listen(port, () => {
    console.log(`DevCam app listening on port ${port}`);
});