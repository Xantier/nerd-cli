#!/usr/bin/env node
'use strict';

var path = require('path');
var mkdirp = require('mkdirp');
var prompt = require('prompt');
var init = require('init-package-json');
var ghDl = require('github-download');
var initFile = path.resolve(process.env.HOME, '.npm-init');

prompt.start();

var promptSchema = [{
  name: 'project',
  description: 'Name of your Application',
  default: 'nerd-stack',
  required: true
},
  {
    name: 'database',
    description: 'What database do you want to use?',
    default: 'rethinkDB',
    required: true
  }
];
prompt.get(promptSchema, function (err, result) {
  console.log('Project name: ' + result.project);
  console.log('Database name: ' + result.database);
  console.log('Let\'s initialize your package.json');
  mkdirp(process.cwd() + '/' + result.project, function (err) {
    if(err) console.log(err);
    ghDl({user: 'xantier', repo: 'nerd-stack', ref: 'master'}, process.cwd() + '/' + result.project)
        .on('error', function(err) {
          console.error(err)
        });

    init(process.cwd() + '/' + result.project, initFile, {}, function (err, data) {
      if (err) console.log(err);
      console.log(data);
    })
  });

});
