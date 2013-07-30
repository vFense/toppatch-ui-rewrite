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
            recess: {
                files: ['<%= rv.app %>/less/*.less', '<%= rv.app %>/bootstrap/less/*.less'],
                tasks: ['recess:dev']
            }
        },
        clean: {
            dist: ['dist']
        },
        uglify: {
            dist: {
                files: {
                    '<%= rv.dist %>/js/modernizr.js': ['<%= rv.app %>/vendor/modernizr/modernizr.js']
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
            dev: {
                files: {
                    '<%= rv.app %>/css/bootstrap.css'  : ['<%= rv.app %>/vendor/bootstrap/less/bootstrap.less'],
                    '<%= rv.app %>/css/application.css': ['<%= rv.app %>/less/application.less']
                }
            },
            dist: {
                options: {
                    compress: true
                },
                files: {
                    '<%= rv.dist %>/css/bootstrap.min.css'  : ['<%= rv.app %>/vendor/bootstrap/less/bootstrap.less'],
                    '<%= rv.dist %>/css/application.min.css': ['<%= rv.app %>/less/application.less']
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
        concurrent: {
            dist: [
                'recess:dist',
                'imagemin:dist',
                'uglify:dist',
                'requirejs:dist'
            ]
        }
    });

    grunt.registerTask('dist', ['clean:dist', 'concurrent:dist']);
};
