#!/usr/bin/env node
'use strict';

var path = require('path');
var mkdirp = require('mkdirp');
var prompt = require('prompt');
var init = require('init-package-json');
var ghDl = require('github-download');
var initFile = path.resolve(process.env.HOME, '.npm-init');

prompt.start();

prompt.get([{
  name: 'project',
  description: 'Name of your Application',
  default: 'nerd-stack',
  required: true
}], function (err, result) {
  console.log('Command-line input received:');
  console.log('Project name: ' + result.project);
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
