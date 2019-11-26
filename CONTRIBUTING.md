[![Open Source Love](https://badges.frapsoft.com/os/v3/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/)

# How to contribute


If you don't have git on your machine, [install it]( https://help.github.com/articles/set-up-git/).


## Fork repository
<img align="right" width="300" src="https://i.imgur.com/v04I4nX.png" alt="fork this repository" />

Fork repository by clicking on the fork button on the top of its GitHub page. This will create a copy of this repository in your account.

## Clone repository
<img align="right" width="300" src="https://i.imgur.com/0rc1EWw.png" alt="clone repository" />

Now clone the forked repository to your machine. Go to your GitHub account, open the forked repository, click on the clone button and then click the copy to clipboard icon.


Open a terminal and run the following git command:

```bash
git clone <url you just copied>
```

## Add remote

Add the original repository as remote called `upstream`

Open a terminal and run the following git command:
```bash
git remote add upstream https://github.com/gorrion-io/danger-zone.git
```

## Create a branch

Open a terminal and run the following git command inside repository directory on your computer:

```
git checkout -b <your-branch-name>
```

## Make necessary changes

Make necessary changes, commit those changes to your local branch.

## Pull `upstream` master to your local changes

To make sure that your code base is up-to-date, pull latest changes to your local repository.

```
git pull upstream master
```

## Resolve conflicts, if any

If there are any conflicts, resolve them to have working code base.

## Run the tests and check if application works correctly.

Do some testing. :)

## Push your changes to `origin`

```
git push origin <your-branch-name>
```

## From GitHub create pull request.

<img src="https://i.imgur.com/T4PbxFl.png" />

*image from github.com*

Click compare & pull request button on your fork page.

<img src="https://i.imgur.com/GxOYMA2.png" />

*image from github.com*

## Congrats! :)