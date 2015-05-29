module.exports = function (grunt) {
	'use strict';

	var pkg = grunt.file.readJSON('package.json');
	// Project configuration.
	grunt.initConfig({
		pkg: pkg,
		banner: '/*!\n' +
			' * <%= pkg.name %> v<%= pkg.version %> (<%= pkg.homepage %>) - <%= pkg.description %>\n' +
			' * <%= grunt.template.today("dd-mm-yyyy") %> <%= pkg.author %>\n' +
			' */\n',
		dirs: {
			dest: 'build/',
			fonts: 'build/fonts/',
			lib: 'bower_components',
			src: 'app',
			tests: 'tests'
		},
		clean: {
			build: ['build/', 'font/', '.sass-cache/'], // Clean the build folder (remove every files)
			temp: ['build/static/script.*.js']
		},
		copy: {
            fonts: {//Copy the fonts from fontawesome
                expand: true, flatten: true, src: ['<%= dirs.lib %>/fontawesome/fonts/*'], dest: '<%= dirs.fonts %>/', filter: 'isFile'
            },
            index: {//Copy the built index to the root of the folder
                flatten: true, expand: true, src: ['<%= dirs.dest %>/index.html'], dest: '', filter: 'isFile'
            }
        },
		jshint: { // Check the syntax of js files
			files: [
				'Gruntfile.js',
				'<%= dirs.src %>/**/*.js'
			],
			// configure JSHint (documented at http://www.jshint.com/docs/options)
			options: {
				// more options here if you want to override JSHint defaults
				freeze: true, // prohibits overwriting prototypes of native objects such as Array, Date and so on.
				browser: true, // This option defines globals exposed by modern browsers (FileRead, document).
				eqnull: true, // This option suppresses warnings about == null comparisons.
				es3: false, // This option tells JSHint that your code needs to adhere to ECMAScript 3 specification -- We do not support legacy js environment such as IE6/7/8.
				forin: true, // This option requires all for in loops to filter object's items.
				eqeqeq: true, // This options prohibits the use of == and != in favor of === and !==.
				latedef: true, // This option prohibits the use of a variable before it was defined
				nonbsp: true, // This option warns about "non-breaking whitespace" characters
				noempty: true, // This option warns when you have an empty block in your code
				noarg: true, // This option prohibits the use of arguments.caller and arguments.callee
				quotmark: true, // This option enforces the consistency of quotation marks used throughout your code
				unused: 'vars', // This option warns when you define and never use your variables (set to vars to not check function parameters
				trailing: true, // This option makes it an error to leave a trailing whitespace in your code
				globals: {
					console: true,
					angular: true
				}
			}
		},
		connect: {
			dev: {
				options: {
					port: 1337,
					base: '.'
				}
			},
			prod: {
				options: {
					port: 1337,
					base: '.',
					keepalive: true
				}
			}
		},
		/**
		 * compile 'source/' to 'build/'
		 **/
		'file-creator': { // this task fetches every js files in our app and write script tag in a html files. The html generated file is included in the index.html served by the python server.
			'template_cache': {
				files: [
					{
						file: '<%= dirs.dest %>/<%= pkg.name %>-<%= pkg.version %>.tpl.js',
						method: function(fs, fd, done) {
							var glob = grunt.file.glob;
							var Q = require('q');
							var deferred = Q.defer();
							deferred.resolve();
							var fileData = {};

							deferred.promise.then(function() {
								var deferred = Q.defer();
								glob('app/**/*.html', function (err, files) {
									for (var i = 0; i < files.length; i++) {
										var filename = files[i];
										fileData[filename] = grunt.file.read(files[i]);
									}
									deferred.resolve();
								});
								return deferred.promise;
							}).then(function() {
								fs.writeSync(fd, wrap_loader(fileData));
								done();
							}, function() {
								// error
							});
							
							function	wrap_loader(fileMap) {
								return '' +
									'(function(){' +
										'angular.module(\'app.templates\').run([\'$templateCache\',function($templateCache){' +
											'var cache=' + JSON.stringify(fileMap) + ';' +
											'for(var i in cache){if(cache.hasOwnProperty(i))$templateCache.put(i,cache[i])};' +
										'}]);' +
									'})();';
							}
						}
					}
				]
			},
            'do_index': function(fs, fd, done, stylesheets, scripts) {
                var index_html = grunt.file.read('app/template/index.html');

                for (var i=0; i<stylesheets.length; i++) {
                    stylesheets[i] = '<link rel="stylesheet" href="' + stylesheets[i] + '" media="screen, projection" type="text/css">';
                }

                for (i=0; i<scripts.length; i++) {
                	console.info('script: ', i, ' : ' ,scripts[i]);
                    scripts[i] = '<script type="text/javascript" src="' + scripts[i] + '"></script>';
                }
                index_html = index_html
                    .replace('<!-- %styles% -->', stylesheets.join('\n    '))
                    .replace('<!-- %scripts% -->', scripts.join('\n    '));
                fs.writeSync(fd, index_html);
                done();
            },
            'index': {
				files: [
                    {
                        file: '<%= dirs.dest %>/index.html',
                        method: function (fs, fd, done) {
                            var pkg = grunt.config.get('pkg');

                            var stylesheets = [
                                '/build/' + pkg.name + '-' + pkg.version + '.min.css'
                            ];
                            var scripts = [
                                'http://localhost:8000/?format=javascript',
                                '/build/lib.js'
                            ];

                            var Q = require('q');
                            var deferred = Q.defer();
                            deferred.resolve();
                            deferred.promise.then(function () {
                                var deferred = Q.defer();
                                var glob = grunt.file.glob;
                                var _ = grunt.util._;
                                var fileToExclude = []; // put in this array the excluded files, i.e : 'app/lib/jointjs/joint.min.js'


								scripts.push('app/app.js');

								glob('app/shared/**/*.js', function (err, files) {
									_.each(files, function (file) {
										scripts.push(file);
									});

									scripts.push('app/route.js');

									glob('app/**/*.js', function (err, files) {
										_.each(files, function (file) {
											if (!_.contains(scripts, file) && !_.contains(fileToExclude, file)) {
												scripts.push(file);
											}
										});

										deferred.resolve();
									});
								});

                                return deferred.promise;
                            }).then(function () {
                                scripts.push('/build/' + pkg.name + '-' + pkg.version + '.tpl.js');
                                grunt.config.get('file-creator').do_index(fs, fd, done, stylesheets, scripts);
                            }, function () {
                                // error
                            });
                        }
                    }
                ]
            }
        },
	    sass: { //Compiling our scss files to css files
            compile: {
              options: {
                 style: 'expanded' //keep the css readable, anyways it will be compressed later on
              },
              files: [{
                expand: true,
                src: ['<%= dirs.src %>/**/*.scss'],
                dest: '', //Keep the same architecture as the src. So the concat_app will have no problem finding these files
                ext: '.css'
              }]
            }
        },
		concat: { // Concat js and css files
			options: {
				banner: '<%= banner %>\n',
				stripBanners: true
			},
			js_librairies: { // Concat already minified files from 3rd party libs (fetched using bower) with our freshly minified files
				src: [
					'<%= dirs.lib %>/angular/angular.min.js', //Angular first
					'<%= dirs.lib %>/**/*.min.js', //Every mininied js files fetched by bower
					'!<%= dirs.lib %>/**/Gruntfile.js', //Every mininied js files fetched by bower
					'!<%= dirs.lib %>/jquery/**/*.js', //We dont need jquery atm
					'!<%= dirs.lib %>/bootstrap/**/*.js', //We dont need bootstrap js files
					'!<%= dirs.lib %>/angular-bootstrap/ui-bootstrap.min.js', //Exclude this file cause we use the tpls one
				],
				dest: '<%= dirs.dest %>/lib.js',
				nonull: true // check that required src files exists
			},
			css_app: { // Concat our Css files
				src: [
					'<%= dirs.src %>/**/*.css',
				],
				dest: '<%= dirs.dest %>/<%= pkg.name %>-<%= pkg.version %>.css',
				nonull: true // check that required src files exists
			},
			css_librairies_app: { // Concat already minified css files from 3rd party libs (fetched using bower) with our freshly minified files
				src: [
					'<%= dirs.lib %>/bootstrap/**/*.min.css',
					'<%= dirs.lib %>/fontawesome/**/*.min.css',
					'<%= dirs.dest %>/<%= pkg.name %>-<%= pkg.version %>.css', //our files
				],
				dest: '<%= dirs.dest %>/<%= pkg.name %>-<%= pkg.version %>.min.css',
				nonull: true // check that required src files exists
			},
		},
		uglify: { // Shrink js files
			options: {
				banner: '<%= banner %>\n',
				stripBanners: false,
//				mangle: { except: ['Angular'] },
			},
			js_app: {
				files: {
					'<%= dirs.dest %>/script.app.js': ['<%= concat.js_app.dest %>'/*, '<%= concat.file-creator.template_cache.dest %>'*/] // Minify our files
				}
			}
		},
		cssmin: { // Minify css files
			'amin': {
				files: {
					'<%= dirs.dest %>/<%= pkg.name %>-<%= pkg.version %>.min.css': ['<%= concat.css_app.dest %>'], // Minify our own css files
				}
			}
		},
		watch: { // Run tasks whenever watched files change
            scripts: {
                options: {
                    atBegin: true
                },
                files: ['<%= dirs.src %>/**/*.js', '<%= dirs.src %>/**/*.scss','<%= dirs.src %>/**/*.css', '<%= dirs.src %>/**/*.html'],
                tasks: ['jshint', 'concat:js_librairies', 'scss', 'concat:css_app', 'concat:css_librairies_app', 'write'] // Everytime we save a file, we apply these tasks
            }
        }
	});

	// Load dependencies specified in package.json to avoid doing grunt.loadNpmTasks('exemple')
	require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });

	/**
	* Side tasks
	**/
	grunt.registerTask('write', ['file-creator:index', 'copy:index', 'file-creator:template_cache']); // Dynamic include js file to avoid the tedious task of manually adding every new js files
	grunt.registerTask('scss', ['sass:compile']); //Compile our scss file

	/**
	 *	Our main tasks
	 */

	//init the  environment (execute it if you checkout the repo, if you want to have the newest translation strings)
	grunt.registerTask('init', [
		'clean',
		'copy:favicon',
		'copy:fonts',
	]);

	grunt.registerTask('dev', ['watch']); // use this task when you develop
};