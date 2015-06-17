#!/usr/bin/env node
'use strict';

var mkdirp = require('mkdirp');
var prompt = require('prompt');

prompt.start();

prompt.get([{
  name: 'project',
  description: 'Name of your Application',
  default: 'nerd-stack',
  required: true
}], function (err, result) {
  console.log('Command-line input received:');
  console.log('  username: ' + result.project);
  mkdirp(process.cwd() + '/' + result.project, function (err) {
    if(err) console.log(err);
    console.log('Folder created');
  });
});
