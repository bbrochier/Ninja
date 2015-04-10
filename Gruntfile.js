'use strict';

module.exports = function(grunt) {

    grunt.initConfig({

      /* CONCAT
        ================================================================= */
        concat: {
          target: {
            src: [
              'src/js/game.js',
              'src/js/player.js',
              'src/js/box.js',
              'src/js/functions.js',
              'src/js/init.js'
            ],
            dest: 'main.js',
            options: {
              banner: ";(function() {\n\n'use strict';\n\n",
              footer: "\n\n})();\n"
            },
            nonull: true
          }
        },


      /* JSHINT
        ================================================================= */
        jshint: {
          options: {
            trailing: true
          },
          target: {
            src : [
              'main.js'
            ]
          }
        },


      /* JSCS
        ================================================================= */
        jscs: {
          options: {
            config: '.jscs.json',
          },
          main: [
            'src/js/*.js',
          ]
        },


      /* WATCH
        ================================================================= */
        watch: {
            options: {
                atBegin: true
                //, livereload: true
            },
            js: {
                files: 'src/js/*.js',
                tasks: ['default']
            }
        }

    });


    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks("grunt-jscs");

    grunt.registerTask('default', ['concat', 'jshint', 'jscs']);
    grunt.registerTask('concatjs', ['concat']);
    grunt.registerTask('hintjs', ['jshint']);
    grunt.registerTask('stylejs', ['jscs']);
};