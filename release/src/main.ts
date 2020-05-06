import * as core from '@actions/core';
import * as github from '@actions/github';
import * as Webhooks from '@octokit/webhooks';
import semanticRelease from 'semantic-release';
import config from './release.config';

interface SemanticReleaseResult {
  nextRelease: {
    type: string;
    version: string;
    gitHead: string;
    gitTag: string;
    notes: string;
    channel: string;
  };
}

async function run() {
  try {
    const releaseBranch = core.getInput('releaseBranch');
    const masterBranch = core.getInput('masterBranch');
    const githubToken = core.getInput('githubToken');

    const octokit = new github.GitHub(githubToken);

    const context = github.context;
    const pushPayload = context.payload as Webhooks.WebhookPayloadPush;
    const branch = pushPayload.ref;
    const { owner, repo } = context.repo;

    const result: SemanticReleaseResult = await semanticRelease(
      {
        ...config,
        debug: true,
        branch,
        repositoryUrl: `https://github.com/${owner}/${repo}.git`,
        // dryRun: true,
        // noCi: true,
      },
      {
        //  cwd: `${process.cwd()}/${repo}`,
        //env: { ...process.env },
      },
    );

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
          base: masterBranch,
          head: branch,
          title: `chore: Merge back release v${result.nextRelease.version} [skip ci]`,
          body: result.nextRelease.notes,
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
        title: `chore: Merge back release v${result.nextRelease.version} [skip ci]`,
        body: result.nextRelease.notes,
      });
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
