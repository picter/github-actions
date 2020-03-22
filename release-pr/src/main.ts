import * as core from '@actions/core';
import * as github from '@actions/github';
import * as Webhooks from '@octokit/webhooks';

async function run() {
  try {
    const releaseBranch = core.getInput('releaseBranch');
    const githubToken = core.getInput('githubToken');

    const octokit = new github.GitHub(githubToken);

    const context = github.context;
    const pushPayload = context.payload as Webhooks.WebhookPayloadPush;
    const branch = pushPayload.ref;
    const { data: openPRs } = await octokit.pulls.list({
      ...context.repo,
      head: branch,
      base: releaseBranch,
      state: 'open',
    });
    if (openPRs.length === 0) {
      try {
        await octokit.pulls.create({
          ...context.repo,
          base: releaseBranch,
          head: branch,
          title: 'Next release',
        });
      } catch (error) {
        // only fail if error is other than "PR already exists"
        if (!error.message.match(/A pull request already exists/)) {
          core.setFailed(error.message);
        }
      }
    } else {
      const pullNumber = openPRs[0].number;
      await octokit.pulls.update({
        ...context.repo,
        pull_number: pullNumber,
        body: `last commit: ${pushPayload.head_commit}`,
      });
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
