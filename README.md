# Bitstarter

## Description
This is a Javascript repo for a coursera startup engineering course.  This is a forked and then extended heroku website.

## Reminder of how to use the dev cycle

### Development
 - working from the dev branch
 - do the work and check it all in and push to develop in github
 - now check github and check that the develop branch is ahead of master by n commits

### Pull to staging
 - move to the staging branch `git checkout staging`
 - pull the changes from develop `git merge develop`
 - push the changes to github `git push origin staging`
 - push the change to heroku `git push production-heroku staging:master`
 - now check github and check that the staging branch is ahead of master by n commits
 - also check heroku staging to verify that the changes are now there
 
### Pull to production
 - move to the staging branch `git checkout master`
 - pull the changes from develop `git merge staging`
 - push the changes to github `git push origin master`
 - push the change to heroku `git push staging-heroku master:master`
 - now check github and check that all the branches are in sync with master
 - also check heroku staging to verify that the changes are now there