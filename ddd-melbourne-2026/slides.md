<!-- .slide: data-background-video="images/3d_pipes.webm" data-background-video-loop="loop" data-background-size="contain" -->

Thank you! I'm so humbled to be speaking at DDD! 

Alrighty then, to start with, can I get some noise from anyone else who thinks this is an awesome screensaver?

Yeah! It's quite fitting for a pipelines talk isn't it?

> TODO: Update bio?
> TODO: Bring back generated pipelines explanation to fill time
> TODO: Dry run with timings.

------
# Who Tests the Testers?<br>Making and Testing Pipelines
<!-- .element: class="r-fit-text" -->
### Evan Kohilas
### `@ekohilas`
### `nohumanerrors.com`

So, [as you may have heard,] I'm Evan, and I've dedicated a fair bit of my time on platform software engineering, that reduces human errors through things like working on pipelines to run tests for a codebase.

---
<!-- .slide: data-background-image="images/oopsies.svg"-->

However, I noticed that I, myself, made quite a few errors.

------
<!-- .slide: data-background-image="images/superhero.svg"-->

And I don't say this because I think I'm this perfect person that should never make errors.

------
<!-- .slide: data-background-image="images/test.svg"-->

But because it highlighted to me that these errors could've been prevented if there were tests.

------
<!-- .slide: data-background-image="images/thinking.svg"-->

And so these events got me thinking. If platform teams can help engineers run tests, for their codebase, who helps the platform teams, write the tests for, running the tests?

------
# 1. How to <u>make</u> a pipeline
<!-- .element: class="fragment" -->
# 2. How to <u>break</u> a pipeline
<!-- .element: class="fragment" -->
# 3. How to <u>not</u> break a pipeline
<!-- .element: class="fragment" -->

So today, we'll walk through this journey of mine, in 3 parts.

> Next slide

1. I'll briefly introduce what a pipeline is, and cover how to make one,
2. show how I've found ways that they can break,
3. and finally, deep dive into the methods to stop them from breaking.

> > 01:30 (01:30) {1}

---
<!-- .element: data-background-image="images/raised_hands.svg"-->

Alright, for this section, could I please ask everyone to raise their hand.

We're gonna do a little survey.

And I'll also ask to take a photo, cause I didn't think that'd work.

------
<!-- .element: data-background-image="images/complete_pipeline.svg"-->

Okay keep your hand raised, if you know what a pipeline is.

Okay great, don't put your hands down just yet, keep your hands raised

------
<!-- .slide: data-background-image="images/running_pipeline.svg"-->

if you you've worked with a pipeline.

Nice, now keep it up,

------
<!-- .slide: data-background-image="images/writing_pipeline.svg"-->

if you've written a pipeline.

Cool cool, last one, keep it raised,

------
<!-- .slide: data-background-image="images/gitlab_ci_pipeline_execution_failed.svg"-->

if you've had a pipeline that you've written fail on you.

Wow x of you.

> 02:30 (01:00) {2}

---
<!-- .slide: data-background-image="images/full_pipeline.svg"-->

Okay, so that we're all on the same level, for those of you who haven't seen a pipeline before, they can look something like this

------
<!-- .slide: data-background-image="images/factory_line.svg"-->

And to put it simply, you can think of them as a factory line, where each step performs different operations to get to the final product.
But in our case, our operations can look something like

------
<!-- .slide: data-background-image="images/setup_step.svg"-->

"setup"

------
<!-- .slide: data-background-image="images/setup_build_step.svg"-->

"build"

------
<!-- .slide: data-background-image="images/setup_build_test_step.svg"-->

"test"

------
<!-- .slide: data-background-image="images/setup_build_test_deploy_step.svg"-->

with our final operation deploying this built and tested product.

------
<!-- .slide: data-background-image="images/pipe_sparkles.svg"-->

So why are pipelines good?

------
<!-- .slide: data-background-image="images/pipe_shrug.svg"-->

Why should you care about them?

------
<!-- .slide: data-background-image="images/streamlined.svg"-->

Well, they allow us in one case, to create a streamlined process that automates what would otherwise be very manual.

------
<!-- .slide: data-background-image="images/quality_control.svg"-->

And in other cases, they can act as a quality control.

This is similar to a factory line.

------
<!-- .slide: data-background-image="images/stage_failure.svg"-->

If any stage of the factory line fails, like building or quality assurance,

------
<!-- .slide: data-background-image="images/item_push.svg"-->

that item, or in our case, some code, won't progress to the next stage, and thus won't be allowed to merge, or even deployed.

------
<!-- .slide: data-background-image="images/gitlab_logo.svg"-->

