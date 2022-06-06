module.exports = function(grunt) {

  grunt.initConfig({

    concat: {
      basic: {
        src: ['src/lib/DOM.js','src/lib/DOM_register.js','src/lib/**/*.js'],
        dest: 'src/app/lib/DOM.js',
      },
      export: {
        src: ['src/lib/DOM.js','src/lib/DOM_register.js','src/lib/**/*.js','src/export.js'],
        dest: 'src/app/lib/DOM.export.js',
      },
    },

    terser: {
      basic: {
        src: ['src/lib/DOM.js','src/lib/DOM_register.js','src/lib/**/*.js'],
        dest: 'src/app/lib/DOM.js',
      },
      export: {
        src: ['src/lib/DOM.js','src/lib/DOM_register.js','src/lib/**/*.js','src/export.js'],
        dest: 'src/app/lib/DOM.export.js',
      },
    },

    watch: {
      files: ['src/lib/**/*.js'],
      tasks: ['concat:basic']
    },

  });
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-terser');
  grunt.registerTask('default', ['watch']);
};