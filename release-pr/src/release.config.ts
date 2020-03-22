/* eslint-disable */
import commitAnalyzer from '@semantic-release/commit-analyzer';
import notesGenerator from '@semantic-release/release-notes-generator';
import githubPublish from '@semantic-release/github';

const parserSetup = {
  preset: 'angular',
  releaseRules: [{ type: 'refactor', release: 'patch' }],
  parserOpts: {
    mergePattern: /^Merge pull request #(.*) from (.*)$/m,
    mergeCorrespondence: ['id', 'source'],
  },
};

export default {
  branch: 'master',
  plugins: [
    [commitAnalyzer, parserSetup],
    [notesGenerator, parserSetup],
  ],
  // prepare: [
  //   {
  //     path: '@semantic-release/exec',
  //     cmd: 'bash ../src/semantic-release/setVersion.sh ${nextRelease.version}',
  //   },
  // ],
  // publish: [githubPublish],
};
