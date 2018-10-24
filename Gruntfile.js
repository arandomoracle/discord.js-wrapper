module.exports = grunt => {
  grunt.initConfig({
    eslint: {
      options: {
        configFile: '.eslintrc.json'
      },
      src: [
        '*.js',
        'lib/**/*.js',
        'test/**/*.js'
      ]
    },
    nodeunit: {
      files: ['test/**/*_test.js'],
    }
  });

  grunt.loadNpmTasks('gruntify-eslint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  grunt.registerTask('lint', ['eslint']);
  grunt.registerTask('test', ['nodeunit']);
};
