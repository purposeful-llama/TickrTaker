module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    processhtml: {
      options: {
        data: {
          message: 'Hello world!'
        }
      },
      dist: {
        files: {
          'compiled/index.html': ['index.html']
        }
      }
    },
    shell: {
      options: {
        stderr: false
      },
      compile: {
        command: 'webpack'
      },
      startDevServer: {
        command: 'node start.js'
      }
    },

    clean: ['compiled/*']
  });

  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('build', [
    'clean',     
  ]);

  grunt.registerTask('webpack', ['shell:compile']);
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.registerTask('start', ['shell:startDevServer']);
};