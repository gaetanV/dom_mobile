module.exports = function(grunt) {

  grunt.initConfig({
    concat: {
        dest:{
             src: ['lib/DOM.js','lib/DOM_register.js','lib/**/*.js'],
             dest: "app/lib/DOM.js",
        }
    },
    uglify: {
        dest:{
             src: ['lib/DOM.js','lib/DOM_register','lib/**/*.js'],
             dest: "app/lib/DOM.js",
        }
    },
    watch: {
      files: ['lib/**/*.js'],
      tasks: ['concat']
    }
  });
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('default', ['watch']);
};