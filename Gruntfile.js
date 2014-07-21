/* jshint node: true */

var exec = require("child_process").exec;

module.exports = function(grunt) {
  'use strict';
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*dpl started*/',
    distRoot: grunt.option('target') || '.package',
    docsRoot: 'docs',

    jshint: {
      options: {
        jshintrc: 'js/.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      src: {
        src: ['js/*.js']
      },
      test: {
        src: ['js/tests/unit/*.js']
      }
    },
    browserify: {
      build: {
        files: {
          '<%= distRoot %>/js/<%= pkg.name %>.js': ['js/<%= pkg.name %>.js'],
        }
      }
    },

    uglify: {
      build: {
        options: {
          sourceMap: false
        },
        files: [{
          expand: true,
          cwd: '<%= distRoot %>/js/',
          src: ['**/*.js', '!*.min.js'],
          dest: '<%= distRoot %>/js/',
          ext: '.min.js'
        }]
      }
    },

    less: {
      options: {
        compile: true
      },
      sui: {
        src: ['less/<%= pkg.name %>.less'],
        dest: '<%= distRoot %>/css/<%= pkg.name %>.css'
      },
      suiMin: {
        options: {
          compress: true
        },
        src: ['less/<%= pkg.name %>.less'],
        dest: '<%= distRoot %>/css/<%= pkg.name %>.min.css'
      },
      themes: {
        files: [{
          expand: true,
          cwd: 'less/',
          src: ['sui-themes-*.less'],
          dest: '<%= distRoot %>/css/',
          ext: '.css'
        }]
      },
      themesMin: {
        options: {
          compress: true
        },
        files: [{
          expand: true,
          cwd: 'less/',
          src: ['sui-themes-*.less'],
          dest: '<%= distRoot %>/css/',
          ext: '.min.css'
        }]
      },     
      docs: {
        files: [{
          expand: true,
          cwd: '<%= docsRoot %>/assets/less/',
          src: ['**/*.less'],
          dest: '<%= docsRoot %>/assets/css/',
          ext: '.css'
        }]
      }
    },
    jade: {
      docs: {
        options: {
          pretty: true
        },
        files: [
          {
          expand: true,
          cwd: '<%= docsRoot %>/templates',
          src: ['**/*.jade', '!base.jade', '!sidenav.jade', '!header.jade', '!com-*', '!*-com.jade', '!discuss.jade', '!foot.jade', '!head.jade'],
          dest: '<%= docsRoot %>',
          ext: '.html'
        },
        ],
      }
    },
    copy: {
      fonts: {
        files: [
          { expand: true, src: ['./fonts/*'], dest: '<%= distRoot %>/' },
        ]
      },
      img: {
        files: [
          { expand: true, src: ['./img/*'], dest: '<%= distRoot %>/' },
        ]
      },
    },
    /*
    qunit: {
      options: {
        inject: 'js/tests/unit/phantom.js'
      },
      files: ['js/tests/*.html']
    },
    */

    connect: {
      server: {
        options: {
          port: 3000,
          base: '.'
        }
      }
    },

    watch: {
      options: {
        livereload: 3457
      },
      css: {
        files: 'less/*.less',
        tasks: ['less:sui', 'newer:copy']
      },
      themes: {
        files: 'less/themes/*.less',
        tasks: ['less:themes']
      },
      js: {
        files: 'js/*.js',
        tasks: ['browserify', 'newer:copy']
      },
      docs: {
        files: '<%= docsRoot %>/templates/**/*.jade',
        tasks: ['newer:jade:docs']
      },
      docsCss: {
        files: '<%= docsRoot %>/assets/less/**/*.less',
        tasks: ['less:docs']
      }
    }
  });


  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-newer');
  // Test task.
  grunt.registerTask('test', ['jshint']);

  // JS distribution task.
  grunt.registerTask('dist-js', ['browserify', 'uglify']);

  // CSS distribution task.
  grunt.registerTask('dist-css', ['less']);

  grunt.registerTask('dist-img', ['copy:img']);

  // CSS distribution task.
  grunt.registerTask('dist-fonts', ['copy:fonts']);

  // Full distribution task.
  grunt.registerTask('dist', ['dist-css', 'dist-js', 'dist-fonts', 'dist-img']);
  grunt.registerTask('docs', ['jade']); //必须先执行dist才能执行此任务

  // Default task.
  grunt.registerTask('default', ['test', 'dist', 'docs']);
  //local server and watch
  grunt.registerTask('local',['connect','watch']);
}
