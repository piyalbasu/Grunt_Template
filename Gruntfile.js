/* jshint node: true */

module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    build: {
      img: {
        src: './img',
        dest: './_Assets/PublishingImages'
      },
      js: {
        src: './js',
        dest: './_Assets/js'
      },

      sass: {
        src: './sass',
        dest: './_Assets/css'
      }
    },

    smushit: {
      prod: {
        src: [
          '<%= build.img.src %>/**/*.jpg',
          '<%= build.img.src %>/**/*.png'
        ],
        dest: '<%= build.img.dest %>'
      }
    },

    sass: {
      dev: {

        options: {
          style: 'expanded',
          compass: false
        },

        files: [{
          expand: true,
          cwd: '<%= build.sass.src %>',
          src: ['*.scss'],
          dest: '<%= build.sass.dest %>',
          ext: '.css'
        }]
      },

      dist: {

        options: {
          style: 'compressed',
          compass: false
        },

        files: [{
          expand: true,
          cwd: '<%= build.sass.src %>',
          src: ['*.scss'],
          dest: '<%= build.sass.dest %>',
          ext: '-<%= pkg.version %>.min.css'
        }]
      }
    },

    copy: {
      dev: {
        files: [{
          expand: true,
          flatten: true,
          src: [
            '<%= build.js.src %>/vendor/modernizr.min.js'
          ],
          dest: '<%= build.js.dest %>/',
          rename: function(dest, src) {
            return dest + 'site-head.min.js';
          }
        },
		{
			expand: true,
			flatten: true,
			src: [
				'<%= build.js.src %>/vendor/ie8-2.1.beta4.min.js'
			],
			dest: '<%= build.js.dest %>/'
		}]
      },
      img: {
        files: [{
          expand: true,
          flatten: true,
          src: [
            '<%= build.img.src %>/*.gif'
          ],
          dest: '<%= build.img.dest %>/'
        }]
      },
      map: {
        files: [{
          expand: true,
          flatten: true,
          src: [
            '<%= build.js.src %>/site-<%= pkg.version %>' +
            '.min.map'
          ],
          dest: '<%= build.js.dest %>/',
        }]
      }
    },

    uglify: {
      options: {
        mangle: true,
        sourceMap: false,
        preserveComments: 'some'
      },
      dev: {
        files: {
          '<%= build.js.src %>/site-<%= pkg.version %>.min.js': [
            '<%= build.js.src %>/tagging.js',
            '<%= build.js.src %>/site.js'
          ]
        }
      }
    },

    concat: {
      dev: {
        options: {
          stripBanners: true
        },
        src: [
          '<%= build.js.src %>/vendor/jquery.min.js',
          '<%= build.js.src %>/vendor/jquery.mousewheel.min.js',
          '<%= build.js.src %>/vendor/jquery.jscrollpane.min.js',
          '<%= build.js.src %>/vendor/jcarousel.min.js',
          '<%= build.js.src %>/vendor/gravy.min.js',
          '<%= build.js.src %>/site-<%= pkg.version %>.min.js'
        ],
        dest: '<%= build.js.dest %>/site-foot.min.js'
      }
    },

    watch: {
      compile: {
        files: ['sass/{,*/}*.{scss,sass}','pages/{,*/}*.html','asides/{,*/}*.html', 'js/*.js'],
        tasks: ['sass:dev', 'includes', 'buildJS']
      },
      build: {
        files: ['img/{,*/}*.{jpg,png}'],
        tasks: ['buildImg']
      }
    },

    includes: {
      files: {
        src: ['pages/index.html', 'pages/about-site.html', 'pages/dosing.html', 'pages/faq.html', 'pages/talking-to-patients.html', 'pages/404-error.html', 'pages/site-map.html'], // Source files
        dest: 'compiled', // Destination directory
        flatten: true,
        cwd: '.'
      }
    }

  });

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.registerTask('buildImg', [
    'smushit:prod',
    'copy:img'
  ]);

  grunt.registerTask('buildJS', [
    'copy:dev',
    'uglify:dev',
    'concat:dev',
    'copy:map'
  ]);

  grunt.registerTask('buildHTML', [
    'includes'
  ]);

	grunt.registerTask('buildCSS', [
		'sass:dev'
	]);

	grunt.registerTask('build', 'Build everything', function(mode) {
		grunt.task.run('buildImg');
		if (mode === 'prod') {
			grunt.task.run('sass:dist');
		} else {
			grunt.task.run('sass:dev');
		}
		grunt.task.run('buildJS');
		grunt.task.run('buildHTML');
	});

  grunt.registerTask('watchSCSS', [
    'sass:dev',
    'watch:compile'
  ]);

  grunt.registerTask('default', [
    'buildImg',
    'buildJS',
    'includes',
    'watchSCSS'
  ]);

};
