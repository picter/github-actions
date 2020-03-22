/* eslint-disable */
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
    ['@semantic-release/commit-analyzer', parserSetup],
    ['@semantic-release/release-notes-generator', parserSetup],
  ],
  // prepare: [
  //   {
  //     path: '@semantic-release/exec',
  //     cmd: 'bash ../src/semantic-release/setVersion.sh ${nextRelease.version}',
  //   },
  // ],
  publish: ['@semantic-release/github'],
};
