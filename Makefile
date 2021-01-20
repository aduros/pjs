all: man/pjs.1

.PHONY: all publish

man/pjs.1: README.md
	mkdir -p man
	echo " \n\
--- \n\
title: PJS(1) pjs \n\
author: Bruno Garcia <b@aduros.com> \n\
date: `date '+%B, %Y'` \n\
--- \n\
	" | cat - "$<" | pandoc --standalone -f markdown - -t man -o "$@"

# Before publishing, run `npm version` to bump the version number
publish: man/pjs.1
	@echo Ensuring git is clean before publishing...
	[ -z "`git status --porcelain`" ] && npm publish
