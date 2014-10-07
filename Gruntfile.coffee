module.exports = (grunt) ->

  grunt.initConfig

    build:
      client: 'src/**/*.js'

    # JSHint options
    # http://www.jshint.com/options/
    jshint:
      plugin:
        files:
          src: 'lib/**/*.js'
        options:
          # node
          node: true,
          strict: false

      options:
        quotmark: 'single'
        bitwise: true
        indent: 2
        camelcase: true
        strict: true
        trailing: true
        curly: true
        eqeqeq: true
        immed: true
        latedef: true
        newcap: true
        noempty: true
        unused: true
        noarg: true
        sub: true
        undef: true
        maxdepth: 4
        maxlen: 100
        globals: {}

    simplemocha:
      options:
        ui: 'bdd'
        reporter: 'dot'
      unit:
        src: [
          'test/**/*.spec.js'
        ]

    'npm-contributors':
      options:
        commitMessage: 'chore: update contributors'

    bump:
      options:
        commitMessage: 'chore: release v%VERSION%'
        pushTo: 'upstream'

  grunt.loadNpmTasks 'grunt-auto-release'
  grunt.loadNpmTasks 'grunt-contrib-jshint'
  grunt.loadNpmTasks 'grunt-bump'
  grunt.loadNpmTasks 'grunt-npm'
  grunt.loadNpmTasks 'grunt-simple-mocha'

  grunt.registerTask 'default', ['jshint', 'test']
  grunt.registerTask 'test', ['simplemocha:unit']
  grunt.registerTask 'release', 'Bump and publish to NPM.', (type) ->
    grunt.task.run [
      'npm-contributors'
      "bump:#{type||'patch'}"
      'npm-publish'
    ]
