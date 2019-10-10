import * as core from '@actions/core';
import * as github from '@actions/github';

async function run() {
  try {
    const title = core.getInput('title');
    const urlPattern = core.getInput('urlPattern');
    const githubToken = core.getInput('githubToken');

    const octokit = new github.GitHub(githubToken);

    const context = github.context;

    await octokit.issues.createComment({
      ...context.issue,
      body: `*${title}:* ${urlPattern}`,
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
