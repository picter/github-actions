import * as core from '@actions/core';
import * as github from '@actions/github';

async function run() {
  try {
    const title = core.getInput('title');
    const urlPattern = core.getInput('urlPattern');
    const githubToken = core.getInput('githubToken');

    const octokit = new github.GitHub(githubToken);

    const context = github.context;
    const repo = context.repo.repo;
    console.log(process.env.GITHUB_REF);
    const ref: string = process.env.GITHUB_REF || '';
    const branch = ref.replace('refs/heads/', '');
    const url = urlPattern.replace('{repo}', repo).replace('{branch}', branch);

    await octokit.issues.createComment({
      ...context.issue,
      body: `**${title}:** ${url}`,
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
