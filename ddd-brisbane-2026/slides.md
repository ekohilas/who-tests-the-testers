---
theme: apple-basic
title: "Who Tests the Testers? Making and Testing Pipelines"
author: Evan Kohilas
# https://sli.dev/features/drawing
drawings:
  persist: false
# force light by default
colorSchema: light
duration: 45min
# TODO: figure out why this needs to be 1920/2 to set the width to 1920
canvasWidth: 960
# for styling parts of text
mdc: true
# github pages and surge serve the deck from a sub path with no spa fallback
routerMode: hash
section: 1
layout: full
---

<video src="/images/3d_pipes.webm" autoplay loop muted class="absolute inset-0 w-full h-full object-contain" />

<!--
Thank you! I'm so humbled to be speaking at DDD! 

Alrighty then, to start with, can I get some noise from anyone else who thinks this is an awesome screensaver?

Yeah! It's quite fitting for a pipelines talk isn't it?
-->

---
layout: image
image: /images/intro.svg
backgroundSize: contain
---

<!--
So, [as you may have heard,] I'm Evan, and I've dedicated a fair bit of my time on platform software engineering, that reduces human errors through things like working on pipelines to run tests for a codebase.

> 00:30 (00:30) {1}
-->

---
section: 2
layout: image
image: /images/oopsies.svg
backgroundSize: contain
---

<!--
However, I noticed that I, myself, made quite a few errors.
-->

---
layout: image
image: /images/superhero.svg
backgroundSize: contain
---

<!--
And I don't say this because I think I'm this perfect person that should never make errors.
-->

---
layout: image
image: /images/test.svg
backgroundSize: contain
---

<!--
But because it highlighted to me that these errors could've been prevented if there were tests.
-->

---
layout: image
image: /images/thinking.svg
backgroundSize: contain
---

<!--
And so these events got me thinking. If platform teams can help engineers run tests, for their codebase, who helps the platform teams, write the tests for, running the tests?
-->

---

<h1 v-click>1. How to <u>make</u> a pipeline</h1>
<h1 v-click>2. How to <u>break</u> a pipeline</h1>
<h1 v-click>3. How to <u>not</u> break a pipeline</h1>

<!--
So today, we'll walk through this journey of mine, in 3 parts.

> Next slide

1. I'll briefly introduce what a pipeline is, and cover how to make one,
2. show how I've found ways that they can break,
3. and finally, deep dive into the methods to stop them from breaking.

> 02:00 (01:30) {2}
-->

---
section: 3
layout: image
image: /images/raised_hands.svg
backgroundSize: contain
---

<!--
Alright, for this section, could I please ask everyone to raise their hand.

We're gonna do a little survey.

And I'll also ask to take a photo, cause I didn't think that'd work.
-->

---
layout: image
image: /images/complete_pipeline.svg
backgroundSize: contain
---

<!--
Okay keep your hand raised, if you know what a pipeline is.

Okay great, don't put your hands down just yet, keep your hands raised
-->

---
layout: image
image: /images/running_pipeline.svg
backgroundSize: contain
---

<!--
if you you've worked with a pipeline.

Nice, now keep it up,
-->

---
layout: image
image: /images/writing_pipeline.svg
backgroundSize: contain
---

<!--
if you've written a pipeline.

Cool cool, last one, keep it raised,
-->

---
layout: image
image: /images/gitlab_ci_pipeline_execution_failed.svg
backgroundSize: contain
---

<!--
if you've had a pipeline that you've written fail on you.

Wow x of you.

> 03:00 (01:00) {3}
-->

---
section: 4
layout: image
image: /images/full_pipeline.svg
backgroundSize: contain
---

<!--
Okay, so that we're all on the same level, for those of you who haven't seen a pipeline before, they can look something like this
-->

---
layout: image
image: /images/factory_line.svg
backgroundSize: contain
---

<!--
And to put it simply, you can think of them as a factory line, where each step performs different operations to get to the final product.
But in our case, our operations can look something like
-->

---
layout: image
image: /images/setup_step.svg
backgroundSize: contain
---

<!--
"setup"
-->

---
layout: image
image: /images/setup_build_step.svg
backgroundSize: contain
---

<!--
"build"
-->

---
layout: image
image: /images/setup_build_test_step.svg
backgroundSize: contain
---

<!--
"test"
-->

---
layout: image
image: /images/setup_build_test_deploy_step.svg
backgroundSize: contain
---

<!--
with our final operation deploying this built and tested product.
-->

---
layout: image
image: /images/pipe_sparkles.svg
backgroundSize: contain
---

<!--
So why are pipelines good?
-->

---
layout: image
image: /images/pipe_shrug.svg
backgroundSize: contain
---

<!--
Why should you care about them?
-->

---
layout: image
image: /images/streamlined.svg
backgroundSize: contain
---

<!--
Well, they allow us in one case, to create a streamlined process that automates what would otherwise be very manual.
-->

---
layout: image
image: /images/quality_control.svg
backgroundSize: contain
---

<!--
And in other cases, they can act as a quality control.

This is similar to a factory line.
-->

---
layout: image
image: /images/stage_failure.svg
backgroundSize: contain
---

<!--
If any stage of the factory line fails, like building or quality assurance,
-->

---
layout: image
image: /images/item_push.svg
backgroundSize: contain
---

<!--
that item, or in our case, some code, won't progress to the next stage, and thus won't be allowed to merge, or even deployed.
-->

---
layout: image
image: /images/gitlab_logo.svg
backgroundSize: contain
---

