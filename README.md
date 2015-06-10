# Application template for Firefox OS

This template can be used to simply create Firefox OS applications.

It aims at providing a basic structure to have a nice-looking (matching Gaia styles) application from lightweight libraries.

It doesn't fully complies with the set of recommended tools (Agular, etc.) that are too heavy IMHO, but it does (at least it tries to) comply with the global principles of a well-constructed Web application (such as views and controllers separation, responsive design, l10n).

# From this template to your application

Once you've checked it out, you'll need to adapt it to make it your application.

## Make it yours

Edit [manifest file](manifest.webapp), find the "developer" key and fill the following information:
1. "name", your name
2. "url", the URL to your website

## Give it a name, description and icon

1. Edit [manifest file](manifest.webapp) and fill the following information:
  1. "name", your application's name in English
  2. "description", your application's description in English
2. Edit [interface page](index.html) and fill the "title" tag
3. Get an icon (128x128 PNG) and place it into file "images/icon-128.png"

For convenience, a "__APPNAME__" macro has been placed all around the files so you can use sed to name your application.

# Dependencies

All runtime dependencies are provided with the template, located in the [lib folder](lib).

* [jQuery](https://jquery.com/) 2.1.4
* [Handlebars.js](http://handlebarsjs.com/) 3.0.3
* [Underscore.js](http://underscorejs.org/) 1.8.3
* [Backbone.js](http://backbonejs.org/) 1.2.1
