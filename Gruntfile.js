/*jshint strict:false*/
/*global module:false, require: false */
module.exports = function(grunt) {
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        meta: {
            app: 'app/',
            temp: 'temp/',
            dist: 'dist/',
            pkg: grunt.file.readJSON('package.json'),
            banner:
                '/**\n' +
                ' * <%= meta.pkg.name %> v<%= meta.pkg.version %>\n' +
                ' * www.toppatch.com\n *\n' +
                ' * Copyright (c) 2012, <%= grunt.template.today("yyyy") %> <%= meta.pkg.author %>\n' +
                ' */\n'
        },

        /**********************
         * Task Configuration *
         **********************/

        clean: {
            app: [
                '<%= meta.app %>api',
                '<%= meta.app %>css',
                '<%= meta.app %>core/js/template',
                '<%= meta.app %>fonts'
            ],
            dist        : ['<%= meta.dist %>'],
            nodeModules : ['node_modules/'],
            report      : ['report/'],
            temp        : ['<%= meta.temp %>'],
            vendor      : ['<%= meta.app %>vendor']
        },
        concat: {
            options: {
                stripBanners: true,
                banner: '<%= banner %>'
            },
            dist: {
                src: '<%= meta.dist %>js/toppatch-ui.js',
                dest: '<%= meta.dist %>js/toppatch-ui.js'
            }
        },
        concurrent: {
            dev: [
                'less:application',
                'less:bootstrap'
            ],
            dist: [
                'less:dist',
                'imagemin:dist',
                'uglify:dist',
                'requirejs:dist',
                'targethtml:dist'
            ]
        },
        connect: {
            server: {
                options: {
                    base: '<%= meta.app %>',
                    hostname: '*',
                    middleware: function (connect, options) {
                        return [
                            require('connect-livereload')(),
                            connect.static(options.base),
                            connect.directory(options.base)
                        ];
                    }
                }
            }
        },
        copy: {
            dev: {
                files: [
                    { cwd: '<%= meta.app %>vendor/bootstrap/', src: 'fonts/*', dest: '<%= meta.app %>', expand: true }
                ]
            },
            dist: {
                files: [
                    { cwd: '<%= meta.app %>', src: '404.html', dest: '<%= meta.dist %>', expand: true },
                    { cwd: '<%= meta.app %>', src: 'robots.txt', dest: '<%= meta.dist %>', expand: true },
                    { cwd: '<%= meta.app %>', src: 'images/*', dest: '<%= meta.dist %>', expand: true },
                    { cwd: '<%= meta.app %>vendor/bootstrap/', src: 'fonts/*', dest: '<%= meta.dist %>', expand: true }
                ]
            }
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= meta.dist %>images',
                    src: '{,*/}*.{png,jpg,jpeg}',
                    dest: '<%= meta.dist %>images'
                }]
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            gruntfile: ['Gruntfile.js'],
            core: {
                options: {
                    jshintrc: '<%= meta.app %>core/js/.jshintrc'
                },
                src: ['<%= meta.app %>core/js/**/*.js']
            },
            coreTests: {
                options: {
                    jshintrc: '<%= meta.app %>core/tests/.jshintrc'
                },
                src: ['<%= meta.app %>core/tests/unit/*.js']
            }
        },
        less: {
            options: {
                report: 'min'
            },
            application: {
                files: {
                    '<%= meta.app %>css/application.css': ['<%= meta.app %>less/application.less']
                }
            },
            bootstrap: {
                files: {
                    '<%= meta.app %>css/bootstrap.css'  : ['<%= meta.app %>vendor/bootstrap/less/bootstrap.less']
                }
            },
            dist: {
                options: {
                    yuicompress: true
                },
                files: {
                    '<%= meta.dist %>css/bootstrap.css'  : ['<%= meta.app %>vendor/bootstrap/less/bootstrap.less'],
                    '<%= meta.dist %>css/application.css': ['<%= meta.app %>less/application.less']
                }
            }
        },
        open: {
            dev: {
                url: 'http://localhost:8000/'
            }
        },
        qunit: {
            options: {
                timeout: '8100',
                coverage: {
                    src: ['<%= meta.app %>core/js/**/*.js'],
                    instrumentedFiles: 'temp/',
                    htmlReport: 'report/'
                }
            },
            all: ['<%= meta.app %>core/tests/*.html']
        },
        requirejs: {
            options: {
                findNestedDependencies: true,
                inlineText: true,
                preserveLicenseComments: false,
                stubModules: ['text', 'json'],
                wrap: true,
                mainConfigFile: '<%= meta.app %>core/js/config.js',
                baseUrl: '<%= meta.app %>'
            },
            dist: {
                options: {
                    include: ['core/js/main'],
                    insertRequire: ['core/js/main'],
                    name: 'vendor/requirejs/require',
                    optimize: 'uglify2',
                    pragmasOnSave: {
                        excludeHbsParser: true,
                        excludeHbs: true,
                        excludeAfterBuild: true
                    out: '<%= meta.dist %>js/toppatch-ui.js',
                    }
                }
            }
        },
        targethtml: {
            dist: {
                files: {
                    '<%= meta.dist %>index.html': '<%= meta.app %>index.html'
                }
            }
        },
        uglify: {
            dist: {
                files: {
                    '<%= meta.dist %>js/modernizr.min.js': ['<%= meta.app %>vendor/modernizr/modernizr.js']
                }
            }
        },
        watch: {
            options: {
                livereload: true
            },
            application: {
                files: ['<%= meta.app %>less/*.less'],
                tasks: ['less:application']
            },
            bootstrap: {
                files: ['<%= meta.app %>vendor/bootstrap/less/*.less'],
                tasks: ['less:bootstrap']
            },
            javascript: {
                files: ['<%= meta.app %>core/js/*.js']
            },
            html: {
                files: ['<%= meta.app %>*.html']
            }
        }
    });

    grunt.registerTask('default', ['test', 'clean:dist', 'copy:dist', 'concurrent:dist', 'concat']);
    grunt.registerTask('dev', ['copy:dev', 'concurrent:dev', 'connect', 'open:dev', 'watch']);
    grunt.registerTask('test', ['jshint', 'qunit']);
};
