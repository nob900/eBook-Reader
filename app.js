define ([
	'lib/l10n',
	'models/currentBook'
],

function (l10n, Current) {
	var debug = false;
	var _this = this;

	var Router = Backbone.Router.extend ({
		routes: {
			'': 'library',
			'viewer': 'viewer',
			'load/*src': 'load'
		},

		library: function () {
			debug && console.log ('[eBook-Reader::router] Switching to eBook library');
			var _this = this;
			if (_this.library_view === undefined) {
				require (['views/library'], function (View) {
					_this.library_view = new View ();
					// eBook select callback
					_this.library_view.on ('select', function (selected, $elem) {
						app.currentBook.set ('file', selected);
					});
					_this.library_view.render ();
					_this.goto (_this.library_view);
				});
			}
			else {
				_this.library_view.render ();
				_this.goto (_this.library_view);
			}
		},

		viewer: function () {
			var _this = this;
			if (_this.viewer_view === undefined) {
				// No viewer created yet, create one
				_this.create_viewer ();
			}
			else {
				// Viewer already created, reuse it
				_this.viewer_view.initialize (app.currentBook.get ('file'));
				_this.goto (_this.viewer_view);
			}
		},

		load: function (src) {
			var _this = this;
			app.currentBook.set ('part', src);
			if (_this.viewer_view === undefined) {
				// No viewer created yet, create one
				_this.create_viewer (function () {
					_this.viewer_view.model.load (unescape (src));
					if (app.currentBook.get ('position')) {
						_this.viewer_view.jumpToPosition (app.currentBook.get ('position'));
					}
				});
			}
			else {
				// Viewer already created, reuse it
				_this.viewer_view.model.load (unescape (src));
			}
		},

		create_viewer: function (callback) {
			var _this = this;
			require (['views/viewer'], function (View) {
				_this.viewer_view = new View (app.currentBook.get ('file'));
				_this.viewer_view.on ('changepage', function (position) {
					app.currentBook.set ('position', position);
				});
				_this.goto (_this.viewer_view);

				// Run callback (once)
				if (callback) {
					var wrapper = function () {
						callback ();
						_this.viewer_view.model.off ('change:loading', wrapper);
					};
					_this.viewer_view.model.on ('change:loading', wrapper);
				}
			});
		},

		// Handle view transition, switch from previous view (if any) to new view then drop previous view DOM contents
		goto: function (view) {
			var previous = this.currentPage || null;
			var next = view;

			// Transition direction (forward or backward)
			var direction = app.direction ? app.direction : 'forward';

			// View switching
			if (previous) {
				previous.$el.addClass (direction + ' leave');
				setTimeout (function () {
					previous.$el.remove ();
					view.$el.removeClass (direction);
				}, 500);
				view.$el.addClass (direction);
			}
			$('body').append (view.$el.addClass ($('body').attr ('class')));
			this.currentPage = next;

			// Trigger translation on DOM change
			observer.observe (view.$el.get ()[0], { attributes: true, childList: true, characterData: true });

			// Forget current transition direction
			delete (app.direction);
		},

		back: function () {
			app.direction = 'backward';
			window.history.back ();
		}
	});

	// Trigger translation on DOM change
	var observer = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			if ((mutation.type === 'childList') && (mutation.addedNodes.length) && (document.webL10n.getReadyState () == 'complete')) {
				document.webL10n.translate ();
			}
		});
	});
	observer.observe (document.querySelector ('body'), { attributes: true, childList: true, characterData: true });

	// Restore last open book, part and position, if any and if still available
	_this.currentBook = new Current ();
	_this.currentBook.on ('change:ready', function () {
		if (_this.currentBook.get ('file') === null) {
			// No last file, show collection browser
			window.location.href = '#';
		}
		else if (_this.currentBook.get ('part') === null) {
			window.location.href = '#viewer';
		}
		else {
			window.location.href = '#load/' + _this.currentBook.get ('part');
		}

		// Create router and start history manager
		_this.router = new Router ();
		_this.back  = _this.router.back;
		Backbone.history.start ();
	});

	// Make application widely available
	window.app = this;
});
