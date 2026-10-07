# Maintainer Binu Udayakumar <binu@dronasys.com>

# import config.
# You can change the default config with `make cnf="config_special.env" build`
# use build_staging.env for staging server (local too)

# Optional environmental variables
cnf ?= .local.env
REPO=dronasys-com
APP ?= avatar-dev-ui
ANGULAR_CLI_DEV=angular-cli-headless-chrome

## build version tags, change version before releasing package
BUILD_VER ?= a1.0.0
DOCKER_HUB_TAG ?= a1.0.0

include $(cnf)
export $(shell sed 's/=.*//' $(cnf))

# HELP
# This will output the help for each task
# thanks to https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
.PHONY: help
help: ## This help.
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.DEFAULT_GOAL := help

run: ## run avatar-dev-ui angular workspace project
	docker stop $(APP); docker rm $(APP);docker run --rm  --name $(APP) -p "4200:4200" -v ".:/app" $(REPO)/$(ANGULAR_CLI_DEV) npm run start

run-shell-angular: ## run shell on angular
	docker run --rm -it -v ".:/app" $(REPO)/$(ANGULAR_CLI_DEV) bash

exec: ## get terminal access to container
	docker exec -it $(APP) sh

