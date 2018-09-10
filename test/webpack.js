'use strict'
const path = require('path')
const helpers = require('yeoman-test')
const assert = require('yeoman-assert')

describe('webpack:app', () => {
  it('generates a webpack project with default options', () => {
    // The object returned acts like a promise, so return it to wait until the process is done
    return helpers.run(path.join(__dirname, '../generators/app'))
      // Mock options passed in
      .withOptions({
        skipInstall: true
      })
      // Mock the arguments
      .withArguments([])
      // Mock the prompt answers
      .withPrompts({
        appName: 'demo-webpack',
        srcDir: 'src',
        srcStyleDir: 'styles',
        srcScriptDir: 'scripts',
        srcAssetsDir: 'assets',
        distDir: 'dist',
        distStyleDir: 'styles',
        distScriptDir: 'scripts',
        distAssetsDir: 'assets',
        packageManager: 'yarn',
        eslint: true,
        stylelint: true
      })
      // Mock the local config
      .withLocalConfig({})
      .then(() => {
        // assert something about the generator
        assert.file([
          '.editorconfig',
          'package.json',
          'webpack.config.js',
          '.eslintrc.js',
          '.eslintignore',
          '.babelrc',
          'src/scripts/main.js',
          '.stylelintrc',
          '.stylelintignore',
          '.postcssrc',
          'src/styles/main.scss',
          'index.html',
        ])
      })
  })

  it('generates a webpack project with custom options', () => {
    // The object returned acts like a promise, so return it to wait until the process is done
    return helpers.run(path.join(__dirname, '../generators/app'))
    // Mock options passed in
      .withOptions({
        skipInstall: true
      })
      // Mock the arguments
      .withArguments([])
      // Mock the prompt answers
      .withPrompts({
        appName: 'demo-webpack-app',
        srcDir: 'resources',
        srcStyleDir: 'scss',
        srcScriptDir: 'es6',
        srcAssetsDir: 'images',
        distDir: 'built',
        distStyleDir: 'css',
        distScriptDir: 'js',
        distAssetsDir: 'files',
        packageManager: 'yarn',
        eslint: true,
        stylelint: true
      })
      // Mock the local config
      .withLocalConfig({})
      .then(() => {
        // assert something about the generator
        assert.file([
          '.editorconfig',
          'package.json',
          'webpack.config.js',
          '.eslintrc.js',
          '.eslintignore',
          '.babelrc',
          'resources/es6/main.js',
          '.stylelintrc',
          '.stylelintignore',
          '.postcssrc',
          'resources/scss/main.scss',
          'index.html',
        ])
      })
  })

  it('generates a webpack project with no eslint, stylelint', () => {
    // The object returned acts like a promise, so return it to wait until the process is done
    return helpers.run(path.join(__dirname, '../generators/app'))
    // Mock options passed in
      .withOptions({
        skipInstall: true
      })
      // Mock the arguments
      .withArguments([])
      // Mock the prompt answers
      .withPrompts({
        appName: 'demo-webpack',
        srcDir: 'src',
        srcStyleDir: 'styles',
        srcScriptDir: 'scripts',
        srcAssetsDir: 'assets',
        distDir: 'dist',
        distStyleDir: 'styles',
        distScriptDir: 'scripts',
        distAssetsDir: 'assets',
        packageManager: 'yarn',
        eslint: false,
        stylelint: false
      })
      // Mock the local config
      .withLocalConfig({})
      .then(() => {
        // assert something about the generator
        assert.file([
          '.editorconfig',
          'package.json',
          'webpack.config.js',
          '.babelrc',
          'src/scripts/main.js',
          '.postcssrc',
          'src/styles/main.scss',
          'index.html',
        ])
        assert.noFile([
          '.eslintrc.js',
          '.eslintignore',
          '.stylelintrc',
          '.stylelintignore'
        ])
      })
  })
})
