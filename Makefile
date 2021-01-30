all: man/pjs.1

.PHONY: all

man/pjs.1: doc/manual.md
	mkdir -p man
	echo " \n\
--- \n\
title: PJS(1) pjs \n\
author: Bruno Garcia <b@aduros.com> \n\
date: `date '+%B, %Y'` \n\
--- \n\
	" | cat - "$<" | pandoc --standalone -f markdown - -t man -o "$@"

tarball:
	mkdir -p dist

	# Trim shebang and put it back after
	tail -n +2 bin/pjs > dist/pjs-entry.js
	node_modules/.bin/webpack --target node --entry ./dist/pjs-entry.js \
		--mode production -o dist --output-filename pjs-packed.js
	echo '#!/usr/bin/env node' | cat - dist/pjs-packed.js > dist/pjs

	# Build standalone JS release
	chmod +x dist/pjs
	tar -cjf dist/pjs-latest.tar.bz2 -C dist pjs

prepack: all
	# Ensure no untracked files
	[ -z "`git status --porcelain`" ]

prepublish: prepack tarball
	scp dist/pjs-latest.tar.bz2 aduros:web/pjs
