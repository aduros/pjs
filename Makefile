man/pjs.1: pjs.1.md
	pandoc --standalone -t man "$<" -o "$@"
