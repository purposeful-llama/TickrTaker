module.exports = function(grunt) {

//config
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

//dependencies
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-processhtml');

//tasks
  grunt.registerTask('build', [
    'clean',
    'shell:compile',
    'processhtml'     
  ]);
  
  grunt.registerTask('start', ['shell:startDevServer']);
};