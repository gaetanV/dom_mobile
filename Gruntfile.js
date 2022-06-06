module.exports = function(grunt) {

  grunt.initConfig({
    concat: {
        dest:{
             src: ['src/lib/DOM.js','src/lib/DOM_register.js','src/lib/**/*.js'],
             dest: "src/app/lib/DOM.js",
        }
    },
    uglify: {
        dest:{
             src: ['src/lib/DOM.js','src/lib/DOM_register','src/lib/**/*.js'],
             dest: "src/app/lib/DOM.js",
        }
    },
    watch: {
      files: ['src/lib/**/*.js'],
      tasks: ['concat']
    }
  });
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('default', ['watch']);
};