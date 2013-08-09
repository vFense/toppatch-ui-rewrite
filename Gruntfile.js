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
            dist: ['dist']
        },
        concurrent: {
            dev: [
                'recess:application',
                'recess:bootstrap'
            ],
            dist: [
                'recess:dist',
                'imagemin:dist',
                'uglify:dist',
                'requirejs:dist',
                'targethtml:dist'
            ]
        },
        connect: {
            server: {
                options: {
                    base: 'app/',
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
                    { cwd: 'app/', src: '404.html', dest: 'dist/', expand: true },
                    { cwd: 'app/', src: 'robots.txt', dest: 'dist/', expand: true },
                    { cwd: 'app/', src: 'images/*', dest: 'dist/', expand: true}
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
            all: ['Gruntfile.js', 'app/core/**/*.js']
        },
        open: {
            dev: {
                url: 'http://localhost:8000/'
            }
        },
        qunit: {
            all: {
                options: {
                    urls: [
                        'http://localhost:8000/core/tests/config.html',
                        'http://localhost:8000/core/tests/index.html'
                    ]
                }
            }
        },
        recess: {
            options: {
                compile: true
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
                    compress: true
                },
                files: {
                    '<%= rv.dist %>/css/bootstrap.css'  : ['<%= rv.app %>/vendor/bootstrap/less/bootstrap.less'],
                    '<%= rv.dist %>/css/application.css': ['<%= rv.app %>/less/application.less']
                }
            }
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
                    out: '<%= rv.dist %>/js/core.min.js'
                }
            }
        },
        targethtml: {
            dist: {
                files: {
                    'dist/index.html': 'app/index.html'
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

    grunt.registerTask('default', ['test', 'clean:dist', 'copy:dist', 'concurrent:dist']);
    grunt.registerTask('dev', ['concurrent:dev', 'connect', 'open:dev', 'watch']);
    grunt.registerTask('test', ['jshint', 'connect', 'qunit']);
};
