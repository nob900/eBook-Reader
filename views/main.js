define ([
],

function () {
	var debug = false;
	debug && console.log ('[eBook-Reader::main] Loading view');

	var View = Backbone.View.extend ({
		id: 'main',
		template: Handlebars.templates['main.html'],
		render: function () {
			var _this = this;
			$(this.el).html (this.template ());
			return (this);
		}
	});
	return (View);
});
