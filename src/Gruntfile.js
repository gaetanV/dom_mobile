module.exports = function(grunt) {

  grunt.initConfig({
    concat: {
        dest:{
             src: ['lib/DOM.js','lib/**/*.js'],
             dest: "app/lib/DOM.js",
        }
    },
    uglify: {
        dest:{
             src: ['lib/DOM.js','lib/**/*.js'],
             dest: "app/lib/DOM.js",
        }
    },
    watch: {
      files: ['lib/**/*.js'],
      tasks: ['uglify']
    }
  });
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('default', ['watch']);
};