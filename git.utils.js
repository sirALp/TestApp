const git = require('simple-git');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const repoPath = process.env.REPO_PATH;

const getCommitsPerWeek = async () => {
    try {
        const gitInstance = git(repoPath);
        const today = new Date();
        const fourWeeksAgo = new Date(today.getTime() - 28 * 24 * 60 * 60 * 1000);
        const commits = await gitInstance.raw([
            'log',
            `--since=${fourWeeksAgo.toISOString().split('T')[0]}`,
            '--format=%ad',
            '--date=iso',
        ]);

        const commitDates = commits.split('\n').filter(Boolean);
        const commitsPerWeek = {};

        commitDates.forEach((date) => {
            const weekNumber = getWeekNumber(new Date(date));
            if (!commitsPerWeek[weekNumber]) {
                commitsPerWeek[weekNumber] = 0;
            }
            commitsPerWeek[weekNumber]++;
        });

        const labels = [];
        const data = [];

        for (let i = 0; i < 4; i++) {
            const weekNumber = getWeekNumber(new Date(today.getTime() - (3 - i) * 7 * 24 * 60 * 60 * 1000));
            labels.push(`Week ${weekNumber}`);
            data.push(commitsPerWeek[weekNumber] || 0);
        }

        return { labels, data };
    } catch (error) {
        console.error(error);
        return { labels: [], data: [] };
    }
};

const getWeekNumber = (date) => {
    const oneJan = new Date(date.getFullYear(), 0, 1);
    return Math.ceil(((date - oneJan) / 86400000 + oneJan.getDay() + 1) / 7);
};

module.exports = { getCommitsPerWeek };