# Release Pull Request action

This action uses [Semnatic Release](https://github.com/semantic-release/semantic-release) to create a new release Pull Request
as soon as any releasable commit has been pushed to the observed branch. It performs the following tasks:

- Analyze commits based on the
  [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) to find the next version number and create a changelog
- Create a new Pull Request targeted to the _releaseBranch_ with the next version number as title and changelog as body
- If there's already an open release Pull Request, just update title and body.

## Usage

```yml
# .github/workflows/release-pr.yml

name: 'Release PR'
on:
  push:
    # trigger this action on pushes to these branches
    branches:
      - master

jobs:
  create-release-pr:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: picter/github-actions/release-pr@master
        with:
          # this branch will be the base of the release PR
          releaseBranch: 'release'
          githubToken: ${{ secrets.GITHUB_TOKEN }}
```
