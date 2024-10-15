# [Who Tests the Testers? Making and Testing Pipelines](https://ekohilas.github.io/who-tests-the-testers/)

A [repo](https://github.com/ekohilas/who-tests-the-testers) for the slides of the talk.

Resources on the project can be found [here](https://github.com/ekohilas/ci-test)

## Evan Kohilas

| Conference | Slides | Video | Notes | Length | Year |
|------------|:------:|:-----:|:-----:|-------:|-----:|
| [PyCon AU](https://2024.pycon.org.au/program/NUUJAN/) | [🔗](https://ekohilas.github.io/who-tests-the-testers/pycon-au-2024) | [🔗]() | [🔗]() | 30 min | 2024 |

### Abstract
You likely have a good pipeline that either runs tests, lints, or deployments for your project.

But when it comes to changing that pipeline, how sure are you that it works before taking those changes live?

### Description
In this talk, we'll explore why it doesn't have to be the case that "there's no devops for devops".

We'll give a quick run down of what pipelines are, and why they should be used, before we give an example where it can be hard to know whether making changes to a gitlab pipeline will fail, and why that can be the case.

Then, we'll showcase tools that can be used for testing, creating, and simulating pipelines, so you too can setup a system to always be sure that your pipeline changes won't cause any water damage.

## Setup 
1. Since reveal.js exists as a submodule, `git clone --recurse-submodules` needs to be used when cloning (or `git submodule update --init --recursive` if already cloned).
2. `cd src/reveal.js && npm install`
3. `cd ../../ && ./start`
