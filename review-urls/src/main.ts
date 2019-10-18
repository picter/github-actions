import * as core from '@actions/core';
import * as github from '@actions/github';
import { WebhookPayload } from '@actions/github/lib/interfaces';

async function run() {
  try {
    const title = core.getInput('title');
    const urlPattern = core.getInput('urlPattern');
    const githubToken = core.getInput('githubToken');

    const octokit = new github.GitHub(githubToken);

    const context = github.context;
    const repo = context.repo.repo;
    const prPayload: WebhookPayload['pull_request'] =
      context.payload.pull_request;
    const branch = prPayload ? prPayload.head.ref : '';
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
