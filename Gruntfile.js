/*jshint strict:false*/
/*global module:false, require: false */
module.exports = function(grunt) {
    require('matchdep').filterAll('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        meta: {
            app: 'app/',
            temp: 'temp/',
            dist: 'dist/',
            docs: 'docs/',
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
            dev: [
                '<%= meta.app %>css',
                '<%= meta.app %>core/template/**/*.js',
                '<%= meta.app %>fonts'
            ],
            dist        : ['<%= meta.dist %>'],
            nodeModules : ['node_modules/'],
            report      : ['report/'],
            temp        : ['<%= meta.temp %>'],
            vendor      : ['<%= meta.app %>vendor']
        },
        concurrent: {
            dev: [
                'copy:dev',
                'less:application',
                'less:bootstrap',
                'templates'
            ],
            dist: [
                'copy:dist',
                'imagemin:dist',
                'uglify:modernizr',
                'requirejs:dist',
                'targethtml:dist'
            ]
        },
        connect: {
            server: {
                options: {
                    base: '<%= meta.app %>',
                    hostname: '*',
                    livereload: true,
                    port: '8000',
                    protocol: 'http',
                    open: true
                }
            },
            test: {
                options: {
                    base: '<%= meta.app %>',
                    hostname: 'localhost',
                    port: '8001'
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
                    { cwd: '<%= meta.app %>', dest: '<%= meta.dist %>', expand: true, src: 'robots.txt' },
                    { cwd: '<%= meta.app %>', dest: '<%= meta.dist %>', expand: true, src: 'images/*'   },
                    { cwd: '<%= meta.app %>', dest: '<%= meta.dist %>', expand: true, src: 'css/*'      },
                    { cwd: '<%= meta.app %>', dest: '<%= meta.dist %>', expand: true, src: 'fonts/*'    }
                ]
            },
            docs: {
                src: '<%= meta.app %>/images/brand-name.png',
                dest: '<%= meta.docs %>/assets/css/logo.png'
            }
        },
        handlebars: {
            options: {
                amd: true,
                namespace: false
            },
            dev: {
                expand: true,
                cwd: '<%= meta.temp %>/template',
                src: '**/*.hbs',
                dest:'<%= meta.app %>/core/template/',
                ext: '.js'
            }
        },
        htmlmin: {
            templates: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeRedundantAttributes: true,
                    removeEmptyAttributes: true
                },
                expand: true,
                cwd: '<%= meta.app %>core/template/hbs/',
                src: '**/*.hbs',
                dest:'<%= meta.temp %>/template/'
            }
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= meta.app %>images',
                    src: '**/*.{png,jpg,jpeg,gif}',
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
            application: {
                files: {
                    '<%= meta.app %>css/application.css': ['<%= meta.app %>less/application.less']
                }
            },
            bootstrap: {
                files: {
                    '<%= meta.app %>css/bootstrap.css'  : ['<%= meta.app %>vendor/bootstrap/less/bootstrap.less']
                }
            }
        },
        qunit: {
            options: {
                timeout: '8100',
                coverage: {
                    src: ['/core/js/**/*.js'],
                    instrumentedFiles: 'report/temp/',
                    htmlReport: 'report/'
                }
            },
            all: {
                options: {
                    urls: [
                        'http://localhost:8001/core/tests/index.html'
                    ]
                }
            }
        },
        requirejs: {
            options: {
                findNestedDependencies: true,
                inlineText: true,
                preserveLicenseComments: false,
                stubModules: ['text', 'json'],
                mainConfigFile: '<%= meta.app %>core/js/config.js',
                baseUrl: '<%= meta.app %>'
            },
            dist: {
                options: {
                    include: ['core/js/main'],
                    insertRequire: ['core/js/main'],
                    name: 'vendor/requirejs/require',
                    optimize: 'none',
                    out: '<%= meta.dist %>js/toppatch-ui.js'
                }
            }
        },
        targethtml: {
            dist: {
                files: [
                    { cwd: '<%= meta.app %>', dest: '<%= meta.dist %>', expand: true, src: '*.html' }
                ]
            }
        },
        uglify: {
            modernizr: {
                files: {
                    '<%= meta.dist %>js/modernizr.min.js': ['<%= meta.app %>vendor/modernizr/modernizr.js']
                }
            },
            dist: {
                options: {
                    banner: '<%= meta.banner %>',
                    sourceMap: '<%= meta.dist %>js/toppatch-ui.map.js'
                },
                files: {
                    '<%= meta.dist %>js/toppatch-ui.js': ['<%= meta.dist %>js/toppatch-ui.js']
                }
            }
        },
        watch: {
            css: {
                files: ['<%= meta.app %>css/*.css'],
                options: { livereload: true }
            },
            html: {
                files: ['<%= meta.app %>*.html'],
                options: { livereload: true }
            },
            javascript: {
                files: ['<%= meta.app %>core/js/**/*.js'],
                options: { livereload: true }
            },
            less: {
                files: ['<%= meta.app %>less/*.less'],
                tasks: ['less:application']
            },
            templates: {
                files: ['<%= meta.app %>core/template/hbs/**/*.hbs'],
                tasks: ['templates']
            }
        },
        yuidoc: {
            compile: {
                name: '<%= meta.pkg.name %>',
                description: '<%= meta.pkg.description %>',
                version: '<%= meta.pkg.version %>',
                url: '<%= meta.pkg.homepage %>',
                options: {
                    paths: '<%= meta.app %>core/js/',
                    ignorePaths: ['template'],
                    outdir: '<%= meta.docs %>'
                }
            }
        }
    });

    grunt.registerTask('default', ['test', 'clean:dev', 'concurrent:dev', 'clean:dist', 'concurrent:dist', 'uglify:dist']);
    grunt.registerTask('dev', ['clean:dev', 'concurrent:dev', 'connect:server', 'watch']);
    grunt.registerTask('docs', ['yuidoc', 'copy:docs']);
    grunt.registerTask('templates', ['clean:temp', 'htmlmin:templates', 'handlebars:dev', 'clean:temp']);
    grunt.registerTask('test', ['jshint', 'connect:test', 'qunit']);
};
