module.exports = function(grunt) {

//config
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    shell: {
      dev: {
        command: 'set NODE_ENV=development && nodemon app.js'
      },
      prod: {
        command: 'set NODE_ENV=production && nodemon app.js'
      }
    }
  });

//dependencies
  grunt.loadNpmTasks('grunt-shell');

//tasks

  grunt.registerTask('dev', ['shell:dev']);
  
  grunt.registerTask('prod', ['shell:prod']);
};