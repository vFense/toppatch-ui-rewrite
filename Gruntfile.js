module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        banner: '/**\n' +
                '* <%= pkg.name %> v<%= pkg.version %>\n' +
                '* Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
                '*/\n',
        clean: {
            dist: ['dist']
        },
        recess: {
            options: {
                compile: true
            },
            dev: {
                files: {
                    'app/css/application.css': ['app/less/application.less']
                }
            },
            dist: {
                options: {
                    compress: true
                },
                files: {
                    'dist/css/bootstrap.min.css': ['app/vendor/bootstrap/less/bootstrap.less'],
                    'dist/css/application.min.css': ['app/less/application.less']
                }
            }
        },
        watch: {
            recess: {
                files: 'app/less/*.less',
                tasks: ['recess:dev']
            }
        },
        requirejs: {
            compile: {
                options: {
                    baseUrl: 'app',
                    mainConfigFile: 'app/js/config.js',
                    out: 'dist/js/application.min.js'
                }
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-recess');


    grunt.registerTask('dist-css', ['recess:dist']);
    grunt.registerTask('dist', ['clean', 'dist-css']);
};
