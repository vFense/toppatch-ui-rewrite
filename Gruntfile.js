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
            ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' */\n',
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
        },
        connect: {
            server: {
                options: {
                    base: 'app/',
                    hostname: '*'
                }
            }
        },
        open: {
            dev: {
                url: 'http://localhost:8000/'
            }
        },
        clean: {
            dist: ['dist']
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
        uglify: {
            dist: {
                files: {
                    '<%= rv.dist %>/js/modernizr.min.js': ['<%= rv.app %>/vendor/modernizr/modernizr.js']
                }
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
        }
    });

    grunt.registerTask('default', ['clean:dist', 'copy:dist', 'concurrent:dist']);
    grunt.registerTask('dev', ['concurrent:dev', 'connect', 'open:dev', 'watch']);
};
