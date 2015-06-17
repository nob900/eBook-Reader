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
			require (['views/main'], function (View) {
				var main = new View ({
					el: $('body')
				});
				main.render ();
			});
		}
	});

	// Create router and start history manager
	this.router = new Router ();
	Backbone.history.start ();
});
