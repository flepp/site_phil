var path                 = require('path');
var fs                   = require('fs');
var config               = require('../config.json');

var environments         = require('gulp-environments');

var development          = environments.development;
var production           = environments.production;

var htmlPaths = {

  src: path.join(config.root, config.base.src, config.htmlFolder.src, config.tasks.html.src),
  templates: path.join(config.root, config.base.src, config.htmlFolder.src, config.tasks.html.templates),
  layout: path.join(config.root, config.base.src, config.htmlFolder.src, config.tasks.html.layout),
  partials: path.join(config.root, config.base.src, config.htmlFolder.src, config.tasks.html.partials),
  jsonData: path.join(config.root, config.base.src, config.htmlFolder.src, config.tasks.html.jsonData),
  dest: path.join(config.root, config.base.dest)
}

module.exports = function (gulp, plugins){
return function () {
    plugins.nunjucksRender.nunjucks.configure([htmlPaths.src], {watch: false});
    gulp.src(htmlPaths.templates)
    .pipe(plugins.plumber())

    // Renders template with nunjucks
    .pipe(plugins.data(function() {

      return JSON.parse(fs.readFileSync(htmlPaths.jsonData, 'utf8'))

    }))
    .pipe(plugins.nunjucksRender())
    .pipe(environments.production(plugins.htmlReplace({

      "vanish":" ",
      "js":"scripts/main.min.js",
      "css":"css/styles.min.css",

      "keepUnassigned": false

    })))
    //remove any non-essential comments in dist
    .pipe(environments.production(plugins.htmlmin({

          removeComments: true
    })))
  .pipe(gulp.dest(htmlPaths.dest))
  };
};
