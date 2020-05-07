# Release action

This action uses [Semnatic Release](https://github.com/semantic-release/semantic-release) to create new releases
of your repostitory. It performs the following tasks:

- Analyze commits based on the
  [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) to find the next version number and create a changelog
- Bump the version number on package.json, commit it and tag this new commit with a semver tag
- Create a GitHub release with a changelog based on the analyzed commits

## Usage

With protected branch:

```yml
# .github/workflows/release.yml

name: 'Release'
on:
  push:
    # trigger this action on pushes to these branches
    branches:
      - release

jobs:
  create-release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          # This setting is important, to allow Semantic Release
          # to reset the auth token when perfoming git actions.
          # Check this out: https://github.com/semantic-release/git/issues/196#issuecomment-601310576
          persist-credentials: false
      - name: Release
        env:
          # Credentials used to perform the release and
          # commit the updated assets to a protected branch.
          # This needs to be a Personal Access Token of a user
          # that has permission to push to the protected branch.
          # This token needs to be defined in the secrets repo-settings.
          GITHUB_TOKEN: ${{ secrets.GH_TOKEN_XXX }}
        uses: picter/github-actions/release@master
        with:
          # This branch will be used as merge back target to bring
          # the version bumps back to master.
          masterBranch: 'master'
          # This token will be used to create the merge-back PR and the
          # GitHub Release.
          githubToken: ${{ secrets.GH_TOKEN_XXX }}
```

With un-protected branch:

```yml
# .github/workflows/release.yml

name: 'Release'
on:
  push:
    # trigger this action on pushes to these branches
    branches:
      - release

jobs:
  create-release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Release
        env:
          # Pass credentials to Semantic Release modules
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        uses: picter/github-actions/release@master
        with:
          # This branch will be used as merge back target to bring
          # the version bumps back to master.
          masterBranch: 'master'
          # This token will be used to create the merge-back PR and the
          # GitHub Release.
          githubToken: ${{ secrets.GITHUB_TOKEN }}
```
