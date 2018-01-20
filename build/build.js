'use strict';

const fs = require('fs');
const webpack = require('webpack');
const config = require('./config.js');


const [,,type] = process.argv;

webpack(config,() => console.log('over'));