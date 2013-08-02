/*jshint strict:false*/
/*global module:false, require: false */
module.exports = function(grunt) {
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    var rvConfig = {
        app: 'app',
        dist: 'dist'
    };

    grunt.initConfig({
        rv: rvConfig,
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
                files: ['<%= rv.app %>/js/**/*.js']
            },
            html: {
                files: ['<%= rv.app %>/*.html', '<%= rv.app %>/templates/**/*.html']
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
                    { cwd: 'app/', src: 'robots.txt', dest: 'dist/', expand: true }
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
                    cwd: '<%= rv.app %>/images',
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
                pragmasOnSave: { excludeTpl: true },
                preserveLicenseComments: false,
                wrap: true,
                mainConfigFile: '<%= rv.app %>/js/config.js',
                baseUrl: '<%= rv.app %>/',
                name: 'vendor/almond/almond',
                include: ['js/main'],
                insertRequire: ['js/main']
            },
            dist: {
                options: {
                    optimize: 'uglify2',
                    out: '<%= rv.dist %>/js/application.min.js'
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
                'copy:dist',
                'recess:dist',
                'imagemin:dist',
                'uglify:dist',
                'requirejs:dist',
                'targethtml:dist'
            ]
        }
    });

    grunt.registerTask('dist', ['clean:dist', 'concurrent:dist']);
    grunt.registerTask('dev', ['concurrent:dev', 'connect', 'open:dev', 'watch']);
};
