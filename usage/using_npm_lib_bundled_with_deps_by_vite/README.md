# Boolean search example application using npm library bundled with vite

## Description

We can create an application using an `npm` typescript project which imports all its
dependencies from https://npmjs.com. In `package.json` you can configure your
application's dependencies, and the `npm` tool fetches automatically each dependency.
It also recursively fetches all dependencies of each dependency. For the
`boolean-search-highlight` library this means that also its dependencies
`@harcokuppens/boolean-expression` and `harcokuppens/highlight-words` are fetched.

We can than use the `vite` tool to build and bundle the application, so that we are
only left with a single `html` file which includes a single bundled `javascript`
file. You only need to deploy these two files to web server to deploy the
application. So, instead of a big bundled library with is dependencies bundled in, we
now fetch each library and its dependencies separate, and let vite bundle the whole
thing when deploying the application.

## Setup instructions

We already setup a project for this example application using a `package.json` and a
`vite.config.ts`. You only have to execute:

```bash
npm run build
npx http-server -a localhost -p 12345 -o dist/index.html
```

This automatically builds the application in the `dist/` subfolder, starts a
webserver on port `12345` and opens the `dist/index.html` entry page of the
publication in the browser.

Afterwards you can cleanup with:

```bash
npm run cleanall
```
