# Gutenberg Gulp Boilerplate

Gulp 3.9.1 boilerplate to make a WordPress theme based on https://github.com/WordPress/gutenberg-starter-theme and https://github.com/nuriarai/gulp-talkWP-boilerplate

## Getting started

0) Install WordPress and copy or clone this repository into the themes folder.

1) Select this theme from the WordPress dashboard.

2) Go to `gulpfile.js` and modify the line containing `proxy: "wpdev.test",` with the url of your local proxy.

3) Go to `functions.php`to edit these lines and set your environments:

  ```
    /* environement */
		// Set your environment/url pairs
		$environments = array(
			'local' => 'wpdev.test',
			'staging' => 'staging.wpdev.test',
			'production' => 'production.wpdev.test'
		);
  ```
4) Open a terminal and go to the root of the repository or the theme folder, then run `npm install` to install all the modules.
  
5) You must have `gulp` installed. To see if is installed run `gulp -v`.      
  It shows the version:
  ```
  [13:36:48] CLI version 3.9.1
  [13:36:48] Local version 3.9.1
  ```

6) To start developing run `gulp watch`. It will open a browser with the WordPress web in `localhost:3000`.

7) To minify the assets for production you can run `gulp deploy`.