const Generator = require('yeoman-generator')
const fs        = require('fs')

const defaultConfig = {
  srcDir: {
    type: 'input',
    name: 'srcDir',
    message: 'Your project resource directory',
    default: 'src',
  },
  srcStyleDir: {
    type: 'input',
    name: 'srcStyleDir',
    message: 'Your project resource style directory',
    default: 'styles'
  },
  srcScriptDir: {
    type: 'input',
    name: 'srcScriptDir',
    message: 'Your project resource script directory',
    default: 'scripts'
  },
  srcAssetsDir: {
    type: 'input',
    name: 'srcAssetsDir',
    message: 'Your project resource assets directory',
    default: 'assets'
  },
  distDir: {
    type: 'input',
    name: 'distDir',
    message: 'Your project built directory',
    default: 'dist',
  },
  distStyleDir: {
    type: 'input',
    name: 'distStyleDir',
    message: 'Your project built style directory',
    default: 'styles'
  },
  distScriptDir: {
    type: 'input',
    name: 'distScriptDir',
    message: 'Your project built script directory',
    default: 'scripts'
  },
  distAssetsDir: {
    type: 'input',
    name: 'distAssetsDir',
    message: 'Your project built assets directory',
    default: 'assets'
  },
  packageManager: {
    type: 'list',
    name: 'packageManager',
    message: 'package manager',
    choices: [
      {
        name: 'NPM',
        value: 'npm'
      },
      {
        name: 'Yarn',
        value: 'yarn'
      },
      {
        name: 'Bower',
        value: 'bower',
        disabled: 'Unavailable at this time'
      }
    ],
    default: 'yarn'
  },
  eslint: {
    type: 'confirm',
    name: 'eslint',
    message: 'eslint?',
    default: true
  },
  stylelint: {
    type: 'confirm',
    name: 'stylelint',
    message: 'stylelint?',
    default: true
  }
}

