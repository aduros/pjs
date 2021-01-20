man/pjs.1: README.md
	mkdir -p man
	pandoc --standalone -t man "$<" -o "$@"
