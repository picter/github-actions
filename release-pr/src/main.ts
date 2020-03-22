import * as core from '@actions/core';
import * as github from '@actions/github';
import * as Webhooks from '@octokit/webhooks';
import semanticRelease from 'semantic-release';
import config from './release.config';

async function run() {
  try {
    const releaseBranch = core.getInput('releaseBranch');
    const githubToken = core.getInput('githubToken');

    const octokit = new github.GitHub(githubToken);

    const context = github.context;
    const pushPayload = context.payload as Webhooks.WebhookPayloadPush;
    const branch = pushPayload.ref;
    const { owner, repo } = context.repo;

    const result = await semanticRelease(
      {
        ...config,
        debug: true,
        branch,
        repositoryUrl: `https://github.com/${owner}/${repo}.git`,
        dryRun: true,
        noCi: true,
      },
      {
        //  cwd: `${process.cwd()}/${repo}`,
        //env: { ...process.env },
      },
    );
    console.log(JSON.stringify(result));

    const { data: openPRs } = await octokit.pulls.list({
      owner,
      repo,
      head: branch,
      base: releaseBranch,
      state: 'open',
    });
    if (openPRs.length === 0) {
      try {
        await octokit.pulls.create({
          owner,
          repo,
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
        body: `last commit: ${JSON.stringify(pushPayload.head_commit)}`,
      });
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();