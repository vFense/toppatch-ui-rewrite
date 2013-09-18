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
                'less:bootstrap',
                'templates'
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
                    livereload: true,
                    port: '8000',
                    protocol: 'http',
                    open: true
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
                cwd: '<%= meta.temp %>',
                src: 'template/**/*.html',
                dest:'<%= meta.temp %>/',
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
                cwd: '<%= meta.app %>core/',
                src: 'template/**/*.html',
                dest:'<%= meta.temp %>/'
            }
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= meta.dist %>images',
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
                    jshintrc: '<%= meta.app %>core/js/.jshintrc',
                    ignores: '<%= meta.app %>core/js/template/**/*.js'
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
        qunit: {
            options: {
                timeout: '8100',
                coverage: {
                    src: ['<%= meta.app %>core/js/**/*.js', '!<%= meta.app%>core/js/template/**'],
                    instrumentedFiles: 'report/temp/',
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
                mainConfigFile: '<%= meta.app %>core/js/config.js',
                baseUrl: '<%= meta.app %>'
            },
            dist: {
                options: {
                    include: ['core/js/main'],
                    insertRequire: ['core/js/main'],
                    name: 'vendor/requirejs/require',
                    optimize: 'uglify2',
                    out: '<%= meta.dist %>js/toppatch-ui.js',
                    uglify2: {
                        'screw-ie8': true
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
            },
            templates: {
                options: {
                    beautify: {
                        width: 80,
                        beautify: true,
                        bracketize: true
                    },
                    mangle: false,
                    compress: false,
                    'screw-ie8': true
                },
                expand: true,
                cwd: '<%= meta.temp %>/template/',
                src: '**/*.js',
                dest: '<%= meta.app %>/core/js/template'
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
                files: ['<%= meta.app %>core/template/**/*.html'],
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

    grunt.registerTask('default', ['test', 'clean:dist', 'copy:dist', 'templates', 'concurrent:dist', 'concat']);
    grunt.registerTask('dev', ['clean:app', 'copy:dev', 'concurrent:dev', 'connect', 'watch']);
    grunt.registerTask('docs', ['yuidoc', 'copy:docs']);
    grunt.registerTask('templates', ['clean:temp', 'htmlmin:templates', 'handlebars:dev', 'uglify:templates', 'clean:temp']);
    grunt.registerTask('test', ['jshint', 'qunit']);
};