<!--
Now while my journey (if you hadn't noticed) takes place within GitLab Pipelines,
-->

---
layout: image
image: /images/ci_logos.svg
backgroundSize: contain
---

<!--
don't fret if you're a user of other CI tools!
My goal is for the ideas to be general enough to be applicable!
And, for tools like GitHub Actions, additional resources will be given at the end.

> 04:45 (01:45) {4}
-->

---
section: 5
layout: image
image: /images/gitlab_ci_yml.svg
backgroundSize: contain
---

<!--
So the first part of this journey is making a gitlab pipeline.
And to do so, we need to create a `.gitlab-ci.yml` file, that gitlab will use as configuration. (That's kind of a mouth-full, so I'll try to refer to it as a ci config file from here on)
-->

---
layout: image
image: /images/object_json_yaml.svg
backgroundSize: contain
---

<!--
If you're new to yaml, think of it as a way to store maps and lists. similar to json, but more human friendly.

https://carbon.now.sh/?bg=rgba%28255%2C255%2C255%2C1%29&t=one-light&wt=none&l=application%2Fjson&width=680&ds=true&dsyoff=20px&dsblur=25px&wc=true&wa=true&pv=51px&ph=64px&ln=false&fl=1&fm=Source+Code+Pro&fs=18px&lh=133%25&si=false&es=4x&wm=false&code=%257B%250A%2520%2520%2522object%2522%253A%2520%257B%250A%2520%2520%2520%2520%2522key%2522%253A%2520%2522value%2522%252C%250A%2520%2520%2520%2520%2522array%2522%253A%2520%255B1%252C%2520false%255D%250A%2520%2520%257D%250A%257D%250A
https://carbon.now.sh/?bg=rgba%28255%2C255%2C255%2C1%29&t=one-light&wt=none&l=yaml&width=680&ds=true&dsyoff=20px&dsblur=25px&wc=true&wa=true&pv=51px&ph=64px&ln=false&fl=1&fm=Source+Code+Pro&fs=18px&lh=133%25&si=false&es=4x&wm=false&code=object%253A%250A%2520%2520key%253A%2520value%2520%250A%2520%2520array%253A%250A%2520%2520%2520%2520-%25201%250A%2520%2520%2520%2520-%2520false%250A
-->

---
layout: default
---

````md magic-move
```yaml {1}
# .gitlab-ci.yml
```
```yaml {2}
# .gitlab-ci.yml
image: python:latest
```
```yaml {4}
# .gitlab-ci.yml
image: python:latest

test-job:
```
```yaml {5}
# .gitlab-ci.yml
image: python:latest

test-job:
    script: "python test.py"
```
```yaml
# .gitlab-ci.yml
image: python:latest

test-job:
    script: "python test.py"
```
```yaml {6}
# .gitlab-ci.yml
image: python:latest

test-job:
    script: "python test.py"
    rules:
```
```yaml {7}
# .gitlab-ci.yml
image: python:latest

test-job:
    script: "python test.py"
    rules:
        - changes:
```
```yaml {8}
# .gitlab-ci.yml
image: python:latest

test-job:
    script: "python test.py"
    rules:
        - changes:
            - "**/*.py"
```
```yaml
# .gitlab-ci.yml
image: python:latest

test-job:
    script: "python test.py"
    rules:
        - changes:
            - "**/*.py"
```
```yaml {10}
# .gitlab-ci.yml
image: python:latest

test-job:
    script: "python test.py"
    rules:
        - changes:
            - "**/*.py"

database-test-job:
```
```yaml {10-14}
# .gitlab-ci.yml
image: python:latest

test-job:
    script: "python test.py"
    rules:
        - changes:
            - "**/*.py"

database-test-job:
    script: "python database_tests.py"
    rules:
        - changes:
            - "**/*.py"
```
```yaml {10}
# .gitlab-ci.yml
image: python:latest

test-job:
    script: "python test.py"
    rules:
        - changes:
            - "**/*.py"

database-setup-job:

database-test-job:
    script: "python database_tests.py"
    rules:
        - changes:
            - "**/*.py"
 
 
 
 
 
 
 
```
```yaml {10-15}
# .gitlab-ci.yml
image: python:latest

test-job:
    script: "python test.py"
    rules:
        - changes:
            - "**/*.py"

database-setup-job:
    script: "python setup_test_database.py"
    rules: 
        - changes: 
            - "**/*.pu"

database-test-job:
    script: "python database_tests.py"
    rules:
        - changes:
            - "**/*.py"
```
```yaml {10-20}
# .gitlab-ci.yml
image: python:latest

test-job:
    script: "python test.py"
    rules:
        - changes:
            - "**/*.py"

database-setup-job:
    script: "python setup_test_database.py"
    rules: 
        - changes: 
            - "**/*.pu"
            
database-test-job:
    script: "python database_tests.py"
    rules:
        - changes:
            - "**/*.py"
```
```yaml {18-19}
# .gitlab-ci.yml
image: python:latest

test-job:
    script: "python test.py"
    rules:
        - changes:
            - "**/*.py"

database-setup-job:
    script: "python setup_test_database.py"
    rules: 
        - changes: 
            - "**/*.pu"

database-test-job:
    script: "python database_tests.py"
    needs:
        - "database-setup-job"
    rules:
        - changes:
            - "**/*.py"
```
```yaml {*}
# .gitlab-ci.yml
image: python:latest

test-job:
    script: "python test.py"
    rules:
        - changes:
            - "**/*.py"

database-setup-job:
    script: "python setup_test_database.py"
    rules: 
        - changes: 
            - "**/*.pu"

database-test-job:
    script: "python database_tests.py"
    needs:
        - "database-setup-job"
    rules:
        - changes:
            - "**/*.py"
```
````

<!--
We'll make a simple one now, that one can use on their repo to ensure tests pass before merging

[click]

Here we define that we want jobs to run with a docker image that contains the latest version of your programming language of choice, which for this talk, will be python.

[click]

Then we define a job, with the name test-job

[click]

And below we define "script" as the command to run for that job, which for us will be a python file called `test.py`

[click]

Of course this is probably the simplest pipeline we could create, and thus shouldn't be used as a reference.

This is because it's utilising a lot of what gitlab is offering by default, and we can get away with not having to install any packages as none are being used.

So if you are looking for reference pipelines, I'll have some links in the resources at the end.

That being said, given how simple this example pipeline is, it probably doesn't mimic the issues that a real pipeline that I've worked on might, so let's extend it to do so.

[click]

To do this, we'll add some rules, which decide on what conditions the job runs

[click]

We'll then specify that we want the job to run whenever there's changes that have been made.

[click]

Such as changes to any python files.

[click]

This is so that we can speed up our pipelines by not unnecessarily running a costly job, on unrelated changes, to other files within our repo, such as documentation.
Another thing we might need to extend on, is having to run different types of testing jobs.

[click]

For example, a `database-test-job`

[click]

which we could setup in a similar way, except... it might depend on some test databases to have been created.

[click]

So for that, we'll require a new setup job to be run,

[click]

which needs to be run under the same set of changes,

[click]

and additionally, we need some way of specifying that the `database-test-job` can only run once the `database-setup-job` is finished.

[click]

To do that, we can use the `needs` keyword, which specifies that the `database-test-job` "needs" the `database-setup-job` to finish successfully before the tests can be started and completed correctly.

With the idea being that we want as much running in parallel as possible, such that our previous tests don't have to wait for setting up databases if they don't depend on them.

[click]

And so now, what we've landed on is great.

It's similar enough as an example to what I was working with,

And, it works when it's merged in!

> 08:35 (03:50) {5}
-->

---
section: 6
layout: image
image: /images/prs_and_time.svg
backgroundSize: contain
---

<!--
However as new PRs are made, and time goes on,
-->

---
layout: image
image: /images/gitlab_ci_pipeline_execution_failed.svg
backgroundSize: contain
---

<!--
one PR, causes the pipeline to fail.
Not because the tests themselves pass or fail,
-->

---
layout: image
image: /images/pipeline_invalid.svg
backgroundSize: contain
---

<!--
but because the pipeline itself is incorrect.

Gitlab will tell us that the `database-test-job` couldn't run because the `database-setup-job` didn't run.

Now if we go back to our pipeline definition,
-->

---
layout: default
---

````md magic-move
```yaml {7-22}
# .gitlab-ci.yml
image: python:latest

test-job:
    script: "python test.py"
    rules:
        - changes:
            - "**/*.py"

database-setup-job:
    script: "python setup_test_database.py"
    rules: 
        - changes: 
            - "**/*.pu"

database-test-job:
    script: "python database_tests.py"
    needs:
        - "database-setup-job"
    rules:
        - changes:
            - "**/*.py"
```
```yaml {8,14,22}
# .gitlab-ci.yml
image: python:latest

test-job:
    script: "python test.py"
    rules:
        - changes:
            - "**/*.py"

database-setup-job:
    script: "python setup_test_database.py"
    rules: 
        - changes: 
            - "**/*.pu"

database-test-job:
    script: "python database_tests.py"
    needs:
        - "database-setup-job"
    rules:
        - changes:
            - "**/*.py"
```
````

<!--
Can anyone tell me why it didn't run?

> Feel free to shout out!

> [It might not have been very obvious... It's...]

> Yes, thank you, that's right.

[click]

Because there was a typo in the changes.
The `database-test-job` ran, because there were changes to files ending in `.py`,
But the `database-setup-job` didn't run, because there weren't changes to files ending in `.pu`.

Now of course, this is only an example to show what can go wrong regardless of how simple your setup could be.
-->

---
layout: image
image: /images/frustrated.svg
backgroundSize: contain
---

<!--
But the reason I give this example is because it's a type of problem I've personally experienced!
And it left me feeling frustrated, and, disappointed.
And if this wasn't only because I had lost time, then why?
-->

---
layout: image
image: /images/good_job.svg
backgroundSize: contain
---

<!--
Well, while it's great that we've figured out why this happened, and that the fix would be a simple one character change,
-->

---
layout: image
image: /images/reflection.svg
backgroundSize: contain
---

<!--
in our line of work, it's more important to understand *how* this was allowed to happen in the first place, so it doesn't ever occur again.

> 10:20 (1:45)
-->

---
layout: image
image: /images/thought_bubble.svg
backgroundSize: contain
---

<!--
For this, I'm gonna try hand it over back to you all!
Can anyone shout out some examples for why this problem could've happened?

> Okay I'll be honest, I didn't hear any of that. That is on me because I thought this might happen with so many of you here, but now can't blame myself for trying. So I've come prepared with some guesses to match what all of your awesome responses might be.

- The author was careless
- Incomplete or incompatible changes
- The reviewers weren't sharp enough
- Lack of testing
- The config is too complex
- It wasn't written using DRY

> 12:05 (1:45)
-->

---
layout: image
image: /images/human_error.svg
backgroundSize: contain
---

<!--
But to me, those are all human errors
And as you might have heard earlier, I don't like human errors, *especially* ones that could be avoided by a systematic change, which would allow us to blame a system instead of people. This is why I was so frustrated.
-->

---
layout: image
image: /images/code.svg
backgroundSize: contain
---

<!--
So I would say at a higher level, this occurred because while this configuration looks like code,
-->

---
layout: image
image: /images/code_crossed.svg
backgroundSize: contain
---

<!--
it isn't treated like code.
Because we're used to testing code with tests,
-->

---
layout: image
image: /images/thought_bubble.svg
backgroundSize: contain
---

<!--
but who tests the testing infrastructure with tests?

Can I get a raise of hands?

> See that's like ?% of the audience!

> 12:55 (0:50) {6}
-->

---
section: 7
layout: image
image: /images/thinking.svg
backgroundSize: contain
---

<!--
So now you might be thinking,  
Evan, I'm so sorry to hear that,  
it was such a touching story,  
but solutions speak louder than problems,  
how do I stop this from happening to me?
-->

---

<h1 v-click>1. Configuration Linting</h1>
<h1 v-click>2. Running End to End Pipelines</h1>
<h1 v-click>3. Running Pipelines Locally</h1>
<h1 v-click>4. Configuration Static Analysis Testing</h1>
<h1 v-click>5. Pipeline Generation Tooling</h1>

<!--
Thank you,  
it was difficult to share and I'm glad you asked because 
throughout that time,  
I was able to compose five techniques that helped me,  
which we'll dive into now:

1. The first, is validating our ci configuration using linting tools
2. The second, is running an end to end ci pipeline before committing changes
3. We'll then look at how we can run those pipeline jobs locally
4. How we can run static analysis testing on the ci configuration
5. And finally, we'll look at dynamically generating pipelines using tools

Now I won't claim that any single technique is the best. My goal is to cover the pros and cons to help you decide which one (or which combination) works best in your situation.

> 14:15 (01:20) {7}
-->

---
section: 8
---

# 1. Configuration Linting

<!--
So the first method that we'll dive into is linting the ci config file.
-->

---
layout: image
image: /images/lint.svg
backgroundSize: contain
---

<!--
Linting is great. I **love** linting, because it's a fast method of finding (and sometimes automatically fixing), problems that can be solved before going further.
And gitlab offers quite a bit here:
-->

---
layout: image
image: /images/vscode_linting_extension.svg
backgroundSize: contain
---

<!--
They have a VSCode extension
-->

---
layout: image
image: /images/vscode_linting_extension_example.svg
backgroundSize: contain
---

<!--
Which will tell you within your editor tell you whether your yaml is setup correctly
-->

---
layout: image
image: /images/gitlab_pipeline_syntax_checker.svg
backgroundSize: contain
---

<!--
They have a pipeline syntax checker,

Which will do the same thing as the extension, but through a web ui, and api endpoint.
-->

---
layout: image
image: /images/gitlab_pipeline_visualiser.svg
backgroundSize: contain
---

<!--
They also have a visualiser,

which gives a quick way of helping you see the dependencies between jobs
-->

---
layout: image
image: /images/gitlab_pipeline_validator.svg
backgroundSize: contain
---

<!--
They have a validator,

Which simulates a git push event on the default branch, with rules and needs evaluated
-->

---
layout: image
image: /images/gitlab_pipeline_expander.svg
backgroundSize: contain
---

<!--
And finally they have a tool to expand your yaml into it's full configuration,

Which helps you see what the pipeline looks like with all the special syntax expanded.
-->

---
layout: image
image: /images/downsides.svg
backgroundSize: contain
---

<!--
However these methods have their downsides too:
-->

---
layout: image
image: /images/intellij_crossed.svg
backgroundSize: contain
---

<!--
The VSCode extension, as you might have guessed, is only officially made for VSCode
-->

---
layout: image
image: /images/gitlab_pipeline_syntax_checker_success.svg
backgroundSize: contain
---

<!--
And even if you instead use the pipeline syntax checker, whether it be the web ui, or the endpoint, they only tell you if there's something wrong with your schema, not with how it runs.
-->

---
layout: image
image: /images/gitlab_pipeline_visualiser_arrow_pipeline_failure.svg
backgroundSize: contain
---

<!--
The visualiser, while handy, doesn't help you understand the issues we had around dependencies with needs and rules, and thus won't uncover those issues upfront.
-->

---
layout: image
image: /images/gitlab_pipeline_validator_success.svg
backgroundSize: contain
---

<!--
The validator, while it says it simulates and evaluates rules and needs (unless I'm misunderstanding, feel free to correct me at the end) wasn't able to pickup on that problem (and also doesn't have an api endpoint, to make testing easier)
-->

---
layout: image
image: /images/gitlab_pipeline_expander_extends.svg
backgroundSize: contain
---

<!--
And with the full configuration tool, expansion is limited, and won't expand out defaults, (technically each individual job has an image).
-->

---
layout: image
image: /images/puzzle_piece.svg
backgroundSize: contain
---

<!--
So while linting tools do have their use, they are only a single piece of the puzzle, just like how we can't expect linters to catch logic errors.

> 16:50 (2:35) {8}
-->

---
section: 9
---

# 2. Running End to End Pipelines

<!--
So if linters are lacking due to not testing end to end, why don't we instead try running an end to end pipeline before merging changes?
-->

---
layout: image
image: /images/gitlab_ci_pipeline_run.svg
backgroundSize: contain
---

<!--
Well, the good news is, gitlab lets us run a pipeline from a particular branch, such as the one that is introducing the ci config file changes
-->

---
layout: image
image: /images/gitlab_ci_pipeline_run_variables.svg
backgroundSize: contain
---

<!--
And, it also let's us specify variables, for example, overriding those that would be predefined by gitlab.
-->

---
layout: image
image: /images/gitlab_ci_pipeline_running.svg
backgroundSize: contain
---

<!--
This is great because it lets us run a pipeline identically to how one would be run by gitlab, such as a post merge pipeline.
-->

---
layout: image
image: /images/gitlab_ci_pipeline_running_branch.svg
backgroundSize: contain
---

<!--
However, there is one limitation being that this pipeline depends on the changes for that particular branch,
-->

---
layout: image
image: /images/gitlab_ci_pipeline_execution_failed_crossed.svg
backgroundSize: contain
---

<!--
And therefore, we won't be able to catch our problem, as our branch doesn't introduce the changes that are needed to reveal that bug.
-->

---
layout: image
image: /images/branch_with_changes_diagram.svg
backgroundSize: contain
---

<!--
However there is another way, and that is by creating a branch off of our new ci config file, with any changes that are needed, such as updating a file that we expect to run in the test directory.
-->

---
layout: image
image: /images/gitlab_ci_pipeline_execution_failed_pipeline.svg
backgroundSize: contain
---

<!--
This is great, as it would reveal our problem,
-->

---
layout: image
image: /images/complex_pipes.svg
backgroundSize: contain
---

<!--
However, you may have noticed that this is an intensive and costly process, as it's slow and manual, and may not scale with all of the combinations of changes, that may be introduced with lots of different rules.

> 18:35 (01:45) {9}
-->

---
section: 10
---

# 3. Running Pipelines Locally

<!--
So, for our third method, we have something in between, something that's not as static as linting, and not as e2e as running entire pipelines.
-->

---
layout: image
image: /images/gitlab-ci-local_and_gitlabci-local.svg
backgroundSize: contain
---

<!--
For that, we can use tools like gitlab-ci-local and gitlabci-local.
Yes you heard me right, the difference is a dash…
-->

---
layout: image
image: /images/gitlab-ci-local.svg
backgroundSize: contain
---

<!--
gitlab dash ci dash local, is a typescript tool made by (Mass Yon Nielsen) Mads Jon Nielsen in January of 2020
-->

---
layout: image
image: /images/gitlabci-local.svg
backgroundSize: contain
---

<!--
And gitlabci dash local, is a python tool made by Adrian DC in January 2020.
-->

---
layout: image
image: /images/bizarre.svg
backgroundSize: contain
---

<!--
Honestly it's bizarre how just how similar these tools are, both in what they do, and when they were made.
-->

---
layout: image
image: /images/gitlab-ci-local_output_and_gitlabci-local_output.svg
backgroundSize: contain
---

<!--
But anyways, these two tools let us run the individual jobs of our gitlab pipelines, locally, using containers.
-->

---
layout: image
image: /images/long_live_the_king.svg
backgroundSize: contain
---

<!--
The core benefits of these tools are that they let us remove the dependency on gitlab.

We might not want to spin up an entire pipeline just to run a single job.

This is helpful as it quickens the feedback loop, by allowing us to locally replicate job environments that might otherwise be too different if simply run as a script.
-->

---
layout: image
image: /images/downsides.svg
backgroundSize: contain
---

<!--
That's not to say that these tools don't have downsides
-->

---
layout: image
image: /images/simulation.svg
backgroundSize: contain
---

<!--
Being simulators, they're not always going to match the real thing
-->

---
layout: image
image: /images/hourglass.svg
backgroundSize: contain
---

<!--
And if we're solely testing our pipeline changes, they don't give us any static information in advance, and require us to wait for jobs to finish running.
-->

---
layout: image
image: /images/gitlab_ci_pipeline_execution_failed.svg
backgroundSize: contain
---

<!--
So in our examples above, both of these tools also won't help us uncover our problem, even though they might have other benefits.

> 20:35 (02:00) {10}
-->

---
section: 11
---

# 4. Configuration Static Analysis Testing

<!--
So with the forth method, let's explore a different kind of testing.
-->

---
layout: image
image: /images/404.svg
backgroundSize: contain
---

<!--
In this front, I wasn't able to find any kind of static analysis testing tools for ci config files, and thus to solve this problem, I took the initiative to make a tool myself...
-->

---
layout: image
image: /images/ci_test.png
backgroundSize: contain
---

<!--
ci-test!

ci-test acts as the missing piece of the linting/e2e/integration testing puzzle, by functioning as a framework, for static analysis testing.

Think of it as a tool box to add to your shed of equipment.

By analysing the ci config file, and, how it's changed, we can gain a better understanding of what the pipeline is meant to look like.
-->

---
---

````md magic-move
```json
[
  {
    "changes": [
      "**/*.py"
    ],
    "jobs": [
      "test-job"
    ]
  }
]
```
```json {7,10-17}
[
  {
    "changes": [
      "**/*.py"
    ],
    "jobs": [
      "database-test-job",
      "test-job"
    ]
  },
  {
    "changes": [
      "**/*.pu"
    ],
    "jobs": [
      "database-setup-job"
    ]
  }
]
```
```json
[
  {
    "changes": [
      "**/*.py"
    ],
    "jobs": [
      "database-setup-job",
      "database-test-job",
      "test-job"
    ]
  }
]
```
````

<!--
As an example, it can produce snapshots of the pipeline, by collating relevant information, such as pairing together lists of jobs and changes.

[click]

Thus using our example, when the change was made, we would get this diff.
This immediately lets us know that an additional rule set was created that is different from the expected rule set from from all other jobs.

[click]

So really, we should have seen this instead, where all the jobs are defined under the same changes.
-->

---
layout: image
image: /images/downsides.svg
backgroundSize: contain
---

<!--
Of course like everything else, it has it's drawbacks and can't solely be depended on, since it doesn't run in integration like the other methods.
-->

---
layout: image
image: /images/confidence.svg
backgroundSize: contain
---

<!--
But it is something simple, that will allow us, to quickly iterate, on rules with confidence, which was something that we couldn't do before.

> 22:10 (01:35) {11}
-->

---
section: 12
layout: image
image: /images/ci_test_refactor_0.svg
backgroundSize: contain
---

<!--
And it's true value was highlighted in one of my previous engagements.
-->

---
layout: image
image: /images/ci_test_refactor_1.svg
backgroundSize: contain
---

<!--
Their CI config file,
-->

---
layout: image
image: /images/ci_test_refactor_2.svg
backgroundSize: contain
---

<!--
was thousands of lines of unmaintainable yaml,
-->

---
layout: image
image: /images/ci_test_refactor_3.svg
backgroundSize: contain
---

<!--
And no one wanted to make CI changes.

If they needed to, the pipelines had to be baby sat,
for the case where, not if,
-->

---
layout: image
image: /images/ci_test_refactor_4.svg
backgroundSize: contain
---

<!--
but when, something unexpected would go wrong.
-->

---
layout: image
image: /images/ci_test_refactor_5.svg
backgroundSize: contain
---

<!--
This giant file handled deployments and everything else.
-->

---
layout: image
image: /images/ci_test_refactor_6.svg
backgroundSize: contain
---

<!--
And it was scary because if you wanted to make changes to merges,
-->

---
layout: image
image: /images/ci_test_refactor_7.svg
backgroundSize: contain
---

<!--
you didn't know if you'd be affecting deployments.
-->

---
layout: image
image: /images/ci_test_refactor_8.svg
backgroundSize: contain
---

<!--
Now because ci test is able to take snapshots to show what's changed, you could then do something clever.
-->

---
layout: image
image: /images/ci_test_refactor_9.svg
backgroundSize: contain
---

<!--
Say the config file is full of changes related to deployment, and everything else.
-->

---
layout: image
image: /images/ci_test_refactor_10.svg
backgroundSize: contain
---

<!--
And you wanted to refactor it to extract out all the changes related to deployment.
-->

---
layout: image
image: /images/ci_test_refactor_11.svg
backgroundSize: contain
---

<!--
First, what you would do, is make two copies of the config file.
-->

---
layout: image
image: /images/ci_test_refactor_12.svg
backgroundSize: contain
---

<!--
One to contain everything related to deployments,
-->

---
layout: image
image: /images/ci_test_refactor_13.svg
backgroundSize: contain
---

<!--
and the other, everything not related.
-->

---
layout: image
image: /images/ci_test_refactor_14.svg
backgroundSize: contain
---

<!--
Then you'd reduce the original config
-->

---
layout: image
image: /images/ci_test_refactor_15.svg
backgroundSize: contain
---

<!--
to include these files based on the workflow.
-->

---
layout: image
image: /images/ci_test_refactor_16.svg
backgroundSize: contain
---

<!--
Importantly at this step, when ci test takes a snapshot, the expected output will be the same.
-->

---
layout: image
image: /images/ci_test_refactor_17.svg
backgroundSize: contain
---

<!--
But now, ci test can be configured to take different snapshots, such as for the non deploy path,
-->

---
layout: image
image: /images/ci_test_refactor_18.svg
backgroundSize: contain
---

<!--
or for the deploy path.
-->

---
layout: image
image: /images/ci_test_refactor_19.svg
backgroundSize: contain
---

<!--
So now, if we want to refactor the two different configs,
-->

---
layout: image
image: /images/ci_test_refactor_20.svg
backgroundSize: contain
---

<!--
Removing anything that's unnecessary...
-->

---
layout: image
image: /images/ci_test_refactor_21.svg
backgroundSize: contain
---

<!--
the tests, (or in this case the output jobs,) don't change, signalling a safe refactor.

> 24:30 (02:20)
-->

---
layout: image
image: /images/notice_mark.svg
backgroundSize: contain
---

<!--
That all being said, don't take that as me going on the record to say that this will be the holy grail.
-->

---
layout: image
image: /images/contribute.svg
backgroundSize: contain
---

<!--
There is plenty of room for improvement, and it's been written in a way to be highly extensible.

So, if you want to help contribute to this, or, any other developer tooling, I'm more than happy to help!

Reach out, or make a pull request on GitHub!

> 25:00 (00:30) {12}
-->

---
section: 13
---

# 5. Pipeline Generation Tooling

<!--
The last method I'll cover, is using tools to dynamically generate pipelines using programming languages, like python.
-->

---
layout: image
image: /images/gitlab_ci_python_library.svg
backgroundSize: contain
---

<!--
gitlab-ci-python-library is the only up to date library I could find to do this,

(Although if you are interested, there are some typescript libraries which I had dismissed due to needing more attention)

Anyways, gitlab-ci-python-library, or gcip, is a library from Thomas (Schtienbahf) Steinbach and Daniel (fon essen) von Eßen, that allows you to replace your ci config file with python!
-->

---
layout: image
image: /images/question_mark.svg
backgroundSize: contain
---

<!--
Why would you want this?
-->

---
layout: image
image: /images/quote_box.svg
backgroundSize: contain
---
> Creating your pipelines in Python code allows you all the features of that language, like:
>
> <v-clicks>
>
> * re-use code (DRY - Don't Repeat Yourself)
> * use variables, control flow (if-then-else, loops, ...), complex data structures, input/output, error handling, ...
> * programming paradigms like object-oriented or functional programming
> * use 3rd party libraries in your pipelines, like boto3
> * test driven development of Pipelines with pytest
> * package management and distribution of your pipeline code
> * ... anything you can imagine to do with Python code
>
> </v-clicks>

<style>
blockquote {
  @apply absolute left-[9%] right-[9%] top-[25%] p-0 bg-transparent border-none text-black text-base;
}
</style>

<!--
Well if we quote the library, we can utilise all the features of python such as:
* code re-use
* variables, control flows, and the like
* programming paradigms
* libraries
* testing
* packaging
* and anything else you can imagine!

> 26:10 (01:10) {13}
-->

---
section: 14
layout: image
image: /images/question_mark.svg
backgroundSize: contain
---

<!--
So how do generated pipelines work?
-->

---
layout: image
image: /images/gcip_diagram_0.svg
backgroundSize: contain
---

<!--
In our ci config file, where we've been defining our testing jobs,
-->

---
layout: image
image: /images/gcip_diagram_1.svg
backgroundSize: contain
---

<!--
we instead define a generate pipeline job,
-->

---
layout: image
image: /images/gcip_diagram_2.svg
backgroundSize: contain
---

<!--
which runs our python ci config file,
-->

---
layout: image
image: /images/gcip_diagram_3.svg
backgroundSize: contain
---

<!--
to create a generated config ci file, that contains all of the previous jobs that we want to run.
-->

---
layout: image
image: /images/gcip_diagram_4.svg
backgroundSize: contain
---

<!--
The original ci config file had also defined a run pipeline job,
-->

---
layout: image
image: /images/gcip_diagram_5.svg
backgroundSize: contain
---

<!--
that, has a needs on the generate pipeline job,
-->

---
layout: image
image: /images/gcip_diagram_6.svg
backgroundSize: contain
---

<!--
as it uses, the generated ci config file,
-->

---
layout: image
image: /images/gcip_diagram_7.svg
backgroundSize: contain
---

<!--
to create a child pipeline that runs all of the previous jobs that we wanted to run.

> 27:10 (01:00) {14}
-->

---
section: 15
layout: image
image: /images/python_not_yaml.svg
backgroundSize: contain
---

<!--
So what would it look like to replace our yaml with python?
-->

---
---

````md magic-move
```python {1}
# .gitlab-ci.py
```
```python {2}
# .gitlab-ci.py
import gcip
```
```python {4}
# .gitlab-ci.py
import gcip

pipeline = gcip.Pipeline()
```
```python {5}
# .gitlab-ci.py
import gcip

pipeline = gcip.Pipeline()
pipeline.initialize_image("python:latest")
```
```python {7-8}
# .gitlab-ci.py
import gcip

pipeline = gcip.Pipeline()
pipeline.initialize_image("python:latest")

test_job = gcip.Job(
)

```
```python {8}
# .gitlab-ci.py
import gcip

pipeline = gcip.Pipeline()
pipeline.initialize_image("python:latest")

test_job = gcip.Job(
    name="test-job",
)

```
```python {9}
# .gitlab-ci.py
import gcip

pipeline = gcip.Pipeline()
pipeline.initialize_image("python:latest")

test_job = gcip.Job(
    name="test-job",
    script="python test.py",
)

```
```python {10}
# .gitlab-ci.py
import gcip

pipeline = gcip.Pipeline()
pipeline.initialize_image("python:latest")

test_job = gcip.Job(
    name="test-job",
    script="python test.py",
    rules=[gcip.Rule(changes=["**/*.py"])],
)
```
```python {13-23}
# .gitlab-ci.py
import gcip

pipeline = gcip.Pipeline()
pipeline.initialize_image("python:latest")

test_job = gcip.Job(
    name="test-job",
    script="python test.py",
    rules=[gcip.Rule(changes=["**/*.py"])],
)

database_setup_job = gcip.Job(
    name="database-setup-job",
    script="python setup_test_database.py",
    rules=[gcip.Rule(changes=["**/*.pu"])],
)

database_test_job = gcip.Job(
    name="database-test-job",
    script="python database_tests.py",
    rules=[gcip.Rule(changes=["**/*.py"])],
)







```
```python {22}
# .gitlab-ci.py
import gcip

pipeline = gcip.Pipeline()
pipeline.initialize_image("python:latest")

test_job = gcip.Job(
    name="test-job",
    script="python test.py",
    rules=[gcip.Rule(changes=["**/*.py"])],
)

database_setup_job = gcip.Job(
    name="database-setup-job",
    script="python setup_test_database.py",
    rules=[gcip.Rule(changes=["**/*.pu"])],
)

database_test_job = gcip.Job(
    name="database-test-job",
    script="python database_tests.py",
    needs=[database_setup_job],
    rules=[gcip.Rule(changes=["**/*.py"])],
)







```
```python {26-30}
# .gitlab-ci.py
import gcip

pipeline = gcip.Pipeline()
pipeline.initialize_image("python:latest")

test_job = gcip.Job(
    name="test-job",
    script="python test.py",
    rules=[gcip.Rule(changes=["**/*.py"])],
)

database_setup_job = gcip.Job(
    name="database-setup-job",
    script="python setup_test_database.py",
    rules=[gcip.Rule(changes=["**/*.pu"])],
)

database_test_job = gcip.Job(
    name="database-test-job",
    script="python database_tests.py",
    needs=[database_setup_job],
    rules=[gcip.Rule(changes=["**/*.py"])],
)

pipeline.add_children(
    test_job,
    database_setup_job,
    database_test_job,
)

```
```python {32}
# .gitlab-ci.py
import gcip

pipeline = gcip.Pipeline()
pipeline.initialize_image("python:latest")

test_job = gcip.Job(
    name="test-job",
    script="python test.py",
    rules=[gcip.Rule(changes=["**/*.py"])],
)

database_setup_job = gcip.Job(
    name="database-setup-job",
    script="python setup_test_database.py",
    rules=[gcip.Rule(changes=["**/*.pu"])],
)

database_test_job = gcip.Job(
    name="database-test-job",
    script="python database_tests.py",
    needs=[database_setup_job],
    rules=[gcip.Rule(changes=["**/*.py"])],
)

pipeline.add_children(
    test_job,
    database_setup_job,
    database_test_job,
)

pipeline.write_yaml()
```
````

<!--
Well first we create a `.gitlab-ci.py` file,

[click]

then import the library,

[click]

create a pipeline,

[click]

specify the default image,

[click]

then, we create a job,

[click]

give it a name,

[click]

add a script,

[click]

and it's rules,

[click]

doing the same for the other jobs

[click]

add in our needs

[click]

before finally adding all jobs as children of the pipeline

[click]

And then writing that pipeline out to yaml
-->

---
layout: image
image: /images/gitlab_ci_gcip_pipeline_success.svg
backgroundSize: contain
---

<!--
And sure enough, we can have this pipeline execute in the repo,
-->

---
layout: image
image: /images/gitlab_ci_gcip_pipeline_success_expanded.svg
backgroundSize: contain
---

<!--
with all of our expected downstream jobs.
-->

---
layout: image
image: /images/plumber_thinking.svg
backgroundSize: contain
---

<!--
However, has this caused our initial problem to go away?
-->

---
layout: image
image: /images/gitlab_ci_gcip_pipeline_fail.svg
backgroundSize: contain
---

<!--
Well, it doesn't give us any protections from the pipeline failing to run, because again, there were no reasons for it to run correctly, since there were no `.pu` changes.

> 28:25 (01:15) {15}
-->

---
section: 16
layout: image
image: /images/disappointed.svg
backgroundSize: contain
---

<!--
So unfortunately, it seems like generated pipelines won't directly solve our problem.

That being said, they can help!
-->

---
---

````md magic-move
```python {1}
# pipeline_test.py
```
```python {2}
# pipeline_test.py
from pipeline_ci_config import pipeline
```
```python {4-8}
# pipeline_test.py
from pipeline_ci_config import pipeline

def test_pipeline_jobs_for_rules(expected_jobs_for_rules):

    actual_jobs_for_rules = get_jobs_for_rules(pipeline)
    
    assert actual_jobs_for_rules == expected_jobs_for_rules

...
```
```python {6}
# pipeline_test.py
from pipeline_ci_config import pipeline

def test_pipeline_jobs_for_rules(expected_jobs_for_rules):

    actual_jobs_for_rules = get_jobs_for_rules(pipeline)
    
    assert actual_jobs_for_rules == expected_jobs_for_rules

...
```
```python
# pipeline_test.py
from pipeline_ci_config import pipeline

def test_pipeline_jobs_for_rules(expected_jobs_for_rules):

    actual_jobs_for_rules = get_jobs_for_rules(pipeline)
    
    assert actual_jobs_for_rules == expected_jobs_for_rules

...
```
````

<!--
As the authors mentioned earlier, this programmatic approach does let you,

[click]

import your pipeline,

[click]

and perform tests on it,

[click]

allowing us to do something similar like we've done with ci-test.

[click]

However, there is one other thing to consider...
-->

---
---

````md magic-move
```python {*}
# .gitlab-ci.py
import gcip

pipeline = gcip.Pipeline()
pipeline.initialize_image("python:latest")

test_job = gcip.Job(
    name="test-job",
    script="python test.py",
    rules=[gcip.Rule(changes=["**/*.py"])],
)

database_setup_job = gcip.Job(
    name="database-setup-job",
    script="python setup_test_database.py",
    rules=[gcip.Rule(changes=["**/*.pu"])],
)

database_test_job = gcip.Job(
    name="database-test-job",
    script="python database_tests.py",
    needs=[database_setup_job],
    rules=[gcip.Rule(changes=["**/*.py"])],
)

pipeline.add_children(
    test_job,
    database_setup_job,
    database_test_job,
)
pipeline.write_yaml()
```
```python {7}
# .gitlab-ci.py
import gcip

pipeline = gcip.Pipeline()
pipeline.initialize_image("python:latest")

app_changelist = ["**/*.py"]

test_job = gcip.Job(
    name="test-job",
    script="python test.py",
    rules=[gcip.Rule(changes=["**/*.py"])],
)

database_setup_job = gcip.Job(
    name="database-setup-job",
    script="python setup_test_database.py",
    rules=[gcip.Rule(changes=["**/*.pu"])],
)

database_test_job = gcip.Job(
    name="database-test-job",
    script="python database_tests.py",
    needs=[database_setup_job],
    rules=[gcip.Rule(changes=["**/*.py"])],
)

pipeline.add_children(
    test_job,
    database_setup_job,
    database_test_job,
)
pipeline.write_yaml()
```
```python {7,12,18}
# .gitlab-ci.py
import gcip

pipeline = gcip.Pipeline()
pipeline.initialize_image("python:latest")

app_changelist = ["**/*.py"]

test_job = gcip.Job(
    name="test-job",
    script="python test.py",
    rules=[gcip.Rule(changes=app_changelist)],
)

database_setup_job = gcip.Job(
    name="database-setup-job",
    script="python setup_test_database.py",
    rules=[gcip.Rule(changes=app_changelist)],
)

database_test_job = gcip.Job(
    name="database-test-job",
    script="python database_tests.py",
    needs=[database_setup_job],
    rules=[gcip.Rule(changes=app_changelist)],
)

pipeline.add_children(
    test_job,
    database_setup_job,
    database_test_job,
)
pipeline.write_yaml()
```
````

<!--
Since our pipeline is now in Python,

[click]

they do let us easily create a changeset using a list,

[click]

that we can apply everywhere, and thus help alleviate any rule mismatches, as all the rules will now be the same.
This may have those of you knowledgeable in yaml thinking...
-->

---
layout: default
---

````md magic-move
```yaml {*}
# .gitlab-ci.yml
image: python:latest

test-job:
    script: "python test.py"
    rules:
        - changes:
            - "**/*.py"

database-setup-job:
    script: "python setup_test_database.py"
    rules:
        - changes:
            - "**/*.pu"

database-test-job:
    script: "python database_tests.py"
    needs:
        - "database-setup-job"
    rules:
        - changes:
            - "**/*.py"
```
```yaml {4-5}
# .gitlab-ci.yml
image: python:latest

.app-changelist: &app-changelist
    - "**/*.py"

test-job:
    script: "python test.py"
    rules:
        - changes:
            - "**/*.py"

database-setup-job:
    script: "python setup_test_database.py"
    rules:
        - changes:
            - "**/*.pu"

database-test-job:
    script: "python database_tests.py"
    needs:
        - "database-setup-job"
    rules:
        - changes:
            - "**/*.py"
```
```yaml {4-5,10,15}
# .gitlab-ci.yml
image: python:latest

.app-changelist: &app-changelist
    - "**/*.py"

test-job:
    script: "python test.py"
    rules:
        - changes: *app-changelist

database-setup-job:
    script: "python setup_test_database.py"
    rules:
        - changes: *app-changelist

database-test-job:
    script: "python database_tests.py"
    needs:
        - "database-setup-job"
    rules:
        - changes: *app-changelist
```
````

<!--
"Doesn't yaml also let you create a list that can be referenced?"
And you'd be correct.

[click]

we _can_ create a key with an anchor,

[click]

and reference them with aliases to do the same thing and solve our problem.
-->

---
layout: image
image: /images/yaml_list_error.svg
backgroundSize: contain
---

<!--
But if we wanted to do something like extend this change set, it wouldn't be as easy, as yaml doesn't allow merging of lists.
-->

---
layout: image
image: /images/gitlab_yaml_list_docs.svg
backgroundSize: contain
---

<!--
Well that's not entirely correct, gitlab does allow you to merge lists,
-->

---
layout: image
image: /images/yaml_list_invalid.svg
backgroundSize: contain
---

<!--
However this doesn't work for all cases, as it won't result in valid yaml.

> 29:55 (01:30) {16}
-->

---
section: 17
layout: image
image: /images/thought_bubble.svg
backgroundSize: contain
---

<!--
So are generated pipelines a good idea?
I think the authors have a good view of this, which I'll do my best to summarise
-->

---
layout: image
image: /images/gcip_quote_cons.svg
backgroundSize: contain
---

<!--
The cons are that it could allow for writing complex pipelines that nobody else understands, when they should be basic things that build and test your code and shouldn't be in code too.
-->

---
layout: image
image: /images/gcip_quote_pros.svg
backgroundSize: contain
---

<!--
But,
- if you're not fond of yaml,
- your ci files are growing to over thousands of lines long,
- or they're littered with complex rule sets,

maybe writing them in code is cleaner.
-->

---
layout: image
image: /images/gcip_quote_summary.svg
backgroundSize: contain
---

<!--
Importantly, it's a choice that's up to you, your team, and, the situation.

> 30:45 (00:50) {17}
-->

---
section: 18
layout: image
image: /images/thinking.svg
backgroundSize: contain
---

<!--
If you do see the need to integrate some kind of programming in your configuration, but feel like pipeline generation is too much, there is one other approach to consider.
-->

---
layout: image
image: /images/cog.png
backgroundSize: contain
---

<!--
And that is using Cog.

Cog is a tool that allows you to use small bits of Python code in static files to generate the text that you need.
-->

---
layout: default
---

````md magic-move
```yaml {1,8,14}
# .gitlab-ci.yml
image: python:latest

test-job:
    script: "python test.py"
    rules:
        - changes:
            - "**/*.py"

database-setup-job:
    script: "python setup_test_database.py"
    rules:
        - changes:
            - "**/*.pu"

database-test-job:
    script: "python database_tests.py"
    needs:
        - "database-setup-job"
    rules:
        - changes:
            - "**/*.py"
```
```yaml {2-4}
# .gitlab-ci.yml
#[[[cog
#]]]
#[[[end]]]

image: python:latest

test-job:
    script: "python test.py"
    rules:
        - changes:
            - "**/*.py"

database-setup-job:
    script: "python setup_test_database.py"
    rules:
        - changes:
            - "**/*.py"

database-test-job:
    script: "python database_tests.py"
    needs:
        - "database-setup-job"
    rules:
        - changes:
            - "**/*.py"
```
```yaml {3-4}
# .gitlab-ci.yml
#[[[cog
# def app_changelist():
#     changes = ["**/*.py"]
#]]]
#[[[end]]]

image: python:latest

test-job:
    script: "python test.py"
    rules:
        - changes:
            - "**/*.py"

database-setup-job:
    script: "python setup_test_database.py"
    rules:
        - changes:
            - "**/*.py"

database-test-job:
    script: "python database_tests.py"
    needs:
        - "database-setup-job"
    rules:
        - changes:
            - "**/*.py"
```
```yaml {3}
# .gitlab-ci.yml
#[[[cog
# import cog
# def app_changelist():
#     changes = ["**/*.py"]
#]]]
#[[[end]]]

image: python:latest

test-job:
    script: "python test.py"
    rules:
        - changes:
            - "**/*.py"

database-setup-job:
    script: "python setup_test_database.py"
    rules:
        - changes:
            - "**/*.py"

database-test-job:
    script: "python database_tests.py"
    needs:
        - "database-setup-job"
    rules:
        - changes:
            - "**/*.py"
```
```yaml {6-7}
# .gitlab-ci.yml
#[[[cog
# import cog
# def app_changelist():
#     changes = ["**/*.py"]
#     for change in changes:
#         cog.outl(f'- "{change}"')
#]]]
#[[[end]]]

image: python:latest

test-job:
    script: "python test.py"
    rules:
        - changes:
            - "**/*.py"

database-setup-job:
    script: "python setup_test_database.py"
    rules:
        - changes:
            - "**/*.py"

database-test-job:
    script: "python database_tests.py"
    needs:
        - "database-setup-job"
    rules:
        - changes:
            - "**/*.py"
```
```yaml {16-17}
# .gitlab-ci.yml
#[[[cog
# import cog
# def app_changelist():
#     changes = ["**/*.py"]
#     for change in changes:
#         cog.outl(f'- "{change}"')
#]]]
#[[[end]]]

image: python:latest

test-job:
    script: "python test.py"
    rules:
        - changes:
            - "**/*.py"

database-setup-job:
    script: "python setup_test_database.py"
    rules:
        - changes:
            - "**/*.py"

database-test-job:
    script: "python database_tests.py"
    needs:
        - "database-setup-job"
    rules:
        - changes:
            - "**/*.py"
```
```yaml {16-18}
# .gitlab-ci.yml
#[[[cog
# import cog
# def app_changelist():
#     changes = ["**/*.py"]
#     for change in changes:
#         cog.outl(f'- "{change}"')
#]]]
#[[[end]]]

image: python:latest

test-job:
    script: "python test.py"
    rules:
        - changes:
            #[[[cog app_changelist()]]]
            #[[[end]]]

database-setup-job:
    script: "python setup_test_database.py"
    rules:
        - changes:
            #[[[cog app_changelist()]]]
            #[[[end]]]

database-test-job:
    script: "python database_tests.py"
    needs:
        - "database-setup-job"
    rules:
        - changes:
            #[[[cog app_changelist()]]]
            #[[[end]]]
```
```yaml {16-18}
# .gitlab-ci.yml
#[[[cog
# import cog
# def app_changelist():
#     changes = ["**/*.py"]
#     for change in changes:
#         cog.outl(f'- "{change}"')
#]]]
#[[[end]]]
image: python:latest

test-job:
    script: "python test.py"
    rules:
        - changes:
            #[[[cog app_changelist()]]]
            - "**/*.py"
            #[[[end]]]

database-setup-job:
    script: "python setup_test_database.py"
    rules:
        - changes:
            #[[[cog app_changelist()]]]
            - "**/*.py"
            #[[[end]]]

database-test-job:
    script: "python database_tests.py"
    needs:
        - "database-setup-job"
    rules:
        - changes:
            #[[[cog app_changelist()]]]
            - "**/*.py"
            #[[[end]]]
```
```yaml {19}
# .gitlab-ci.yml
#[[[cog
# import cog
# def app_changelist():
#     changes = ["**/*.py"]
#     for change in changes:
#         cog.outl(f'- "{change}"')
#]]]
#[[[end]]]
image: python:latest

test-job:
    script: "python test.py"
    rules:
        - changes:
            #[[[cog app_changelist()]]]
            - "**/*.py"
            #[[[end]]]
            - "**/tests/**"

database-setup-job:
    script: "python setup_test_database.py"
    rules:
        - changes:
            #[[[cog app_changelist()]]]
            - "**/*.py"
            #[[[end]]]

database-test-job:
    script: "python database_tests.py"
    needs:
        - "database-setup-job"
    rules:
        - changes:
            #[[[cog app_changelist()]]]
            - "**/*.py"
            #[[[end]]]
```
````

<!--
So in our previous example where we wanted to unify these as a list...

[click]

We would first create a comment with a cog block

[click]

Add a python function to specify our changes

[click]

import cog, ...

[click]

To output the changes on iteration

[click]

And then where we've defined our changes,

[click]

we can use cog to run that function to output the change list.

Then, when we run cog over the file,

[click]

It'll update what's between the tags with our generated output.

And because it works on the file itself, there's no guessing what the generation will do.

[click]

Meaning that extending our list for one particular case is both easy to do and understand!

> 32:15 (1:30) {18}
-->

---
section: 19
---

````md magic-move
```yaml {17}
# .gitlab-ci.yml
#[[[cog
# import cog
# def app_changelist():
#     changes = ["**/*.py"]
#     for change in changes:
#         cog.outl(f'- "{change}"')
#]]]
#[[[end]]]
image: python:latest

test-job:
    script: "python test.py"
    rules:
        - changes:
            #[[[cog app_changelist()]]]
            - "**/*.pu"
            #[[[end]]]
            - "**/tests/**"

database-setup-job:
    script: "python setup_test_database.py"
    rules:
        - changes:
            #[[[cog app_changelist()]]]
            - "**/*.py"
            #[[[end]]]

database-test-job:
    script: "python database_tests.py"
    needs:
        - "database-setup-job"
    rules:
        - changes:
            #[[[cog app_changelist()]]]
            - "**/*.py"
            #[[[end]]]
```
```yaml {18}
# .gitlab-ci.yml
#[[[cog
# import cog
# def app_changelist():
#     changes = ["**/*.py"]
#     for change in changes:
#         cog.outl(f'- "{change}"')
#]]]
#[[[end]]] (sum: 1B2M2Y8Asg)
image: python:latest

test-job:
    script: "python test.py"
    rules:
        - changes:
            #[[[cog app_changelist()]]]
            - "**/*.pu"
            #[[[end]]] (sum: KXQVeDRZak)
            - "**/tests/**"

database-setup-job:
    script: "python setup_test_database.py"
    rules:
        - changes:
            #[[[cog app_changelist()]]]
            - "**/*.py"
            #[[[end]]] (sum: KXQVeDRZak)

database-test-job:
    script: "python database_tests.py"
    needs:
        - "database-setup-job"
    rules:
        - changes:
            #[[[cog app_changelist()]]]
            - "**/*.py"
            #[[[end]]] (sum: KXQVeDRZak)
```
````

<!--
If you're wondering "What if someone accidentally changes what's between the tags?" 

Then there's a couple of options you have to protect your platform.

[click]

Such as enabling the checksum flag, which, when running cog...
-->

---

```sh
.gitlab-ci.yml(18):
    Output has been edited!
    Delete old checksum to unprotect.
```

<!--
will cause it to complain about an unexpected edit.
-->

---

```diff {2,9-10,14}
-diff .gitlab-ci.cog.yml
Checking .gitlab-ci.cog.yml  (changed)
--- current .gitlab-ci.cog.yml
+++ changed .gitlab-ci.cog.yml
@@ -14,7 +14,7 @@
     rules:
         - changes:
             #[[[cog app_changelist()]]]
-            - "**/*.pu"
+            - "**/*.py"
             #[[[end]]]
             - "**/tests/**"
 
Check failed
```

<!--
Or using the check and diff flags within a CI job before the PR is merged, which will error highlighting that an unexpected change has been made.

> 32:50 (00:35) {19}
-->

---
section: 20
---

# 1. Configuration Linting
# 2. Running End to End Pipelines
# 3. Running Pipelines Locally
# 4. Configuration Static Analysis Testing
# 5. Pipeline Generation Tooling

<!--
So to close out, if we look back the techniques and ask, what is the best approach?

Well, it really depends, on what your CI looks like.

If your ci config file has become thousands of lines long, then generating it dynamically, or writing tests may help relieve that burden.

But at the end of the day, all these methods, are only tools to assist us in our problems,
-->

---
layout: image
image: /images/complex_pipes.svg
backgroundSize: contain
---

<!--
And if the underlying problem is the thousands of lines of CI configuration, it might help to start there instead,

because as complexity increases, so too, do time consuming problems that require testing to prevent.   

Choosing one tool, over another, will _still_ be adding another component, to something that is likely already complex, that, you'll later have to deal with.
-->

---
layout: default
---

```yaml
# .gitlab-ci.yml
image: python:latest

test-job:
    script: "python test.py"
```

<!--
And so if your pipeline is as simple as this, it may very well be reasonable to need nothing at all.
-->

---
layout: image
image: /images/simplicity.svg
backgroundSize: contain
---

<!--
Thus, my view from all of this is that simplicity is key.

Question everything that is there, and utilise the least you can, to get the job done.

> 34:20 (01:30)
-->

---
class: h-full flex flex-col items-center
---

# `@ekohilas`
# `citest.nohumanerrors.com`
<img src="/images/qr_code.svg" alt="qr code" class="flex-1 min-h-0 object-contain">

# <br>

<!--
If you're after the resources from this talk, you can find them in these links.

And if any of this was of interest to you, reach out!

I'm looking for my next engagement and would love to work with you on solving complex problems. 

If you enjoyed this talk, please take a picture to share it online.

You can also subscribe to my mailing list on nohumanerrors.com, or find me online at ekohilas if you want to get in touch or give feedback.
-->

---
layout: image
image: /images/questions.svg
backgroundSize: contain
---

<!--
And, if you're still wondering who tests the testers, I'll be around for questions!
-->

---
layout: image
image: /images/ddd_sponsors.png
backgroundSize: contain
---

<!--
Thanks to all the sponsors of DDD for bringing us all together,
my friends and family for supporting me,
the open source contributors,
and finally to you, for listening!
-->

---
class: h-full flex flex-col items-center
---

# `@ekohilas`
# `citest.nohumanerrors.com`
<img src="/images/qr_code.svg" alt="qr code" class="flex-1 min-h-0 object-contain">

# Thanks!

<!--
I'll leave this up now so you can actually take pictures.
Thanks!

> 35:20 (01:00) {20}
-->
