const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const githubToken = process.env.GITHUB_TOKEN;
const githubOwner = process.env.GITHUB_OWNER;
const githubRepo = process.env.GITHUB_REPO;

const getCICDMetrics = async () => {
    try {
        const response = await axios.get(`https://api.github.com/repos/${githubOwner}/${githubRepo}/actions/runs?per_page=30`, {
            headers: {
                Authorization: `Bearer ${githubToken}`,
            },
        });

        const runs = response.data.workflow_runs.filter((run) => run.status === 'completed');
        const dates = runs.map((run) => run.created_at);
        const durations = runs.map((run) => run.run_duration_ms);
        const successFlags = runs.map((run) => run.conclusion === 'success');

        return {
            dates: dates.reverse(),
            durations: durations.reverse(),
            successFlags: successFlags.reverse(),
        };
    } catch (error) {
        console.error(error);
        return { dates: [], durations: [], successFlags: [] };
    }
};

module.exports = { getCICDMetrics };