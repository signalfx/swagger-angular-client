# Client-side Seed

A very thin on top of [boilerplate-gulp](https://github.com/oztu/boilerplate-gulp) 
to seed client-side packages by forking and modifying.

Update the package.json, then run `gulp dev` to get started. A server will start listening on
port 3000 and serve the contents of `example` and `build`. Any changes you make within src/js
or src/css will trigger an incremental rebuild and refresh of any connected browsers. src/js
files are bundled via browserify and src/css files are processed by LESS.

When you're ready to create a distributable artifact, run `gulp dist`. This will generate
minified and optimized versions of the source files in to the /dist/ directory.

See [boilerplate-gulp](https://github.com/oztu/boilerplate-gulp) for additional tasks.
