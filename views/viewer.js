define ([
	'models/ebook'
],

function (eBook) {
	var debug = false;
	debug && console.log ('[eBook-Reader::eBookView] Loading view');

	var View = Backbone.View.extend ({
		id: 'viewer',
		template: Handlebars.templates['viewer.html'],
		page: 0,

		initialize: function (file) {
			var _this = this;
			debug && console.log ('[eBook-Reader::eBookView::initialize] Entering');

			// Load model
			_this.model = new eBook (file);

			// Render TOC once loaded
			_this.model.on ('change:toc', function () {
				_this.render ();
			});

			// Update contents once loaded
			_this.model.on ('change:contents', function () {
				_this.update ();
			});

			// Toggle "loading" notice
			this.model.on ('change:loading', function () {
				if (_this.model.get ('loading') === true) {
					$(_this.el).find ('div.book-contents').empty ();
					$(_this.el).find ('p.loading').show ();
				}
				else {
					$(_this.el).find ('p.loading').hide ();
				}
			});

			_this.render ();

			debug && console.log ('[eBook-Reader::eBookView::initialize] Leaving');
		},

		render: function () {
			var _this = this;
			debug && console.log ('[eBook-Reader::eBookView::render] Entering');

			$(this.el).html (this.template ({data: ((_this.model !== undefined) ? _this.model.get ('toc') : [])}));

			// Set column width from viewer dimentions
			$(this.el).find ('div.book-contents').css ({
				'-moz-column-width': $(this.el).find ('section.view[data-type="viewer"]').width (),
				'column-width': $(this.el).find ('section.view[data-type="viewer"]').width ()
			});

			// Handle page change on contents tap/click
			$(this.el).find ('div.book-contents').hammer ().on ('tap', function (evt) {
				if (evt.gesture.pointers[0].pageX < ($(_this.el).width () / 2)) {
					_this.changePage ('previous');
				}
				else {
					_this.changePage ('next');
				}
			});

			// Handle "pandown" event showing book TOC and back button
			$(this.el).find ('div.book-contents').on ('touchstart', function () { return (false); })
			var direction = undefined;
			$(this.el).find ('div.book-contents').hammer ().on ('pandown', function (evt) {
				direction = evt.type;
			});
			$(this.el).find ('div.book-contents').hammer ().on ('panend', function () {
				if (direction === 'pandown') {
					$(_this.el).find ('div.viewer-controls').slideDown ();
					direction = undefined;
				}
			});
			// Hide TOC when item is selected
			$(this.el).find ('ul.toc li a').click (function () {
				$(_this.el).find ('div.viewer-controls').slideUp ();
			});

			debug && console.log ('[eBook-Reader::eBookView::render] Leaving');

			return (this);
		},

		// Update contents when 'contents' field changes
		update: function () {
			var _this = this;
			debug && console.log ('[eBook-Reader::eBookView::update] Entering');

			// Insert book contents into viewer
			$(this.el).find ('div.book-contents').empty ().append (this.model.get ('contents'));

			// Show beginning of section
			_this.page = 0;
			$(this.el).find ('div.book-contents').css ({left: 0});

			// Hide viewer controls
			$(this.el).find ('div.viewer-controls').slideUp ();

			debug && console.log ('[eBook-Reader::eBookView::update] Leaving');
		},

		// Go to next or previous page
		changePage: function (direction) {
			debug && console.log ('[eBook-Reader::eBookView::changePage] Going to ' + direction + ' page');
			switch (direction) {
				case 'previous':
					if (this.page > 0) {
						this.page--;
					}
					break;
				case 'next':
					this.page++;
					break;
			}
			var position = - this.page * ($(this.el).find ('div.book-contents-container').width () + 20);
			debug && console.log ('[eBook-Reader::eBookView::changePage] Scroll to page ' + this.page + ', position: ' + position);
			$(this.el).find ('div.book-contents').css ({left: position});
		}
	});
	return (View);
});
