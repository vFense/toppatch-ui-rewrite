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
    grunt.loadNpmTasks('bower');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-recess');


    grunt.registerTask('dist', ['clean']);
};
