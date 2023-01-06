# prometheus-workflow-types
Common type definitions for prometheus and prometheus-backend

How to update version:

Git commands (or do this thru github UI)
- Update HEAD ref by merging commit, etc.
- Tag HEAD ref: `git tag v0.0.4`
- Push tags to remote repo: `git push origin v0.0.4`

Use updated version in other repos:
- find @multi/workflows line in package.json:
  `"@multi/workflows": "git+ssh://git@github.com/flanlabs/prometheus-workflow-types.git#semver:0.0.3"`
- replace the semver with the newest tag version: e.g. `...semver:0.0.3` => `...semver:0.0.4`
- re-run npm install in each updated repo