Now while my journey (if you hadn't noticed) takes place within GitLab Pipelines,

------
<!-- .slide: data-background-image="images/ci_logos.svg"-->

don't fret if you're a user of other CI tools!
My goal is for the ideas to be general enough to be applicable!
And, for tools like GitHub Actions, additional resources will be given at the end.

> 04:00 (01:30) {3}

---
<!-- .slide: data-background-image="images/gitlab_ci_yml.svg"-->

So the first part of this journey is making a gitlab pipeline.
And to do so, we need to create a `.gitlab-ci.yml` file, that gitlab will use as configuration. (That's kind of a mouth-full, so I'll try to refer to it as a ci config file from here on)

------
<!-- .slide: data-background-image="images/object_json_yaml.svg"-->

If you're new to yaml, think of it as a way to store maps and lists. similar to json, but more human friendly.

https://carbon.now.sh/?bg=rgba%28255%2C255%2C255%2C1%29&t=one-light&wt=none&l=application%2Fjson&width=680&ds=true&dsyoff=20px&dsblur=25px&wc=true&wa=true&pv=51px&ph=64px&ln=false&fl=1&fm=Source+Code+Pro&fs=18px&lh=133%25&si=false&es=4x&wm=false&code=%257B%250A%2520%2520%2522object%2522%253A%2520%257B%250A%2520%2520%2520%2520%2522key%2522%253A%2520%2522value%2522%252C%250A%2520%2520%2520%2520%2522array%2522%253A%2520%255B1%252C%2520false%255D%250A%2520%2520%257D%250A%257D%250A
https://carbon.now.sh/?bg=rgba%28255%2C255%2C255%2C1%29&t=one-light&wt=none&l=yaml&width=680&ds=true&dsyoff=20px&dsblur=25px&wc=true&wa=true&pv=51px&ph=64px&ln=false&fl=1&fm=Source+Code+Pro&fs=18px&lh=133%25&si=false&es=4x&wm=false&code=object%253A%250A%2520%2520key%253A%2520value%2520%250A%2520%2520array%253A%250A%2520%2520%2520%2520-%25201%250A%2520%2520%2520%2520-%2520false%250A

------
<!-- .element: data-auto-animate -->
```yaml[1]
# .gitlab-ci.yml
```
<!-- .element: data-id="simple-ci" -->

We'll make a simple one now, that one can use on their repo to ensure tests pass before merging

------
<!-- .element: data-auto-animate -->
```yaml[2]
# .gitlab-ci.yml
image: python:latest
```
<!-- .element: data-id="simple-ci" -->

Here we define that we want jobs to run with a docker image that contains the latest version of your programming language of choice, which for this talk, will be python.


------
<!-- .element: data-auto-animate -->
```yaml[4]
# .gitlab-ci.yml
image: python:latest

test-job:
```
<!-- .element: data-id="simple-ci" -->

Then we define a job, with the name test-job

------
<!-- .element: data-auto-animate -->
```yaml[5]
# .gitlab-ci.yml
image: python:latest

test-job:
    script: "python test.py"
```
<!-- .element: data-id="simple-ci" -->

And below we define "script" as the command to run for that job, which for us will be a python file called `test.py`

------
<!-- .element: data-auto-animate -->
```yaml[]
# .gitlab-ci.yml
image: python:latest

test-job:
    script: "python test.py"
```
<!-- .element: data-id="simple-ci" -->

Of course this is probably the simplest pipeline we could create, and thus shouldn't be used as a reference.

This is because it's utilising a lot of what gitlab is offering by default, and we can get away with not having to install any packages as none are being used.

So if you are looking for reference pipelines, I'll have some links in the resources at the end.

That being said, given how simple this example pipeline is, it probably doesn't mimic the issues that a real pipeline that I've worked on might, so let's extend it to do so.

> TODO: Emphasise that this is an example for an error

------
<!-- .element: data-auto-animate -->
```yaml[6]
# .gitlab-ci.yml
image: python:latest

test-job:
    script: "python test.py"
    rules:
```
<!-- .element: data-id="simple-ci" -->

To do this, we'll add some rules, which decide on what conditions the job runs

------
<!-- .element: data-auto-animate -->
```yaml[7]
# .gitlab-ci.yml
image: python:latest

test-job:
    script: "python test.py"
    rules:
        - changes:
```
<!-- .element: data-id="simple-ci" -->

We'll then specify that we want the job to run whenever there's changes that have been made.

------
<!-- .element: data-auto-animate -->
```yaml[8]
# .gitlab-ci.yml
image: python:latest

test-job:
    script: "python test.py"
    rules:
        - changes:
            - "**/*.py"
```
<!-- .element: data-id="simple-ci" -->

Such as changes to any python files.

------
<!-- .element: data-auto-animate -->
```yaml[]
# .gitlab-ci.yml
image: python:latest

test-job:
    script: "python test.py"
    rules:
        - changes:
            - "**/*.py"
```
<!-- .element: data-id="simple-ci" -->

This is so that we can speed up our pipelines by not unnecessarily running a costly job, on unrelated changes, to other files within our repo, such as documentation.
Another thing we might need to extend on, is having to run different types of testing jobs.

------
<!-- .element: data-auto-animate -->
```yaml[10]
# .gitlab-ci.yml
image: python:latest

test-job:
    script: "python test.py"
    rules:
        - changes:
            - "**/*.py"

database-test-job:
```
<!-- .element: data-id="simple-ci" -->

For example, a `database-test-job`

------
<!-- .element: data-auto-animate -->
```yaml[10-14]
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
<!-- .element: data-id="simple-ci" -->

which we could setup in a similar way, except... it might depend on some test databases to have been created.

------
<!-- .element: data-auto-animate -->
```yaml[10]
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
<!-- .element: data-no-trim -->
<!-- .element: data-id="simple-ci" -->

So for that, we'll require a new setup job to be run,

------
<!-- .element: data-auto-animate -->
```yaml[10-15]
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
<!-- .element: data-id="simple-ci" -->

which needs to be run under the same set of changes,
------
<!-- .element: data-auto-animate -->
```yaml[10-20]
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
<!-- .element: data-id="simple-ci" -->

and additionally, we need some way of specifying that the `database-test-job` can only run once the `database-setup-job` is finished.
------
<!-- .element: data-auto-animate -->
```yaml[18-19]
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
<!-- .element: data-id="simple-ci" -->

To do that, we can use the `needs` keyword, which specifies that the `database-test-job` "needs" the `database-setup-job` to finish successfully before the tests can be started and completed correctly.

With the idea being that we want as much running in parallel as possible, such that our previous tests don't have to wait for setting up databases if they don't depend on them.

------
<!-- .element: data-auto-animate -->
```yaml[]
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
<!-- .element: data-id="simple-ci" -->

And so now, what we've landed on is great.

It's similar enough as an example to what I was working with,

And, it works when it's merged in!

> 07:40 (03:40) {4}

---
<!-- .slide: data-background-image="images/prs_and_time.svg"-->

However as new PRs are made, and time goes on, 

------
<!-- .slide: data-background-image="images/gitlab_ci_pipeline_execution_failed.svg"-->

one PR, causes the pipeline to fail.
Not because the tests themselves pass or fail,

------
<!-- .slide: data-background-image="images/pipeline_invalid.svg"-->

but because the pipeline itself is incorrect.

Gitlab will tell us that the `database-test-job` couldn't run because the `database-setup-job` didn't run.

Now if we go back to our pipeline definition,

------
<!-- .element: data-auto-animate -->
```yaml[7-22]
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
<!-- .element: data-id="simple-ci" -->

Can anyone tell me why it didn't run?

> Feel free to shout out!

> [It might not have been very obvious... It's...]

> Yes, thank you, that's right.

------
<!-- .element: data-auto-animate -->
```yaml[8,14,22]
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
<!-- .element: data-id="simple-ci" -->

Because there was a typo in the changes.
The `database-test-job` ran, because there were changes to files ending in `.py`,
But the `database-setup-job` didn't run, because there weren't changes to files ending in `.pu`.

> TODO: Emphasize the example is to show what goes wrong regardless of how simple the setup is.

------
<!-- .slide: data-background-image="images/frustrated.svg"-->

The reason I give this example is because it's a type of problem I've personally experienced!
And it left me feeling frustrated, and, dissapointed.
And if this wasn't only because I had lost time, then why?

------
<!-- .slide: data-background-image="images/good_job.svg"-->

Well, while it's great that we've figured out why this happened, and that the fix would be a simple one character change,

------
<!-- .slide: data-background-image="images/reflection.svg"-->

in our line of work, it's more important to understand *how* this was allowed to happen in the first place, so it doesn't ever occur again.

------
<!-- .slide: data-background-image="images/thought_bubble.svg"-->

For this, I'm gonna try hand it over back to you all!
Can anyone shout out some examples for why this problem could've happened?

> Okay I'll be honest, I didn't hear any of that. That is on me because I thought this might happen with so many of you here, but now can't blame myself for trying. So I've come prepared with some guesses to match what all of your awesome responses might be.

- The author was careless
- Incomplete or incompatible changes
- The reviewers weren't sharp enough
- Lack of testing
- The config is too complex
- It wasn't written using DRY

> 10:10 (2:30) {5}

------
<!-- .slide: data-background-image="images/human_error.svg"-->

But to me, those are all human errors
And as you might have heard earlier, I don't like human errors, *especially* ones that could be avoided by a systematic change, which would allow us to blame a system instead of people. This is why I was so frustrated.

------
<!-- .slide: data-background-image="images/code.svg"-->

So I would say at a higher level, this occurred because while this configuration looks like code,

------
<!-- .slide: data-background-image="images/code_crossed.svg"-->

it isn't treated like code.
Because we're used to testing code with tests, 

------
<!-- .slide: data-background-image="images/thought_bubble.svg"-->

but who tests the testing infrastructure with tests?

Can I get a raise of hands?

> See that's like ?% of the audience!

> 10:55 (0:45) {6}

---
<!-- .slide: data-background-image="images/thinking.svg"-->

So now you might be thinking,  
Evan, I'm so sorry to hear that,  
it was such a touching story,  
but solutions speak louder than problems,  
how do I stop this from happening to me?

------
# 1. Configuration Linting <!-- .element: class="fragment" -->
# 2. Running End to End Pipelines <!-- .element: class="fragment" -->
# 3. Running Pipelines Locally <!-- .element: class="fragment" -->
# 4. Configuration Static Analysis Testing <!-- .element: class="fragment" -->
# 5. Pipeline Generation Tooling <!-- .element: class="fragment" -->

Thank you,  
it was difficult to share and I'm glad you asked because 
throughout that time,  
I was able to compose five techniques that helped me,  
which we'll dive into now:

1. The first, is validating our ci configuration using linting tools
2. The second, is running an end to end ci pipeline before comitting changes
3. We'll then look at how we can run those pipeline jobs locally
4. How we can run static analysis testing on the ci configuration
5. And finally, we'll look at dynamically generating pipelines using tools

Now I won't claim that any single technique is the best. My goal is to cover the pros and cons to help you decide which one (or which combination) works best in your situation.

> 12:10 (01:15) {7}

---
# 1. Configuration Linting

So the first method that we'll dive into is linting the ci config file.

------
<!-- .slide: data-background-image="images/lint.svg"-->

Linting is great. I **love** linting, because it's a fast method of finding (and sometimes automatically fixing), problems that can be solved before going further.
And gitlab offers quite a bit here:

------
<!-- .slide: data-background-image="images/vscode_linting_extension.svg"-->

They have a VSCode extension

------
<!-- .slide: data-background-image="images/vscode_linting_extension_example.svg"-->

Which will tell you within your editor tell you whether your yaml is setup correctly
 
------
<!-- .slide: data-background-image="images/gitlab_pipeline_syntax_checker.svg"-->

They have a pipeline syntax checker,

Which will do the same thing as the extension, but through a web ui, and api endpoint.

------
<!-- .slide: data-background-image="images/gitlab_pipeline_visualiser.svg"-->

They also have a visualiser,

which gives a quick way of helping you see the dependencies between jobs
  
------
<!-- .slide: data-background-image="images/gitlab_pipeline_validator.svg"-->

They have a validator,

Which simulates a git push event on the default branch, with rules and needs evaluated

------
<!-- .slide: data-background-image="images/gitlab_pipeline_expander.svg"-->

And finally they have a tool to expand your yaml into it's full configuration,

Which helps you see what the pipeline looks like with all the special syntax expanded.

------
<!-- .slide: data-background-image="images/downsides.svg"-->

However these methods have their downsides too:

------
<!-- .slide: data-background-image="images/intellij_crossed.svg"-->

The VSCode extension, as you might have guessed, is only officially made for VSCode

------
<!-- .slide: data-background-image="images/gitlab_pipeline_syntax_checker_success.svg"-->

And even if you instead use the pipeline syntax checker, whether it be the web ui, or the endpoint, they only tell you if there's something wrong with your schema, not with how it runs.

------
<!-- .slide: data-background-image="images/gitlab_pipeline_visualiser_arrow_pipeline_failure.svg"-->

The visualiser, while handy, doesn't help you understand the issues we had around dependencies with needs and rules, and thus won't uncover those issues upfront.

------
<!-- .slide: data-background-image="images/gitlab_pipeline_validator_success.svg"-->

The validator, while it says it simulates and evaluates rules and needs (unless I'm misunderstanding, feel free to correct me at the end) wasn't able to pickup on that problem (and also doesn't have an api endpoint, to make testing easier)

------
<!-- .slide: data-background-image="images/gitlab_pipeline_expander_extends.svg"-->

And with the full configuration tool, expansion is limited, and won't expand out defaults, (technically each individual job has an image).

------
<!-- .slide: data-background-image="images/puzzle_piece.svg"-->

So while linting tools do have their use, they are only a single piece of the puzzle, just like how we can't expect linters to catch logic errors.

> 14:40 (2:30) {8}

---
# 2. Running End to End Pipelines

So if linters are lacking due to not testing end to end, why don't we instead try running an end to end pipeline before merging changes?

------
<!-- .slide: data-background-image="images/gitlab_ci_pipeline_run.svg"-->

Well, the good news is, gitlab lets us run a pipeline from a particular branch, such as the one that is introducing the ci config file changes

------
<!-- .slide: data-background-image="images/gitlab_ci_pipeline_run_variables.svg"-->

And, it also let's us specify variables, for example, overriding those that would be predefined by gitlab.

------
<!-- .slide: data-background-image="images/gitlab_ci_pipeline_running.svg"-->

This is great because it lets us run a pipeline identically to how one would be run by gitlab, such as a post merge pipeline.

------
<!-- .slide: data-background-image="images/gitlab_ci_pipeline_running_branch.svg"-->

However, there is one limitation being that this pipeline depends on the changes for that particular branch,

------
<!-- .slide: data-background-image="images/gitlab_ci_pipeline_execution_failed_crossed.svg"-->

And therefore, we won't be able to catch our problem, as our branch doesn't introduce the changes that are needed to reveal that bug.

------
<!-- .slide: data-background-image="images/branch_with_changes_diagram.svg"-->

However there is another way, and that is by creating a branch off of our new ci config file, with any changes that are needed, such as updating a file that we expect to run in the test directory.

------
<!-- .slide: data-background-image="images/gitlab_ci_pipeline_execution_failed_pipeline.svg"-->

This is great, as it would reveal our problem,

------
<!-- .slide: data-background-image="images/complex_pipes.svg"-->

However, you may have noticed that this is an intensive and costly process, as it's slow and manual, and may not scale with all of the combinations of changes, that may be introduced with lots of different rules.

> 16:20 (01:40) {9}

---
# 3. Running Pipelines Locally

So, for our third method, we have something in between, something that's not as static as linting, and not as e2e as running entire pipelines.

------
<!-- .slide: data-background-image="images/gitlab-ci-local_and_gitlabci-local.svg"-->

For that, we can use tools like gitlab-ci-local and gitlabci-local.
Yes you heard me right, the difference is a dash…

------
<!-- .slide: data-background-image="images/gitlab-ci-local.svg"-->

gitlab dash ci dash local, is a typescript tool made by Mads Jon Nielsen (Mass Yon Nielsen) in January of 2020

------
<!-- .slide: data-background-image="images/gitlabci-local.svg"-->

And gitlabci dash local, is a python tool made by Adrian DC in January 2020.

------
<!-- .slide: data-background-image="images/bizzare.svg"-->

Honestly it's bizarre how just how similar these tools are, both in what they do, and when they were made.

------
<!-- .slide: data-background-image="images/gitlab-ci-local_output_and_gitlabci-local_output.svg"-->

But anyways, these two tools let us run the individual jobs of our gitlab pipelines, locally, using containers.

------
<!-- .slide: data-background-image="images/gitlab_logo_crossed.svg"-->

The core benefits of these tools are that they let us remove the dependency on gitlab.

We might not want to spin up an entire pipeline just to run a single job.

This is helpful as it quickens the feedback loop, by allowing us to locally replicate job environments that might otherwise be too different if simply run as a script.

> TODO: Replace image with fitting meme like "Long live the king?" 

------
<!-- .slide: data-background-image="images/downsides.svg"-->

That's not to say that these tools don't have downsides

------
<!-- .slide: data-background-image="images/simulation.svg"-->

Being simulators, they're not always going to match the real thing

------
<!-- .slide: data-background-image="images/hourglass.svg"-->

And if we're solely testing our pipeline changes, they don't give us any static information in advance, and require us to wait for jobs to finish running.

------
<!-- .slide: data-background-image="images/gitlab_ci_pipeline_execution_failed.svg"-->

So in our examples above, both of these tools also won't help us uncover our problem, even though they might have other benefits.

> 18:20 (02:00) {10}

---
# 4. Configuration Static Analysis Testing

So with the forth method, let's explore a different kind of testing.

------
<!-- .slide: data-background-image="images/404.svg"-->

In this front, I wasn't able to find any kind of static analysis testing tools for ci config files, and thus to solve this problem, I took the initiative to make a tool myself...

------
<!-- .slide: data-background-image="images/ci_test.svg"-->

ci-test!

ci-test acts as the missing piece of the linting/e2e/integration testing puzzle, by functioning as a framework, for static analysis testing.

Think of it as a tool box to add to your shed of equipment.

By analysing the ci config file, and, how it's changed, we can gain a better understanding of what the pipeline is meant to look like.

------
<!-- .element: data-auto-animate -->
```json[]
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
<!-- .element: data-id="ci-test-output" -->

As an example, it can produce snapshots of the pipeline, by collating relevant information, such as pairing together lists of jobs and changes.

------
<!-- .element: data-auto-animate -->
```json[7,10-17]
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
<!-- .element: data-id="ci-test-output" -->

Thus using our example, when the change was made, we would get this diff.
This immediately lets us know that an additional rule set was created that is different from the expected rule set from from all other jobs.

------
<!-- .element: data-auto-animate -->
```json[]
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
<!-- .element: data-id="ci-test-output" -->

So really, we should have seen this instead, where all the jobs are defined under the same changes.

------
<!-- .slide: data-background-image="images/downsides.svg"-->

Of course like everything else, it has it's drawbacks and can't solely be depended on, since it doesn't run in integration like the other methods.

------
<!-- .slide: data-background-image="images/confidence.svg"-->

But it is something simple, that will allow us, to quickly iterate, on rules with confidence, which was something that we couldn't do before.

> 19:50 (01:30) {11}

---
<!-- .slide: data-background-image="images/ci_test_refactor_0.svg"-->

And it's true value was highlighted in one of my previous engagements.

------
<!-- .slide: data-background-image="images/ci_test_refactor_1.svg"-->

Their CI config file,

------
<!-- .slide: data-background-image="images/ci_test_refactor_2.svg"-->

was thousands of lines of unmaintainable yaml,

------
<!-- .slide: data-background-image="images/ci_test_refactor_3.svg"-->

And no one wanted to make CI changes.

If they needed to, the pipelines had to be baby sat,
for the case where, not if,

------
<!-- .slide: data-background-image="images/ci_test_refactor_4.svg"-->

but when, something unexpected would go wrong.

------
<!-- .slide: data-background-image="images/ci_test_refactor_5.svg"-->

This giant file handled deployments and everything else.

------
<!-- .slide: data-background-image="images/ci_test_refactor_6.svg"-->

And it was scary because if you wanted to make changes to merges,

------
<!-- .slide: data-background-image="images/ci_test_refactor_7.svg"-->

you didn't know if you'd be affecting deployments.

------
<!-- .slide: data-background-image="images/ci_test_refactor_8.svg"-->

Now because ci test is able to take snapshots to show what's changed, you could then do something clever.

------
<!-- .slide: data-background-image="images/ci_test_refactor_9.svg"-->

Say the config file is full of changes related to deployment, and everything else.

------
<!-- .slide: data-background-image="images/ci_test_refactor_10.svg"-->

And you wanted to refactor it to extract out all the changes related to deployment.

------
<!-- .slide: data-background-image="images/ci_test_refactor_11.svg"-->

First, what you would do, is make two copies of the config file.

------
<!-- .slide: data-background-image="images/ci_test_refactor_12.svg"-->

One to contain everything related to deployments,

------
<!-- .slide: data-background-image="images/ci_test_refactor_13.svg"-->

and the other, everything not related.

------
<!-- .slide: data-background-image="images/ci_test_refactor_14.svg"-->

Then you'd reduce the original config

------
<!-- .slide: data-background-image="images/ci_test_refactor_15.svg"-->

to include these files based on the workflow.

------
<!-- .slide: data-background-image="images/ci_test_refactor_16.svg"-->

Importantly at this step, when ci test takes a snapshot, the expected output will be the same.

------
<!-- .slide: data-background-image="images/ci_test_refactor_17.svg"-->

But now, ci test can be configured to take different snapshots, such as for the non deploy path,

------
<!-- .slide: data-background-image="images/ci_test_refactor_18.svg"-->

or for the deploy path.

------
<!-- .slide: data-background-image="images/ci_test_refactor_19.svg"-->

So now, if we want to refactor the two different configs, 

------
<!-- .slide: data-background-image="images/ci_test_refactor_20.svg"-->

Removing anything that's unnecessary...

------
<!-- .slide: data-background-image="images/ci_test_refactor_21.svg"-->

the tests, (or in this case the output jobs,) don't change, signalling a safe refactor.

> 22:05 (02:15) {12}

------
<!-- .slide: data-background-image="images/notice_mark.svg"-->

That all being said, don't take that as me going on the record to say that this will be the holy grail.

------
<!-- .slide: data-background-image="images/contribute.svg"-->

There is plenty of room for improvement, and it's been written in a way to be highly extensible.

So, if you want to help contribute to this, or, any other developer tooling, I'm more than happy to help!

Reach out, or make a pull request on GitHub!

> 22:35 (00:30) {13}

---
# 5. Pipeline Generation Tooling

The last method I'll cover, is using tools to dynamically generate pipelines using programming languages, like python.

------
<!-- .slide: data-background-image="images/gitlab_ci_python_library.svg"-->

gitlab-ci-python-library is the only up to date library I could find to do this,

(Although if you are interested, there are some typescript libraries which I had dismissed due to needing more attention)

Anyways, gitlab-ci-python-library, or gcip, is a library from Thomas Steinbach (Schtienbahf) and Daniel von Eßen (fon essen), that allows you to replace your ci config file with python!

------
<!-- .slide: data-background-image="images/question_mark.svg"-->

Why would you want this?

------
<!-- .slide: data-background-image="images/quote_box.svg"-->
> Creating your pipelines in Python code allows you all the features of that language, like:
> * re-use code (DRY - Don't Repeat Yourself) <!-- .element: class="fragment" -->
> * use variables, control flow (if-then-else, loops, ...), complex data structures, input/output, error handling, ... <!-- .element: class="fragment" -->
> * programming paradigms like object-oriented or functional programming <!-- .element: class="fragment" -->
> * use 3rd party libraries in your pipelines, like boto3 <!-- .element: class="fragment" -->
> * test driven development of Pipelines with pytest <!-- .element: class="fragment" -->
> * package management and distribution of your pipeline code <!-- .element: class="fragment" -->
> * ... anything you can imagine to do with Python code <!-- .element: class="fragment" -->
<!-- .element: style="box-shadow: none" -->

Well if we quote the library, we can utilise all the features of python such as:
* code re-use
* variables, control flows, and the like
* programming paradigms
* libraries
* testing
* packaging
* and anything else you can imagine!

> 23:45 (01:10) {14}

------
<!-- .slide: data-background-image="images/python_not_yaml.svg"-->

So what would it look like to replace our yaml with python?

---
<!-- .element: data-auto-animate -->
```python[1]
# .gitlab-ci.py
```
<!-- .element: data-id="python-ci" -->

Well first we create a `.gitlab-ci.py` file,

------
<!-- .element: data-auto-animate -->
```python[2]
# .gitlab-ci.py
import gcip
```
<!-- .element: data-id="python-ci" -->

then import the library,

------
<!-- .element: data-auto-animate -->
```python[4]
# .gitlab-ci.py
import gcip

pipeline = gcip.Pipeline()
```
<!-- .element: data-id="python-ci" -->

create a pipeline,

------
<!-- .element: data-auto-animate -->
```python[5]
# .gitlab-ci.py
import gcip

pipeline = gcip.Pipeline()
pipeline.initialize_image("python:latest")
```
<!-- .element: data-id="python-ci" -->

specify the default image,

------
<!-- .element: data-auto-animate -->
```python[7-8]
# .gitlab-ci.py
import gcip

pipeline = gcip.Pipeline()
pipeline.initialize_image("python:latest")

test_job = gcip.Job(
)

```
<!-- .element: data-id="python-ci" -->

then, we create a job,

------
<!-- .element: data-auto-animate -->
```python[8]
# .gitlab-ci.py
import gcip

pipeline = gcip.Pipeline()
pipeline.initialize_image("python:latest")

test_job = gcip.Job(
    name="test-job",
)

```
<!-- .element: data-id="python-ci" -->

give it a name,

------
<!-- .element: data-auto-animate -->
```python[9]
# .gitlab-ci.py
import gcip

pipeline = gcip.Pipeline()
pipeline.initialize_image("python:latest")

test_job = gcip.Job(
    name="test-job",
    script="python test.py",
)

```
<!-- .element: data-id="python-ci" -->

add a script,

------
<!-- .element: data-auto-animate -->
```python[10]
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
<!-- .element: data-id="python-ci" -->

and it's rules,

------
<!-- .element: data-auto-animate -->
```python[13-23]
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
<!-- .element: data-no-trim -->
<!-- .element: data-id="python-ci" -->

doing the same for the other jobs

------
<!-- .element: data-auto-animate -->
```python[22]
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
<!-- .element: data-no-trim -->
<!-- .element: data-id="python-ci" -->

add in our needs

------
<!-- .element: data-auto-animate -->
```python[26-30]
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
<!-- .element: data-no-trim -->
<!-- .element: data-id="python-ci" -->

before finally adding all jobs as children of the pipeline

------
<!-- .element: data-auto-animate -->
```python[32]
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
<!-- .element: data-id="python-ci" -->

And then writing that pipeline out to yaml

------
<!-- .slide: data-background-image="images/gitlab_ci_gcip_pipeline_success.svg"-->

And sure enough, we can have this pipeline execute in the repo,

------
<!-- .slide: data-background-image="images/gitlab_ci_gcip_pipeline_success_expanded.svg"-->

with all of our expected downstream jobs.

------
<!-- .slide: data-background-image="images/plumber_thinking.svg"-->

However, has this caused our initial problem to go away?

------
<!-- .slide: data-background-image="images/gitlab_ci_gcip_pipeline_fail.svg"-->

Well, it doesn't give us any protections from the pipeline failing to run, because again, there were no reasons for it to run correctly, since there were no `.pu` changes.

> 25:00 (01:15) {15}

---
<!-- .slide: data-background-image="images/dissappointed.svg"-->

So unfortunately, it seems like generated pipelines won't directly solve our problem.

That being said, they can help!

------
<!-- .element: data-auto-animate -->
```python[1]
# pipeline_test.py
```
<!-- .element: data-id="pipeline-test" -->

As the authors mentioned earlier, this programmatic approach does let you,

------
<!-- .element: data-auto-animate -->
```python[2]
# pipeline_test.py
from pipeline_ci_config import pipeline
```
<!-- .element: data-id="pipeline-test" -->

import your pipeline,

------
<!-- .element: data-auto-animate -->
```python[4-8]
# pipeline_test.py
from pipeline_ci_config import pipeline

def test_pipeline_jobs_for_rules(expected_jobs_for_rules):

    actual_jobs_for_rules = get_jobs_for_rules(pipeline)
    
    assert actual_jobs_for_rules == expected_jobs_for_rules

...
```
<!-- .element: data-id="pipeline-test" -->

and perform tests on it,

------
<!-- .element: data-auto-animate -->
```python[6]
# pipeline_test.py
from pipeline_ci_config import pipeline

def test_pipeline_jobs_for_rules(expected_jobs_for_rules):

    actual_jobs_for_rules = get_jobs_for_rules(pipeline)
    
    assert actual_jobs_for_rules == expected_jobs_for_rules

...
```
<!-- .element: data-id="pipeline-test" -->

allowing us to do something similar like we've done with ci-test. 

------
<!-- .element: data-auto-animate -->
```python[]
# pipeline_test.py
from pipeline_ci_config import pipeline

def test_pipeline_jobs_for_rules(expected_jobs_for_rules):

    actual_jobs_for_rules = get_jobs_for_rules(pipeline)
    
    assert actual_jobs_for_rules == expected_jobs_for_rules

...
```
<!-- .element: data-id="pipeline-test" -->

However, there is one other thing to consider...

------
<!-- .element: data-auto-animate -->
```python[]
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
<!-- .element: data-id="python-changeset" -->

Since our pipeline is now in Python,

------
<!-- .element: data-auto-animate -->
```python[7]
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
<!-- .element: data-id="python-changeset" -->

they do let us easily create a changeset using a list,

------
<!-- .element: data-auto-animate -->
```python[7,12,18]
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
<!-- .element: data-id="python-changeset" -->

that we can apply everywhere, and thus help alleviate any rule mismatches, as all the rules will now be the same.
This may have those of you knowledgeable in yaml thinking...

------
<!-- .element: data-auto-animate -->
```yaml[]
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
<!-- .element: data-id="yaml-changeset" -->

"Doesn't yaml also let you create a list that can be referenced?"
And you'd be correct.

------
<!-- .element: data-auto-animate -->
```yaml[4-5]
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
<!-- .element: data-id="yaml-changeset" -->

we _can_ create a key with an anchor,

------
<!-- .element: data-auto-animate -->
```yaml[4-5,10,15]
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
<!-- .element: data-id="yaml-changeset" -->

and reference them with aliases to do the same thing and solve our problem.

------
<!-- .slide: data-background-image="images/yaml_list_error.svg"-->

But if we wanted to do something like extend this change set, it wouldn't be as easy, as yaml doesn't allow merging of lists.

------
<!-- .slide: data-background-image="images/gitlab_yaml_list_docs.svg"-->

Well that's not entirely correct, gitlab does allow you to merge lists,

------
<!-- .slide: data-background-image="images/yaml_list_invalid.svg"-->

However this doesn't work for all cases, as it won't result in valid yaml.

> 26:30 (01:30) {16}

---
<!-- .slide: data-background-image="images/thought_bubble.svg"-->

So are generated pipelines a good idea?
I think the authors have a good view of this, which I'll do my best to summarise

------
<!-- .slide: data-background-image="images/gcip_quote_cons.svg"-->

The cons are that it could allow for writing complex pipelines that nobody else understands, when they should be basic things that build and test your code and shouldn't be in code too.

------
<!-- .slide: data-background-image="images/gcip_quote_pros.svg"-->

But,
- if you're not fond of yaml,
- your ci files are growing to over thousands of lines long,
- or they're littered with complex rule sets,

maybe writing them in code is cleaner.

------
<!-- .slide: data-background-image="images/gcip_quote_summary.svg"-->

Importantly, it's a choice that's up to you, your team, and, the situation.

> 27:15 (00:45) {17}

---
<!-- .slide: data-background-image="images/thinking.svg"-->

If you do see the need to integrate some kind of programming in your configuration, but feel like pipeline generation is too much, there is one other approach to consider.

------
<!-- .slide: data-background-image="images/cog.png"-->

And that is using Cog.

Cog is a tool that allows you to use small bits of Python code in static files to generate the text that you need.

------
<!-- .element: data-auto-animate -->
```yaml [1,8,14]
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
<!-- .element: data-id="yaml-changeset" -->

So in our previous example where we wanted to unify these as a list... 

------
<!-- .element: data-auto-animate -->
```yaml [2-4]
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
<!-- .element: data-id="yaml-changeset" -->

We would first create a comment with a cog block

------
<!-- .element: data-auto-animate -->
```yaml [3-4]
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
<!-- .element: data-id="yaml-changeset" -->

Add a python function to specify our changes

------
<!-- .element: data-auto-animate -->
```yaml [3]
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
<!-- .element: data-id="yaml-changeset" -->

import cog, ...

------
<!-- .element: data-auto-animate -->
```yaml [6-7]
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
<!-- .element: data-id="yaml-changeset" -->

To output the changes on iteration

------
<!-- .element: data-auto-animate -->
```yaml [16-17]
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
<!-- .element: data-id="yaml-changeset" -->

And then where we've defined our changes,

------
<!-- .element: data-auto-animate -->
```yaml [16-18]
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
<!-- .element: data-id="yaml-changeset" -->

we can use cog to run that function to output the change list.

Then, when we run cog over the file,

------
<!-- .element: data-auto-animate -->
```yaml [16-18]
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
<!-- .element: data-id="yaml-changeset" -->

It'll update what's between the tags with our generated output.

And because it works on the file itself, there's no guessing what the generation will do. 

------
<!-- .element: data-auto-animate -->
```yaml [19]
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
<!-- .element: data-id="yaml-changeset" -->

Meaning that extending our list for one particular case is both easy to do and understand!

> 28:45 (1:30) {18}

---
<!-- .element: data-auto-animate -->
```yaml [17]
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
<!-- .element: data-id="yaml-changeset-edit" -->

If you're wondering "What if someone accidentally changes what's between the tags?" 

Then there's a couple of options you have to protect your platform.


------
<!-- .element: data-auto-animate -->
```yaml [18]
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
<!-- .element: data-id="yaml-changeset-edit" -->

Such as enabling the checksum flag, which, when running cog...

------
``` sh
.gitlab-ci.yml(18):
    Output has been edited!
    Delete old checksum to unprotect.
```

will cause it to complain about an unexpected edit.

------
```diff [2,9-10,14]
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

Or using the check and diff flags within a CI job before the PR is merged, which will error highlighting that an unexpected change has been made.

> 29:15 (00:30) {19}

---
# 1. Configuration Linting
# 2. Running End to End Pipelines
# 3. Running Pipelines Locally
# 4. Configuration Static Analysis Testing
# 5. Pipeline Generation Tooling

So to close out, if we look back the techniques and ask, what is the best approach?

Well, it really depends, on what your CI looks like.

If your ci config file has become thousands of lines long, then generating it dynamically, or writing tests may help relieve that burden.

But at the end of the day, all these methods, are only tools to assist us in our problems,

------
<!-- .slide: data-background-image="images/complex_pipes.svg"-->

And if the underlying problem is the thousands of lines of CI configuration, it might help to start there instead,

because as complexity increases, so too, do time consuming problems that require testing to prevent.   

Choosing one tool, over another, will _still_ be adding another component, to something that is likely already complex, that, you'll later have to deal with.

------
```yaml[]
# .gitlab-ci.yml
image: python:latest

test-job:
    script: "python test.py"
```

And so if your pipeline is as simple as this, it may very well be reasonable to need nothing at all. 

------
<!-- .slide: data-background-image="images/simplicity.svg"-->

Thus, my view from all of this is that simplicity is key.

Question everything that is there, and utilise the least you can, to get the job done.

> 30:45 (01:30) {20}

------
# `@ekohilas`
# `citest.nohumanerrors.com`
![qr code](images/qr_code.svg)<!-- .element: style="max-height: 95%"-->
<!-- .element: class="r-stretch"-->
# <br>

If you're after the resources from this talk, you can find them in these links.

And if any of this was of interest to you, reach out!

I'm looking for my next engagement and would love to work with you on solving complex problems. 

If you enjoyed this talk, please take a picture to share it online.

You can also subscribe to my mailing list on nohumanerrors.com, or find me online at ekohilas if you want to get in touch or give feedback.  

------
<!-- .slide: data-background-image="images/questions.svg"-->

And, if you're still wondering who tests the testers, I'll be around for questions!

------
<!-- .slide: data-background-image="images/ddd_sponsors.png"-->

Thanks to all the sponsors of DDD for bringing us all together,
my friends and family for supporting me,
the open source contributors,
and finally to you, for listening!

------
# `@ekohilas`
# `citest.nohumanerrors.com`
![qr code](images/qr_code.svg)<!-- .element: style="max-height: 95%"-->
<!-- .element: class="r-stretch"-->
# Thanks!

I'll leave this up now so you can actually take pictures.

> 31:15 (00:30) {21}
