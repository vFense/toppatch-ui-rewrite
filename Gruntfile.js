module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        banner: '/**\n' +
                '* <%= pkg.name %> v<%= pkg.version %>\n' +
                '* Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
                '*/\n',
        clean: {
            dist: ['dist'],
            bowerDeps: ['app/js/vendor']
        }
    });
};
