/*jshint strict:false*/
/*global module:false, require: false */
module.exports = function(grunt) {
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        rv: {
            app: 'app',
            dist: 'dist'
        },
        pkg: grunt.file.readJSON('package.json'),
        banner:
            '/**\n' +
            ' * <%= pkg.name %> v<%= pkg.version %>\n' +
            ' * www.toppatch.com\n *\n' +
            ' * Copyright (c) 2012, <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' */\n',

        /**********************
         * Task Configuration *
         **********************/

        clean: {
            dist: ['<%= rv.dist %>/']
        },
        concat: {
            options: {
                stripBanners: true,
                banner: '<%= banner %>'
            },
            dist: {
                src: '<%= rv.dist %>/js/toppatch-ui.js',
                dest: '<%= rv.dist %>/js/toppatch-ui.js'
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
                    base: '<%= rv.app %>/',
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
            dist: {
                files: [
                    { cwd: '<%= rv.app %>/', src: '404.html', dest: '<%= rv.dist %>/', expand: true },
                    { cwd: '<%= rv.app %>/', src: 'robots.txt', dest: '<%= rv.dist %>/', expand: true },
                    { cwd: '<%= rv.app %>/', src: 'images/*', dest: '<%= rv.dist %>/', expand: true}
                ]
            }
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= rv.dist %>/images',
                    src: '{,*/}*.{png,jpg,jpeg}',
                    dest: '<%= rv.dist %>/images'
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
                    jshintrc: '<%= rv.app %>/core/js/.jshintrc'
                },
                src: ['<%= rv.app %>/core/js/*.js']
            },
            coreTests: {
                options: {
                    jshintrc: '<%= rv.app %>/core/tests/.jshintrc'
                },
                src: ['<%= rv.app %>/core/tests/unit/*.js']
            }
        },
        less: {
            options: {
                report: 'min'
            },
            application: {
                files: {
                    '<%= rv.app %>/css/application.css': ['<%= rv.app %>/less/application.less']
                }
            },
            bootstrap: {
                files: {
                    '<%= rv.app %>/css/bootstrap.css'  : ['<%= rv.app %>/vendor/bootstrap/less/bootstrap.less']
                }
            },
            dist: {
                options: {
                    yuicompress: true
                },
                files: {
                    '<%= rv.dist %>/css/bootstrap.css'  : ['<%= rv.app %>/vendor/bootstrap/less/bootstrap.less'],
                    '<%= rv.dist %>/css/application.css': ['<%= rv.app %>/less/application.less']
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
                    src: ['<%= rv.app %>/core/js/**/*.js'],
                    instrumentedFiles: 'temp/',
                    htmlReport: 'report/'
                }
            },
            all: ['<%= rv.app %>/core/tests/*.html']
        },
        requirejs: {
            options: {
                findNestedDependencies: true,
                inlineText: true,
                pragmasOnSave: { excludeTpl: true },
                preserveLicenseComments: false,
                stubModules: ['text', 'json'],
                wrap: true,
                mainConfigFile: '<%= rv.app %>/core/js/config.js',
                baseUrl: '<%= rv.app %>/'
            },
            dist: {
                options: {
                    include: ['core/js/main'],
                    insertRequire: ['core/js/main'],
                    name: 'vendor/requirejs/require',
                    optimize: 'uglify2',
                    out: '<%= rv.dist %>/js/toppatch-ui.js'
                }
            }
        },
        targethtml: {
            dist: {
                files: {
                    '<%= rv.dist %>/index.html': '<%= rv.app %>/index.html'
                }
            }
        },
        uglify: {
            dist: {
                files: {
                    '<%= rv.dist %>/js/modernizr.min.js': ['<%= rv.app %>/vendor/modernizr/modernizr.js']
                }
            }
        },
        watch: {
            options: {
                livereload: true
            },
            application: {
                files: ['<%= rv.app %>/less/*.less'],
                tasks: ['recess:application']
            },
            bootstrap: {
                files: ['<%= rv.app %>/vendor/bootstrap/less/*.less'],
                tasks: ['recess:bootstrap']
            },
            javascript: {
                files: ['<%= rv.app %>/core/js/*.js']
            },
            html: {
                files: ['<%= rv.app %>/*.html', '<%= rv.app %>/core/templates/**/*.html']
            }
        }
    });

    grunt.registerTask('default', ['test', 'clean:dist', 'copy:dist', 'concurrent:dist', 'concat']);
    grunt.registerTask('dev', ['concurrent:dev', 'connect', 'open:dev', 'watch']);
    grunt.registerTask('test', ['jshint', 'qunit']);
};