module.exports = class extends Generator {
  // The name `constructor` is important here
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts)

    this.defaultConfig = defaultConfig
    // Next, add your custom code
    // this.option('babel') // This method adds support for a `--babel` flag
  }

  async prompting() {
    // setup user interactions
    let userInteractions = [{
      type: 'input',
      name: 'appName',
      message: 'Your project name',
      default: this.appname
    }]

    for (let property in this.defaultConfig) {
      userInteractions.push(this.defaultConfig[property])
    }
    this.answers = await this.prompt(userInteractions)

    // setup config
    for (let property in this.answers) {
      this.config.set(property, this.answers[property])
    }

  }

  async writing() {
    // editor config
    this.fs.copy(this.templatePath('.editorconfig'), this.destinationPath('.editorconfig'))

    /* setup template structure: BEGIN */
    if (! fs.existsSync(this.config.get(this.defaultConfig.srcDir.name))) {
      fs.mkdirSync(this.config.get(this.defaultConfig.srcDir.name), '0777', error => {})
    } else {
      this.log('Source directory is already existed.')
    }

    // styles
    if (! fs.existsSync(this.config.get(this.defaultConfig.srcDir.name) + '/' + this.config.get(this.defaultConfig.srcStyleDir.name))) {
      fs.mkdirSync(this.config.get(this.defaultConfig.srcDir.name) + '/' + this.config.get(this.defaultConfig.srcStyleDir.name), '0777', error => {})
      this.fs.copy(this.templatePath('src/styles/'), this.destinationPath(this.config.get(this.defaultConfig.srcDir.name) + '/' + this.config.get(this.defaultConfig.srcStyleDir.name)))
      this.fs.copy(this.templatePath('.postcssrc'), this.destinationPath('.postcssrc'))
    } else {
      this.log('Source style directory is already existed.')
    }

    // scripts
    if (! fs.existsSync(this.config.get(this.defaultConfig.srcDir.name) + '/' + this.config.get(this.defaultConfig.srcScriptDir.name))) {
      fs.mkdirSync(this.config.get(this.defaultConfig.srcDir.name) + '/' + this.config.get(this.defaultConfig.srcScriptDir.name), '0777', error => {})
      this.fs.copy(this.templatePath('src/scripts/'), this.destinationPath(this.config.get(this.defaultConfig.srcDir.name) + '/' + this.config.get(this.defaultConfig.srcScriptDir.name)))
      this.fs.copy(this.templatePath('.babelrc'), this.destinationPath('.babelrc'))
    } else {
      this.log('Source script directory is already existed.')
    }

    // assets
    if (! fs.existsSync(this.config.get(this.defaultConfig.srcDir.name) + '/' + this.config.get(this.defaultConfig.srcAssetsDir.name))) {
      fs.mkdirSync(this.config.get(this.defaultConfig.srcDir.name) + '/' + this.config.get(this.defaultConfig.srcAssetsDir.name), '0777', error => {})
      this.fs.copy(this.templatePath('src/assets/'), this.destinationPath(this.config.get(this.defaultConfig.srcDir.name) + '/' + this.config.get(this.defaultConfig.srcAssetsDir.name)))
    } else {
      this.log('Source assets directory is already existed.')
    }

    // html
    if (! fs.existsSync('index.html')) {
      this.fs.copyTpl(this.templatePath('index.html'), this.destinationPath('index.html'), {
        title: this.config.get('appName'),
        styleDir: this.config.get(this.defaultConfig.distDir.name) + '/' + this.config.get(this.defaultConfig.distStyleDir.name) + '/main.css',
        scriptDir: this.config.get(this.defaultConfig.distDir.name) + '/' + this.config.get(this.defaultConfig.distScriptDir.name) + '/main.js',
        assetsDir: this.config.get(this.defaultConfig.distDir.name) + '/' + this.config.get(this.defaultConfig.distAssetsDir.name) + '/'
      })
    } else {
      this.log('index.html is already existed.')
    }

    // webpack
    if (! fs.existsSync('webpack.config.js')) {
      this.fs.copyTpl(this.templatePath('webpack.config.js'), this.destinationPath('webpack.config.js'), {
        srcDir: this.config.get(this.defaultConfig.srcDir.name),
        srcScriptDir: this.config.get(this.defaultConfig.srcScriptDir.name),
        srcStyleDir: this.config.get(this.defaultConfig.srcStyleDir.name),
        srcAssetsDir: this.config.get(this.defaultConfig.srcAssetsDir.name),
        distDir: this.config.get(this.defaultConfig.distDir.name),
        distScriptDir: this.config.get(this.defaultConfig.distScriptDir.name),
        distStyleDir: this.config.get(this.defaultConfig.distStyleDir.name),
        distAssetsDir: this.config.get(this.defaultConfig.distAssetsDir.name),
        eslint: this.config.get(this.defaultConfig.eslint.name),
        stylelint: this.config.get(this.defaultConfig.stylelint.name)
      })
    } else {
      this.log('webpack.config.js is already existed.')
    }

    // package.json
    if (! fs.existsSync('package.json')) {
      this.fs.copyTpl(this.templatePath('package.json'), this.destinationPath('package.json'), {
        appName: this.config.get('appName'),
        eslint: this.config.get('eslint'),
        stylelint: this.config.get('stylelint')
      })
    } else {
      this.log('package.json is already existed.')
    }

    // eslint
    if (this.config.get('eslint') && ! fs.existsSync('.eslintrc.js') && ! fs.existsSync('.eslintignore')) {
      this.fs.copy(this.templatePath('.eslintrc.js'), this.destinationPath('.eslintrc.js'))
      this.fs.copyTpl(this.templatePath('.eslintignore'), this.destinationPath('.eslintignore'), {
        srcDir: this.config.get(this.defaultConfig.srcDir.name),
        srcScriptDir: this.config.get(this.defaultConfig.srcScriptDir.name)
      })
    } else {
      this.log('.eslintrc.js or .eslintignore is already existed.')
    }

    // stylelint
    if (this.config.get('stylelint') && ! fs.existsSync('.stylelintrc') && ! fs.existsSync('.stylelintignore')) {
      this.fs.copy(this.templatePath('.stylelintrc'), this.destinationPath('.stylelintrc'))
      this.fs.copyTpl(this.templatePath('.stylelintignore'), this.destinationPath('.stylelintignore'), {
        srcDir: this.config.get(this.defaultConfig.srcDir.name),
        srcStyleDir: this.config.get(this.defaultConfig.srcStyleDir.name)
      })
    } else {
      this.log('.stylelintrc or .stylelintignore is already existed.')
    }
    /* setup template structure: END */
  }

  install() {
    switch (this.config.get('packageManager')) {
      case 'yarn':
        this.yarnInstall()
        break
      default:
        this.npmInstall()
        break
    }
  }

  end() {
    this.log('   _-----_        |       ╭───────────────────────╮\n' +
             '  |       |       |            Bye from Hieu TN      \n' +
             '  |--(o)--|       |       ╰───────────────────────╯\n' +
             ' `---------´\n' +
             '  ( _´U`_ )\n' +
             '  /___A___\\\n' +
             '   |  ~  |\n' +
             '  _\'.___.\'__\n');
  }

}
