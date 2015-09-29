define ([
],

function () {
	var debug = false;
	debug && console.log ('[eBook-Reader::libraryView] Loading view');

	Handlebars.registerHelper ('filename', function (val) {
		return (val.replace (/.*\//, ''));
	});

	Handlebars.registerHelper ('dirname', function (val) {
		return (val.replace (/[^\/]*$/, ''));
	});

	var View = Backbone.View.extend ({
		id: 'library',
		template: Handlebars.templates['library.html'],
		callbacks: {},

		initialize: function () {
			var _this = this;
			debug && console.log ('[eBook-Reader::libraryView::initialize] Entering');

			// Initialize model
			require (['models/library'], function (Model) {
				_this.model = new Model ();

				// Update view contents on model change
				_this.model.on ('change', function () {
					_this.render ();
				});
			});

			debug && console.log ('[eBook-Reader::libraryView::initialize] Leaving');
		},

		render: function () {
			var _this = this;
			debug && console.log ('[eBook-Reader::libraryView::render] Entering');

			// Library sorting function (by last modified date descending)
			var sortByDate = function (a, b) {
				if (a.lastModified < b.lastModified) return 1;
				if (a.lastModified > b.lastModified) return -1;
				return 0;
			}

			$(this.el).html (this.template ({data: ((_this.model !== undefined) ? _this.model.get ('data').sort (sortByDate) : [])}));

			// Reload button handler
			$(this.el).find ('button[data-icon=reload]').click (function () {
				$(this.el).find ('button[data-icon=reload]').attr ('disabled', true);
				_this.model.reload ();
			});

			// Handle eBook selection
			if (_this.callbacks.select !== undefined) {
				$(this.el).find ('ul.library li').click (function () {
					var selected = _this.model.get ('data')[$(this).index ()];
					_this.callbacks.select (selected, $(this));
				});
			}

			debug && console.log ('[eBook-Reader::libraryView::render] Leaving');

			return (this);
		},

		// Register callbacks
		on: function (event, callback) {
			this.callbacks[event] = callback;
		}
	});
	return (View);
});
