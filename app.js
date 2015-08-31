define ([
],

function () {
	var debug = false;

	var Router = Backbone.Router.extend ({
		routes: {
			'': 'main'
		},

		main: function () {
			debug && console.log ('[__APPNAME__::router] Switching to main');
			var _this = this;
			require (['views/main'], function (View) {
				var main = new View ();
				main.render ();
				_this.goto (main);
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

			// Forget current transition direction
			delete (app.direction);
		},

		back: function () {
			app.direction = 'backward';
			window.history.back ();
		}
	});

	// Create router and start history manager
	this.router = new Router ();
	Backbone.history.start ();

	// Make application widely available
	window.app = this;
	this.back  = this.router.back;
});
