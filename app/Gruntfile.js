module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    shell: {
      options: {
        stderr: false
      },
      target: {
        command: 'webpack'
      },
    },

    nodemon: {
      dev: {
        script: 'start.js'
      }
    },

    clean: ['compiled/*']
  });

  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('build', [
    'clean',     
  ]);

  grunt.registerTask('webpack', ['shell:target']);

};