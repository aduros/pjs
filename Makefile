man/pjs.1: README.md
	mkdir -p man
	echo " \n\
--- \n\
title: PJS(1) pjs \n\
author: Bruno Garcia <b@aduros.com> \n\
date: `date '+%B, %Y'` \n\
--- \n\
	" | cat - "$<" | pandoc --standalone -f markdown - -t man -o "$@"

publish: man/pjs.1
	echo npm publish
