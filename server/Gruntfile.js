module.exports = function(grunt) {

//config
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    shell: {
      dev: {
        command: 'export NODE_ENV=development && nodemon app.js'
      },
      prod: {
        command: 'export NODE_ENV=production && nodemon -q app.js > .logs'
      }
    }
  });

//dependencies
  grunt.loadNpmTasks('grunt-shell');

//tasks

  grunt.registerTask('dev', ['shell:dev']);
  
  grunt.registerTask('prod', ['shell:prod']);
};