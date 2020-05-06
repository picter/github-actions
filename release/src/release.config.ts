/* eslint-disable */
import commitAnalyzer from '@semantic-release/commit-analyzer';
import notesGenerator from '@semantic-release/release-notes-generator';
import npmPublish from '@semantic-release/npm';
import gitPublish from '@semantic-release/git';
import githubPublish from '@semantic-release/github';
import angularPreset from 'conventional-changelog-angular';

const parserSetup = {
  // Since this action will be bundled with ncc (see build script in package.json)
  // we can't rely on any auto-resolving from node_modules packages. There
  // is no node_mdules folder in dist/. That's why we need to import angular presets
  // and set this preset-config to null (every string will be tried to resolve like
  // node_modules/conventional-changelog-{preset}).
  preset: null,
  releaseRules: [{ type: 'refactor', release: 'patch' }],
  parserOpts: {
    ...angularPreset,
  },
};

export default {
  branch: 'master',
  plugins: [
    [commitAnalyzer, parserSetup],
    [notesGenerator, parserSetup],
    [
      npmPublish,
      {
        // only bump version in package.json
        npmPublish: false,
      },
    ],
    [
      gitPublish,
      {
        assets: ['package.json'],
        message: 'chore(release): v${nextRelease.version} [skip ci]',
      },
    ],
    githubPublish,
  ],
  // prepare: [
  //   {
  //     path: '@semantic-release/exec',
  //     cmd: 'bash ../src/semantic-release/setVersion.sh ${nextRelease.version}',
  //   },
  // ],
  // publish: [githubPublish],
};
