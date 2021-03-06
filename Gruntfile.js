/*jshint strict:false*/
/*global module:false, require: false */
module.exports = function(grunt) {
    require('matchdep').filterAll('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        meta: {
            app: 'app/',
            banner:
                '/**\n' +
                    ' * <%= meta.pkg.name %> v<%= meta.pkg.version %>\n' +
                    ' * www.toppatch.com\n *\n' +
                    ' * Copyright (c) 2012, <%= grunt.template.today("yyyy") %> <%= meta.pkg.author %>\n' +
                    ' */\n',
            dist: 'dist/',
            docs: 'docs/',
            pkg: grunt.file.readJSON('package.json'),
            report: 'report/',
            temp: 'temp/'
        },

        /**********************
         * Task Configuration *
         **********************/

        bower: {
            install: {
                options: {
                    copy: false
                }
            }
        },
        clean: {
            dev: [
                '<%= meta.app %>css',
                '<%= meta.app %>core/template/**/*.js',
                '<%= meta.app %>rvault/template/**/*.js',
                '<%= meta.app %>fonts'
            ],
            dist        : ['<%= meta.dist %>'],
            nodeModules : ['node_modules/'],
            report      : ['<%= meta.report %>'],
            temp        : ['<%= meta.temp %>'],
            vendor      : ['<%= meta.app %>vendor']
        },
        concurrent: {
            dev: [
                'copy:dev',
                'less:application',
                'less:bootstrap',
                'newer:handlebars:core',
                'newer:handlebars:rvault'
            ],
            dist: [
                'copy:dist',
                'cssmin',
                'imagemin:dist',
                'uglify:modernizr',
                'requirejs:dist',
                'targethtml:dist'
            ]
        },
        connect: {
            proxies: [
                {
                    context: ['/api', '/login', '/logout'],
                    host: 'test.toppatch.com',
                    port: 443,
                    https: true,
                    changeOrigin: true
                }
            ],
            server: {
                options: {
                    base: '<%= meta.app %>',
                    hostname: '*',
                    livereload: true,
                    port: '8443',
                    protocol: 'https',
                    open: true,
                    middleware: function (connect, options) {
                        'use strict';
                        var config = [
                            // Serve static files.
                            connect.static(options.base),
                            // Make empty directories browsable.
                            connect.directory(options.base)
                        ];
                        var proxy = require('grunt-connect-proxy/lib/utils').proxyRequest;
                        config.unshift(proxy);
                        return config;
                    }
                }
            }
        },
        copy: {
            dev: {
                files: [
                    { cwd: '<%= meta.app %>vendor/font-awesome/', src: 'fonts/*', dest: '<%= meta.app %>', expand: true }
                ]
            },
            dist: {
                files: [
                    { cwd: '<%= meta.app %>', dest: '<%= meta.dist %>', expand: true, src: 'robots.txt' },
                    { cwd: '<%= meta.app %>', dest: '<%= meta.dist %>', expand: true, src: 'images/*'   },
                    { cwd: '<%= meta.app %>', dest: '<%= meta.dist %>', expand: true, src: 'fonts/*'    }
                ]
            },
            docs: {
                src: '<%= meta.app %>/images/brand-name.png',
                dest: '<%= meta.docs %>/assets/css/logo.png'
            }
        },
        cssmin: {
            options: {
                report: 'min'
            },
            application: {
                options: {
                    banner: '<%= meta.banner %>'
                },
                files: {
                    '<%= meta.dist %>/css/application.css': ['<%= meta.app %>/css/application.css']
                }
            },
            bootstrap: {
                files: {
                    '<%= meta.dist %>/css/bootstrap.css': ['<%= meta.app %>/css/bootstrap.css']
                }
            }
        },
        handlebars: {
            options: {
                amd: true,
                namespace: false,
                processPartialName: function(filePath) {
                    var pattern = 'app\\/(.*?)\\/.*?hbs\\/(?:(.*?)\\..*?)$',
                        regex = new RegExp(pattern, 'g');
                    return filePath.replace(regex, '$1/template/$2');
                },
                processContent: function (content, filepath) {
                    'use strict';
                    var minify = require('html-minifier').minify,
                        options = {
                            removeComments: true,
                            collapseWhitespace: true,
                            collapseBooleanAttributes: true,
                            removeRedundantAttributes: true,
                            removeEmptyAttributes: true
                        },
                        min;

                    try {
                        min = minify(content, options);
                    } catch (err) {
                        var error = err.split(/(.*?):/)[1];
                        grunt.warn(error + ': ' + filepath);
                    }

                    if (min.length < 1) {
                        grunt.log.warn(filepath + ' minified to empty string.');
                    }

                    return min;
                }
            },
            core: {
                expand: true,
                cwd: '<%= meta.app %>core/template/hbs/',
                src: '**/*.hbs',
                dest:'<%= meta.app %>/core/template/',
                ext: '.js'
            },
            rvault: {
                expand: true,
                cwd: '<%= meta.app %>rvault/template/hbs/',
                src: '**/*.hbs',
                dest:'<%= meta.app %>rvault/template/',
                ext: '.js'
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
                src: ['<%= meta.app %>core/tests/**/*.js']
            },
            rvault: {
                options: {
                    jshintrc: '<%= meta.app %>rvault/js/.jshintrc'
                },
                src: ['<%= meta.app %>rvault/js/**/*.js']
            },
            rvaultTests: {
                options: {
                    jshintrc: '<%= meta.app %>rvault/tests/.jshintrc'
                },
                src: ['<%= meta.app %>rvault/tests/**/*.js']
            }
        },
        less: {
            bootstrap: {
                files: {
                    '<%= meta.app %>css/bootstrap.css'  : ['<%= meta.app %>/core/less/custom.bootstrap.less']
                }
            },
            application: {
                files: {
                    '<%= meta.app %>css/application.css': ['<%= meta.app %>/core/less/core.less']
                }
            }
        },
        qunit: {
            options: {
                timeout: '8100',
                coverage: {
                    src: [
                        '<%= meta.app %>core/js/**/*.js',
                        '<%= meta.app %>rvault/js/**/*.js'
                    ],
                    instrumentedFiles: '<%= meta.temp %>',
                    coberturaReport: '<%= meta.report %>cobertura',
                    htmlReport: '<%= meta.report %>'
                }
            },
            all: [
                '<%= meta.app %>core/tests/**/*.html',
                '<%= meta.app %>rvault/tests/**/*.html'
            ]
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
            gruntfile: {
                files: ['Gruntfile.js']
            },
            html: {
                files: ['<%= meta.app %>*.html'],
                options: { livereload: true }
            },
            javascript: {
                files: [
                    '<%= meta.app %>core/js/**/*.js',
                    '<%= meta.app %>core/template/*.js',
                    '<%= meta.app %>rvault/js/**/*.js',
                    '<%= meta.app %>rvault/template/*.js'
                ],
                options: { livereload: true }
            },
            less: {
                files: [
                    '<%= meta.app %>core/less/*.less',
                    '<%= meta.app %>rvault/less/*.less'
                ],
                tasks: ['less:application']
            },
            hbsCore: {
                files: ['<%= meta.app %>core/template/hbs/**/*.hbs'],
                tasks: ['newer:handlebars:core']
            },
            hbsRVault: {
                files: ['<%= meta.app %>rvault/template/hbs/**/*.hbs'],
                tasks: ['newer:handlebars:rvault']
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

    grunt.registerTask('default', ['_devBuild', 'configureProxies', 'connect:server', 'watch']);
    grunt.registerTask('build', ['clean:dist', '_devBuild', 'test', 'concurrent:dist', 'uglify:dist']);
    grunt.registerTask('docs', ['yuidoc', 'copy:docs']);
    grunt.registerTask('test', ['jshint', 'clean:report', 'qunit']);

    grunt.registerTask('_devBuild', ['clean:dev', 'bower:install', 'concurrent:dev']);
};
