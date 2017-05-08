module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';'
            },
            libs: {
                src: [
                    "js/jquery-1.11.2.min.js",
                    "js/bootstrap.min.js",
                    "js/theme.js",
                    "lib/moment.js",
                    "lib/vcard/vcard.js",
                ],
                dest: 'libs.js'
            },
            custom: {
                src: [
                    "src/app.js",
                    "src/**/*.js",
                ],
                dest: 'custom.js'
            },
            angular: {
                src: [
                    "lib/angular/angular.js",
                    "lib/angular/angular-animate.js",
                    "lib/angular/ngStorage.min.js",
                    "lib/angular/angular-ui-router.js",
                    "lib/angular/ui-bootstrap.min.js",
                    "lib/angular/image-crop.js",
                    "lib/angular/angular-ui-utils.min.js",
                    "lib/angular/paging.min.js",
                    "lib/angular/ng-time-relative.js",
                    "lib/angular/angular-sanitize.min.js",
                    "lib/angular/ng-tags-input.min.js",
                    "lib/angular/autocomplete.js",
                ],
                dest: 'ng-libs.js'
            },
        },
        connect: {
          server: {
            options: {
              protocol:'http',
              livereload: true,
              hostname:'localhost',
              open:{
                // target:'http://localhost:3006/clientapp/index.html?pid=<%=appsettings.first_product_id%>', // target url to open
                target:'http://localhost:3006/', // target url to open
                //appName:'Chrome', // name of the app that opens, ie: open, start, xdg-open
                callback: function() {} // called when the app has opened
              },
             
              port: 3006
            }
          }
        },
        uglify: {
            options: {
                mangle: true,
            },
            my_target: {
                files: {
                    'custom.js': ['custom.js'],
                    'libs.js': ['libs.js'],
                    'ng-libs.js': ['ng-libs.js'],
                }
            }
        },
        comments: {
            my_target: {
                // Target-specific file lists and/or options go here.
                options: {
                    singleline: true,
                    multiline: true
                },
                src: ['custom.js', 'libs.js'] // files to remove comments from
            },
        },
        ngAnnotate: {
            options: {

            },
            appannotate: {
                files: {
                    'custom.js': ['custom.js']
                },
            },

        },
        watch: {
            options: {
                livereload: true,
            },
            debug: {
                files: ['src/*.js', 'src/**/*.js'],
                tasks: ['concat', 'comments:my_target', 'ngAnnotate:appannotate'],
                options: {
                    livereload: true
                }
            },
            built: {
                files: ['src/*.js', 'src/**/*.js'],
                tasks: ['concat', 'comments:my_target', 'ngAnnotate:appannotate', 'uglify:my_target', "cssmin:combine"],
                options: {
                    livereload: true
                }
            }
        },
        clean: ["custom.js","libs.js","ng-libs.js"],
        cssmin: {
            combine: {
                files: {
                    'css/all.css': [
                        "css/bootstrap.min.css",
                        "css/head-style.css",
                        "css/responsive.css",
                        "css/font-awesome.min.css"
                    ],

                }
            }
        },
        cachebreaker: {
            dev: {
                options: {
                    match: ['custom.js'],
                },
                files: {
                    src: ['index.html']
                }
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-stripcomments');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-cache-breaker');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    // grunt.loadNpmTasks('grunt-contrib-connect');
    // grunt.loadNpmTasks('grunt-notify');
    // Default task(s).
    grunt.registerTask('default', ['clean','concat', 'connect','comments:my_target', 'ngAnnotate:appannotate', 'cachebreaker:dev','watch:debug']);
    grunt.registerTask('built', ['concat', 'comments:my_target', 'connect', 'ngAnnotate:appannotate', 'uglify:my_target', 'cssmin:combine','cachebreaker:dev', 'watch:built']);

};
