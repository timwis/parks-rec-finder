# Philadelphia Parks & Recreation Finder

Search for activities and locations in your neighborhood. This application
was developed by [ODDT](https://beta.phila.gov/departments/office-of-open-data-and-digital-transformation/)
Digital Transformation Fellows alongside our partners at
[Parks & Recreation](https://beta.phila.gov/departments/philadelphia-parks-recreation/).
It's meant to complement the information on their department website, and
some queries from it are surfaced on the website
[example](https://beta.phila.gov/departments/philadelphia-parks-recreation/our-locations/).

## Local development

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm start

# build for production with minification
npm run build

# run integration tests in desktop UI
npm test
```

## Deployment

This project's [Travis CI configuration](.travis.yml) compiles every
commit to the `master` branch and pushes the `dist` folder to the
`gh-pages` branch, where it's served via GitHub Pages' static hosting.
The `phila.gov` repo's nginx server then has a
[config](https://github.com/CityOfPhiladelphia/phila.gov/blob/master/nginx/server.d/parks-rec-finder.conf)
to reverse proxy this application `beta.phila.gov/parks-rec-finder`.

## Linting

This project uses very strict code formatting linters in order
to maintain consistency over time among multiple maintainers.
Some of the rules may seem arbitrary, and that's to reduce arbitrary
decision-making (the decisions are already made). We use
[standard](https://standardjs.com) for JavaScript linting, and
[the official Vue.js linter](https://github.com/vuejs/eslint-plugin-vue)
for `.vue` files, which enforces the
[Vue.js style guide](https://vuejs.org/v2/style-guide/).

The continuous integration workflow will fail if the linter doesn't pass,
so you should run the linter before committing:

```
npm run lint
```
`npm test` also runs the linter. It's even easier if you use a plugin for
your IDE [like this one](https://github.com/Microsoft/vscode-eslint) that
runs the linter in the background as you code.
