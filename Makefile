
all: build

build:
	./node_modules/.bin/browserify --standalone cio -o comm.io.js .
