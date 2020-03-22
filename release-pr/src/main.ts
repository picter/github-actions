import * as core from '@actions/core';
import * as github from '@actions/github';
import * as Webhooks from '@octokit/webhooks';

async function run() {
  try {
    const releaseBranch = core.getInput('releaseBranch');
    const githubToken = core.getInput('githubToken');

    const octokit = new github.GitHub(githubToken);

    const context = github.context;
    const repo = context.repo.repo;
    const pushPayload = context.payload as Webhooks.WebhookPayloadPush;
    const branch = pushPayload.ref;
    try {
      await octokit.pulls.create({
        ...context.repo,
        base: releaseBranch,
        head: branch,
        title: 'Next release',
      });
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
