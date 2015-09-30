define ([
	'models/ebook'
],

function (eBook) {
	var debug = false;
	debug && console.log ('[eBook-Reader::eBookView] Loading view');

	Handlebars.registerHelper ('escape', function (val) {
		return (escape (val));
	});

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

			// Jump to part on anchor change
			_this.model.on ('change:anchor', function () {
				_this.jumpTo (_this.model.get ('anchor'));
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

			// Jump to anchor
			_this.jumpTo (_this.model.get ('anchor'));

			// Hide viewer controls
			$(this.el).find ('div.viewer-controls').slideUp ();

			debug && console.log ('[eBook-Reader::eBookView::update] Leaving');
		},

		// Go to next or previous page
		changePage: function (direction) {
			debug && console.log ('[eBook-Reader::eBookView::changePage] Going to ' + direction + ' page');

			// Current position (absolute value)
			var current = Math.abs (parseInt ($(this.el).find ('div.book-contents').css ('left').replace (/px/, ''), 10));

			// Page width
			var width = $(this.el).find ('div.book-contents-container').width ()
						+ parseInt ($(this.el).find ('div.book-contents').css ('column-gap').replace (/px/, ''), 10);

			// Set absolute value for new position (will be negated later)
			var position = current;
			switch (direction) {
				case 'previous':
					if (current >= width) {
						position -= width;
					}
					break;
				case 'next':
					position += width;	// TODO handle end of stream
					break;
			}
			debug && console.log ('[eBook-Reader::eBookView::changePage] Scroll to page position: ' + position + ' (offset: ' + width + ')');
			$(this.el).find ('div.book-contents').css ({left: -position});
		},

		// Jump to given anchor in current contents
		jumpTo: function (anchor) {
			debug && console.log ('[eBook-Reader::eBookView::jumpTo] Jumping to anchor: ' + anchor);

			var position = 0;
			if (anchor !== undefined) {
				// Set absolute value for anchor position (will be negated later)
				position = $(this.el).find ('div.book-contents #' + anchor).position ()['left'] + parseInt ($(this.el).find ('div.book-contents').css ('column-gap').replace (/px/, ''), 10);
				debug && console.log ('[eBook-Reader::eBookView::jumpTo] Anchor position: ' + position);
			}

			$(this.el).find ('div.book-contents').css ('left', -position);
		}
	});
	return (View);
});
