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

## Give it a main view

The main view is almost ready. All you need to do is write some contents in its [HTML template](views/main.html).

# From this basis to a full application

## Adding models

Your application will probably have to deal with data.

Data should be handled by models that are located into [models/](models/) folder.

Models should be loaded the same way views are, using Require.js (see [app.js](app.js) for an example).

## Adding views

Adding views implies the following steps:

1. Declare a route for your view, this has to be placed in [app.js](app.js) where you should add both an entry into "routes" hash and a function handling the route
2. Create a Backbone view in a dedicated file (see [views/main.js](main view example))
3. Create a HTML template in a dedicated file (see [views/main.html](main view template example))

## Using Firefox OS interface elements

Firefox OS interface is named Gaia. Some of its standardized elements are shipped with this application template under the [styles/](styles/) folder.

Documentation about these "Building Blocks" can be found on [Mozilla Wiki](https://developer.mozilla.org/en-US/Apps/Design/Firefox_OS_building_blocks#Firefox_OS_Building_Blocks).

## Making it international

The application template comes with [webL10n i18n/l10n library](https://github.com/fabi1cazenave/webL10n/blob/master/l10n.js) making the application translatable.

Documentation about the localization procedure can be found on [Mozilla Wiki](https://developer.mozilla.org/en-US/Apps/Build/Localization/Getting_started_with_app_localization#The_localization_procedure).

# Building

Building process currently only consists in precompiling Handlebars templates. Just run "make" ;-)

# Dependencies

## Build dependencies

Because of [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/Security/CSP), Handlebars templates can't be loaded from HTML files and need to be precompiled.
Handlebars precompilation can be [installed from NPM](http://handlebarsjs.com/precompilation.html).

## Runtime dependencies

All runtime dependencies are provided with the template, located in the [lib folder](lib).

* [jQuery](https://jquery.com/) 2.1.4
* [Handlebars.js](http://handlebarsjs.com/) 3.0.3
* [Underscore.js](http://underscorejs.org/) 1.8.3
* [Backbone.js](http://backbonejs.org/) 1.2.1
* [Require.js](http://requirejs.org/) 2.1.18
* [webL10n i18n/l10n library](https://github.com/fabi1cazenave/webL10n/blob/master/l10n.js) commit 7d351d51b1f865fa02b447b5dd3d0965501eb35e
* [Hammer.js](http://hammerjs.github.io/) 2.0.4
* [jquery.hammer.js](https://github.com/hammerjs/jquery.hammer.js) commit 90c2f3bb41c75692d3f15548d59a7b7c22adb8a4
