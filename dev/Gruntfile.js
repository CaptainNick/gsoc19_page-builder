module.exports = function(grunt) {

	var CmSettings = grunt.file.readYAML('settings.yaml');

	// Project configuration.
	grunt.initConfig({
		folder : {
			system : '../media/system/js',
			fields : '../media/system/js/fields',
			puny   : '../media/vendor/punycode/js',
			cmadd  : '../media/vendor/codemirror/addon',
			cmkey  : '../media/vendor/codemirror/keymap',
			cmlib  : '../media/vendor/codemirror/lib',
			cmmod  : '../media/vendor/codemirror/mode',
			cmthem : '../media/vendor/codemirror/theme',
		},

		// Let's clean up the system
		clean: {
			assets: {
				src: [
					'assets/tmp/**',
					'../media/vendor/jquery/js/*',
					'!../media/vendor/jquery/js/*jquery-noconflict.js*', // Joomla owned
					'../media/vendor/bootstrap/**',
					'../media/vendor/tether/**',
					'../media/vendor/jcrop/**',
					'../media/vendor/font-awesome/**',
					'../media/vendor/tinymce/plugins/*',
					'../media/vendor/tinymce/skins/*',
					'../media/vendor/tinymce/themes/*',
					'!../media/vendor/tinymce/plugins/*jdragdrop*',  // Joomla owned
					'../media/vendor/punycode/*',
					'../media/vendor/codemirror/*',
					'../media/vendor/combobox/*',
				],
				expand: true,
				options: {
					force: true
				},
			},
		},
		// Update all the packages to the version specified in assets/package.json
		shell: {
			update: {
				command: 'cd assets; npm install'
			}
		},
		// Download latest packages from github for any assets with no npm package
		gitclone: {
			cloneCodemirror: {
				options: {
					repository: 'https://github.com/codemirror/CodeMirror.git',
					branch: 'master',
					directory: 'assets/tmp/codemirror'
				}
			},
			cloneCombobox: {
				options: {
					repository: 'https://github.com/danielfarrell/bootstrap-combobox.git',
					branch    : 'master',
					directory : 'assets/tmp/combobox'
				}
			},
			cloneCropjs: {
				options: {
					repository: 'https://github.com/tapmodo/Jcrop.git',
					branch    : 'master',
					directory : 'assets/tmp/jcrop'
				}
			}
		},

		// Concatenate some jacascript files
		concat: {
			someFiles: {
				files: [
					{
						src: CmSettings.addons.js.map(function (v) {
							return 'assets/tmp/codemirror/' + v;
						}),
						dest:'assets/tmp/codemirror/lib/addons.js'
					},
					{
						src: CmSettings.addons.css.map(function (v) {
							return 'assets/tmp/codemirror/' + v;
						}),
						dest: 'assets/tmp/codemirror/lib/addons.css'
					}
				]
			}
		},

		// Minimize some javascript files
		uglify: {
			allJs: {
				files: [
					{
						src: ['<%= folder.system %>/*.js','!<%= folder.system %>/*.min.js'],
						dest: '',
						expand: true,
						ext: '.min.js'
					},
					// calendar is still with the old name conv
					// {
					// 	src: ['<%= folder.fields %>/*.js','!<%= folder.fields %>/*.min.js'],
					// 	dest: '',
					// 	expand: true,
					// 	ext: '.min.js'
					// },
					{
						src: ['<%= folder.cmadd %>/*/*.js','!<%= folder.cmadd %>/*/*.min.js'],
						dest: '',
						expand: true,
						ext: '.min.js'
					},
					{
						src: ['<%= folder.cmkey %>/*.js','!<%= folder.cmkey %>/*.min.js'],
						dest: '',
						expand: true,
						ext: '.min.js'
					},
					{
						src: ['<%= folder.cmlib %>/*.js','!<%= folder.cmlib %>/*.min.js'],
						dest: '',
						expand: true,
						ext: '.min.js'
					},
					{
						src: ['<%= folder.cmmod %>/*/*.js','!<%= folder.cmmod %>/*/*.min.js'],
						dest: '',
						expand: true,
						ext: '.min.js'
					},
					{
						src: ['<%= folder.cmthem %>/*/*.js','!<%= folder.cmthem %>/*/*.min.js'],
						dest: '',
						expand: true,
						ext: '.min.js'
					},
					// Uglifying punicode.js fails!!!
					// {
					// 	src: ['<%= folder.puny %>/*.js','!<%= folder.puny %>/*.min.js'],
					// 	dest: '',
					// 	expand: true,
					// 	ext: '.min.js'
					// }
				]
			}
		},

		// Transfer all the assets to media/vendor
		copy: {
			fromSource: {
				files: [
					{ // jQuery files
						expand: true,
						cwd: 'assets/node_modules/jquery/dist/',
						src: ['*', '!(core.js)'],
						dest: '../media/vendor/jquery/js/',
						filter: 'isFile'
					},
					{ // jQuery migrate files
						expand: true,
						cwd: 'assets/node_modules/jquery-migrate/dist/',
						src: ['**'],
						dest: '../media/vendor/jquery/js/',
						filter: 'isFile'
					},
					{ //Bootastrap js files
						expand: true,
						cwd: 'assets/node_modules/bootstrap/dist/js/',
						src: ['**'],
						dest: '../media/vendor/bootstrap/js/',
						filter: 'isFile'
					},
					{ //Bootastrap scss files
						expand: true,
						cwd: 'assets/node_modules/bootstrap/scss/',
						src: ['**'],
						dest: '../media/vendor/bootstrap/scss/',
						filter: 'isFile'
					},
					{ //Bootastrap css files
						expand: true,
						cwd: 'assets/node_modules/bootstrap/dist/css/',
						src: ['**'],
						dest: '../media/vendor/bootstrap/css/',
						filter: 'isFile'
					},
					{ //Teether js files
						expand: true,
						cwd: 'assets/node_modules/tether/dist/js/',
						src: ['**'],
						dest: '../media/vendor/tether/js/',
						filter: 'isFile'
					},
					{ // Punycode
						expand: true,
						cwd: 'assets/node_modules/punycode/',
						src: ['punycode.js', 'LICENSE-MIT.txt'],
						dest: '../media/vendor/punycode/js/',
						filter: 'isFile'
					},
					{ // Bootstrap-combobox
						expand: true,
						cwd: 'assets/tmp/combobox/js',
						src: 'bootstrap-combobox.js',
						dest: '../media/vendor/combobox/js/',
						filter: 'isFile'
					},
					{ // Bootstrap-combobox
						expand: true,
						cwd: 'assets/tmp/combobox/css',
						src: 'bootstrap-combobox.css',
						dest: '../media/vendor/combobox/css/',
						filter: 'isFile'
					},
					{ // jcrop
						expand: true,
						cwd: 'assets/tmp/jcrop/css',
						src: ['**'],
						dest: '../media/vendor/jcrop/css/',
						filter: 'isFile'
					},
					{ // jcrop
						expand: true,
						cwd: 'assets/tmp/jcrop/js',
						src: ['jquery.Jcrop.min.js', 'jquery.Jcrop.js'],
						dest: '../media/vendor/jcrop/js/',
						filter: 'isFile'
					},
					{ //Font Awesome css files
						expand: true,
						cwd: 'assets/node_modules/font-awesome/css/',
						src: ['**'],
						dest: '../media/vendor/font-awesome/css/',
						filter: 'isFile'
					},
					{ //Font Awesome scss files
						expand: true,
						cwd: 'assets/node_modules/font-awesome/scss/',
						src: ['**'],
						dest: '../media/vendor/font-awesome/scss/',
						filter: 'isFile'
					},
					{ //Font Awesome fonts files
						expand: true,
						cwd: 'assets/node_modules/font-awesome/fonts/',
						src: ['**'],
						dest: '../media/vendor/font-awesome/fonts/',
						filter: 'isFile'
					},
					// tinyMCE
					{ // tinyMCE files
						expand: true,
						cwd: 'assets/node_modules/tinymce/plugins/',
						src: ['**'],
						dest: '../media/vendor/tinymce/plugins/',
						filter: 'isFile'
					},
					{ // tinyMCE files
						expand: true,
						cwd: 'assets/node_modules/tinymce/skins/',
						src: ['**'],
						dest: '../media/vendor/tinymce/skins/',
						filter: 'isFile'
					},
					{ // tinyMCE files
						expand: true,
						cwd: 'assets/node_modules/tinymce/themes/',
						src: ['**'],
						dest: '../media/vendor/tinymce/themes/',
						filter: 'isFile'
					},
					{ // tinyMCE files
						expand: true,
						cwd: 'assets/node_modules/tinymce/',
						src: ['tinymce.js','tinymce.min.js','license.txt','changelog.txt'],
						dest: '../media/vendor/tinymce/',
						filter: 'isFile'
					},
					// Code mirror
					{ // Code mirror files
						expand: true,
						cwd: 'assets/tmp/codemirror/addon/',
						src: ['**'],
						dest: '../media/vendor/codemirror/addon/',
						filter: 'isFile'
					},
					{ // Code mirror files
						expand: true,
						cwd: 'assets/tmp/codemirror/keymap/',
						src: ['**'],
						dest: '../media/vendor/codemirror/keymap/',
						filter: 'isFile'
					},
					{ // Code mirror files
						expand: true,
						cwd: 'assets/tmp/codemirror/lib',
						src: ['**'],
						dest: '../media/vendor/codemirror/lib/',
						filter: 'isFile'
					},
					{ // Code mirror files
						expand: true,
						cwd: 'assets/tmp/codemirror/mode',
						src: ['**'],
						dest: '../media/vendor/codemirror/mode/',
						filter: 'isFile'
					},
					{ // Code mirror files
						expand: true,
						cwd: 'assets/tmp/codemirror/theme',
						src: ['**'],
						dest: '../media/vendor/codemirror/theme/',
						filter: 'isFile'
					},
					// Licenses
					{ // jQuery
						src: ['assets/node_modules/jquery/LICENSE.txt'],
						dest: '../media/vendor/jquery/LICENSE.txt',
					},
					{ // Bootstrap
						src: ['assets/node_modules/bootstrap/LICENSE'],
						dest: '../media/vendor/bootstrap/LICENSE',
					},
					{ // tether
						src: ['assets/node_modules/tether/LICENSE'],
						dest: '../media/vendor/tether/LICENSE',
					},
					{ // Code mirror
						src: ['assets/tmp/codemirror/LICENSE'],
						dest: '../media/vendor/codemirror/LICENSE',
					},
					{ // Jcrop
						src: ['assets/tmp/jcrop/MIT-LICENSE.txt'],
						dest: '../media/vendor/jcrop/MIT-LICENSE.txt',
					},
				]
			}
		},

		// Let's minify some css files
		cssmin: {
			allCss: {
				files: [{
					expand: true,
					matchBase: true,
					ext: '.min.css',
					cwd: '../media/vendor/codemirror',
					src: ['*.css', '!*.min.css', '!theme/*.css'],
					dest: '../media/vendor/codemirror',
				}]
			}
		}
	});

	// Load required modules
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-git');

	grunt.registerTask('default',
		[
			'clean:assets',
			'shell:update',
			'gitclone:cloneCodemirror',
			'gitclone:cloneCombobox',
			'gitclone:cloneCropjs',
			'concat:someFiles',
			'copy:fromSource',
			'uglify:allJs',
			'cssmin:allCss'
		]
	);
};