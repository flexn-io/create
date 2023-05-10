# Contributing to Flexn

Thank you for your interest in contributing to Flexn! From commenting on and triaging issues, to reviewing and sending Pull Requests, all contributions are welcome.

The [Open Source Guides](https://opensource.guide/) website has a collection of resources for individuals, communities, and companies who want to learn how to run and contribute to an open source project. Contributors and people new to open source alike will find the following guides especially useful:

-   [How to Contribute to Open Source](https://opensource.guide/how-to-contribute/)
-   [Building Welcoming Communities](https://opensource.guide/building-community/)

### [Code of Conduct](CODE_OF_CONDUCT.md)

As a reminder, all contributors are expected to adhere to the [Code of Conduct](CODE_OF_CONDUCT.md).

## Ways to Contribute

If you are eager to start contributing code right away, we have a list of [good first issues](https://github.com/flexn-io/create/labels/good%20first%20issue) that contain bugs which have a relatively limited scope. As you gain more experience and demonstrate a commitment to evolving Flexn, you may be granted issue management permissions in the repository.

There are other ways you can contribute without writing a single line of code. Here are a few things you can do to help out:

1. **Replying and handling open issues.** We get a lot of issues every day, and some of them may lack necessary information. You can help out by guiding people through the process of filling out the issue template, asking for clarifying information, or pointing them to existing issues that match their description of the problem.
2. **Reviewing pull requests for the docs.** Reviewing [documentation updates](https://github.com/flexn-io/create/pulls) can be as simple as checking for spelling and grammar. If you encounter situations that can be explained better in the docs, click **Edit** at the top of most docs pages to get started with your own contribution.
3. **Help people write test plans.** Some pull requests sent to the main repository may lack a proper test plan. These help reviewers understand how the change was tested, and can speed up the time it takes for a contribution to be accepted.

Each of these tasks is highly impactful, and maintainers will greatly appreciate your help.

### Our Development Process

We use GitHub issues and pull requests to keep track of bug reports and contributions from the community. Changes from the community are handled through GitHub pull requests. Once a change made on GitHub is approved, it will be merged to main branch. This will then become a part of next release.

You can reach out to us through [@flexn_io](http://twitter.com/flexn_io) (the Flexn team)

## Helping with Documentation

The Flexn documentation is hosted as part of the Flexn repository at https://github.com/flexn-io/create/docs. The website itself is located at <https://create.flexn.org/> and it is built using [Docusaurus](https://docusaurus.io/). If there's anything you'd like to change in the docs, you can get started by clicking on the "Edit" button located on the upper right of most pages in the website.

If you are adding new functionality or introducing a change in behavior, we will ask you to update the documentation to reflect your changes.

## Contributing Code

Code-level contributions to Flexn generally come in the form of [pull requests](https://help.github.com/en/articles/about-pull-requests). These are done by forking the repo and making changes locally. Directly in the repo, there is the [`template` app](/packages/template) that you can install on your device (or simulators) and use to test the changes you're making to Flexn sources.

The process of proposing a change to Flexn Create can be summarized as follows:

1. Fork the Flexn repository and create your branch from `main`.
2. Make the desired changes to Flexn sources. Use the `packages/template` and `packages/app-harness` app to test them out.
3. If you've added code that should be tested, add tests.
4. If you've changed APIs, update the documentation, which lives in [docs](/docs).
5. Ensure the test suite passes, either locally or on CI once you opened a pull request.
6. Make sure your code lints (for example via `yarn lint --fix`).
7. Push the changes to your fork.
8. Create a pull request to the Flexn repository.
9. Review and address comments on your pull request.
    1. A bot may comment with suggestions. Generally we ask you to resolve these first before a maintainer will review your code.
    2. If changes are requested and addressed, please [request review](https://docs.github.com/en/github/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/requesting-a-pull-request-review) to notify reviewers to take another look.

If all goes well, your pull request will be merged. If it is not merged, maintainers will do their best to explain the reason why.

### Tests

Tests help us prevent regressions from being introduced to the codebase. The GitHub repository is continuously tested using Github Actions, the results of which are available through the Checks functionality on [commits](https://github.com/flexn-io/create/commits/HEAD) and pull requests.

## Community Contributions

Contributions to Flexn are not limited to GitHub. You can help others by sharing your experience using Flexn, whether that is through blog posts, presenting talks at conferences, or simply sharing your thoughts on Twitter and tagging @flexn_io.

## Where to Get Help

As you work on Flexn, it is natural that sooner or later you may require help. People interested in contributing may take advantage of the following:

-   **Twitter**. The Flexn team has its own account at [@flexn_io](https://twitter.com/flexn_io). If you feel stuck, or need help contributing, please do not hesitate to reach out.
-   **Proposals Repository**. If you are considering working on a feature large in scope, consider [creating a proposal first](https://github.com/flexn-io/create/discussions). The community can help you figure out the right approach, and we'd be happy to help.
-   **Flexn Community Slack**. While we try to hold most discussions in public, sometimes it can be beneficial to have conversations in real time with other contributors. People who have demonstrated a commitment to moving Flexn forward through sustained contributions to the project may eventually be invited to join the Flexn Community Slack.
