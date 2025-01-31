# UC-Actions

This repository holds common [GitHub Actions](https://docs.github.com/en/actions) that are used in the various CAT and
UnityCore repositories.

# Available Actions

## [analyze-test-results](https://github.com/mindjolt/uc-actions/tree/main/analyze-test-results)

Scans Unity test runner results for failed tests and reports them as a new, `action_required` check.  Note that no
additional check is generated if all tests are passing.

### Inputs
- `name` - The name to assign to the generated check (optional; defaults to `test-results`)
- `files` - One or more XML filenames to analyze

## [check-for-changelog](https://github.com/mindjolt/uc-actions/tree/main/check-for-changelog)

Ensures that the CHANGELOG.md has been updated with each pull request.

### Inputs
- `github_token` - Valid GitHub API token (optional; will use workflow token if omitted)

## [check-for-documentation](https://github.com/mindjolt/uc-actions/tree/main/check-for-documentation)

If the JIRA ticket for a given pull request is labeled with `Documentation`, the pull request is scanned for
documentation updates.

### Inputs
- `github_token` - Valid GitHub API token (optional; will use workflow token if omittted)
- `jira_user` - Username for JIRA authentication (optional; will use `CONFLUENCE_USER` is omitted)
- `jira_password` - Password for JIRA authentication (optional; will use `CONFLUENCE_PASSWORD` is omitted)

## [post-jira-comment](https://github.com/mindjolt/uc-actions/tree/main/post-jira-comment)

Checks the pull request for a JIRA ticket number and adds a comment linking back to it.

### Inputs
- `github_token` - Valid GitHub API token (optional; will use workflow token if omittted)

## [post-to-slack](https://github.com/mindjolt/uc-actions/tree/main/post-to-slack)

Sends a release notification message to a Slack channel.

### Inputs
- `token` - A valid Slack API token
- `channel` - The name of the channel to post the message to
- `project_name` - The name of the project being released
- `version` - The version number that is being released

## [publish-release](https://github.com/mindjolt/uc-actions/tree/main/publish-release)

Create a new release tag in the repository.

### Inputs
- `token` - A valid GitHub API token
- `version` - The release version number (used as the release tag name)
- `ref` - The commit or branch being published.

## [update-changelog](https://github.com/mindjolt/uc-actions/tree/main/update-changelog)

Update the changelog to commit the current unreleased changes to the new version number and create a new unreleased
block.

### Inputs
- `version` - The version number that was released

## [update-package-json](https://github.com/mindjolt/uc-actions/tree/main/update-package-json)

Update the version number in the local package.json file so that it interacts correctly with the package manager.

### Inputs
- `version` - The new active version number of the package
