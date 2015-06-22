#!/usr/bin/env node
'use strict';

var path = require('path');
var fs = require('fs');
var rimraf = require('rimraf');
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
    default: 'rethinkdb',
    required: true
  }
];
prompt.get(promptSchema, function (err, result) {
  console.log('Project name: ' + result.project);
  console.log('Database type: ' + result.database);
  console.log('Let\'s initialize your package.json');
  mkdirp(process.cwd() + '/' + result.project, function (err) {
    if (err) console.log(err);
    var nerdPath = process.cwd() + '/' + result.project;
    ghDl({user: 'xantier', repo: 'nerd-stack', ref: 'master'}, nerdPath)
        .on('error', function (err) {
          console.error(err)
        })
        .on('dir', function (dir) {
          console.log(dir);
        })
        .on('end', function () {
          init(process.cwd() + '/' + result.project, initFile, {}, function (err, data) {
            if (err) console.log(err);
            console.log(data);
          });
          fs.readdir(nerdPath + '/app/data', function (err, list) {
            for (var i in list) {
              if (list.hasOwnProperty(i)) {
                if (list[i] !== result.database) {
                  rimraf(nerdPath + '/app/data/' + list[i], function (err) {
                    if (err) console.log(err);
                  });
                }
              }
            }
          });
          var configPath = '/app/config/config.json';
          var config = require(nerdPath + configPath);
          fs.unlinkSync(nerdPath + configPath, 0, function (err) {
            if (err) console.log(err);
          });
          var nuConfig = {};
          nuConfig.db = result.database;
          nuConfig[result.database] = config[result.database];
          fs.writeFile(nerdPath + configPath, JSON.stringify(nuConfig, null, 4), function (err) {
            if (err) {
              console.log(err);
            } else {
              console.log('config updated');
            }
          });
        });
  });

});
