# [Who Tests the Testers? Making and Testing Pipelines](https://ekohilas.github.io/who-tests-the-testers/)

A [repo](https://github.com/ekohilas/who-tests-the-testers) for the slides of the talk.

Resources on the project can be found [here](https://github.com/ekohilas/ci-test)

## Evan Kohilas

| Conference | Slides | Video | Notes | Length | Year |
|------------|:------:|:-----:|:-----:|-------:|-----:|
| [DDD Melbourne](https://www.dddmelbourne.com/) | [🔗](https://ekohilas.github.io/who-tests-the-testers/ddd-melbourne-2026) | [🔗](https://www.youtube.com/@ekohilas) | [🔗](https://www.dddmelbourne.com/agenda?sessionId=72e118f7-ba36-4e3c-887c-e01dad6a5adc) | 45 min | 2026 |
| [PyCon US](https://us.pycon.org/2025) | [🔗](https://ekohilas.github.io/who-tests-the-testers/pycon-us-2025) | [🔗](https://www.youtube.com/@PyConUS/videos) | [🔗](https://us.pycon.org/2025/schedule/presentation/28/) | 30 min | 2025 |
| [PyCon AU](https://2024.pycon.org.au) | [🔗](https://ekohilas.github.io/who-tests-the-testers/pycon-au-2024) | [🔗](https://www.youtube.com/watch?v=ilfLFBacNj4) | [🔗](https://2024.pycon.org.au/program/NUUJAN) | 30 min | 2024 |


### Abstract
You likely have a good pipeline that either runs tests, lints, or deployments for your project.

But when it comes to changing that pipeline, how sure are you that it works before taking those changes live?

### Description
In this talk, we'll explore why it doesn't have to be the case that "there's no devops for devops".

We'll give a quick run down of what pipelines are, and why they should be used, before we give an example where it can be hard to know whether making changes to a gitlab pipeline will fail, and why that can be the case.

Then, we'll showcase tools that can be used for testing, creating, and simulating pipelines, so you too can setup a system to always be sure that your pipeline changes won't cause any water damage.

### GitLab References
- GitLab Documentation & Tooling
  - [Pipeline Reference](https://docs.gitlab.com/ee/ci/quick_start/)
  - [VSCode Extension](https://docs.gitlab.com/ee/editor_extensions/visual_studio_code/index.html)
  - [CI Linter](https://docs.gitlab.com/ee/ci/yaml/lint.html)
  - [Pipeline Tools](https://docs.gitlab.com/ee/ci/pipeline_editor/index.html)
  - [Pipeline Manual Execution](https://docs.gitlab.com/ee/ci/pipelines/#run-a-pipeline-manually)
- Local Runner Tools
  - [gitlab-ci-local](https://github.com/firecow/gitlab-ci-local)
  - [gitlabci-local (gcil)](https://gitlab.com/RadianDevCore/tools/gcil)
- YAML Generators
  - [GitLab CI Python Library (GCIP)](https://gitlab.com/dbsystel/gitlab-ci-python-library)
  - [gcix](https://github.com/gcixdev/gcix)
  - [Fluent GitLab CI](https://github.com/tsirysndr/fluent-gitlab-ci)
  - [node-gitlab-ci](https://github.com/devowlio/node-gitlab-ci)
 
### GitHub References
- GitHub Documentation & Tooling
  - [Quickstart Reference](https://docs.github.com/en/actions/writing-workflows/quickstart)
  - [Workflows & Actions (Pipelines)](https://docs.github.com/en/actions)
  - [Manual Execution](https://docs.github.com/en/actions/managing-workflow-runs-and-deployments/managing-workflow-runs/manually-running-a-workflow)
  - [actionlint](https://github.com/rhysd/actionlint)
- VS Code Extensions
  - [by GitHub](https://marketplace.visualstudio.com/items?itemName=GitHub.vscode-github-actions)
  - [by Mathieu Dutour](https://marketplace.visualstudio.com/items?itemName=me-dutour-mathieu.vscode-github-actions)
  - [by Jun Han](https://marketplace.visualstudio.com/items?itemName=formulahendry.github-actions)
  - [by OmarTawfik](https://marketplace.visualstudio.com/items?itemName=OmarTawfik.github-actions-vscode)
- Local Runner Tools
  - [act](https://github.com/nektos/act)
  - [GitHub Action Local Executor](https://github.com/aweris/gale)
  - [Local Action Debugger](https://github.com/github/local-action)
  - [GAL](https://github.com/alphaxek/github-actions-locally)
  - [wflow](https://github.com/phishy/wflow)
- YAML Generators
  - [github-actions-wac](https://github.com/webiny/github-actions-wac)
  - [GitHub Actions Workflow Generator](https://githubactionsworkflowgenerator.octopus.com/)

### General References
- Static Yaml Injection
  - [Cog](https://github.com/nedbat/cog)

## Setup 
1. Since reveal.js exists as a submodule, `git clone --recurse-submodules` needs to be used when cloning (or `git submodule update --init --recursive` if already cloned).
2. `cd src/reveal.js && npm install`
3. `cd ../../ && ./start`
