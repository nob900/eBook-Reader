/* --------------------------------------------------
 * The eBook model, extracts contents
 * -------------------------------------------------- */
define ([
	'lib/zip.js',
	'lib/efm.js'
],

function () {
	var debug = false;

	var Model = Backbone.Model.extend ({
		toc:      undefined,
		contents: undefined,
		loading:  false,

		initialize: function (file) {
			var _this = this;
			debug && console.log ('[eBook-Reader::eBookModel::initialize] Entering');

			// Tell zip.js where to find its accessory files
			zip.workerScriptsPath = "lib/";

			// Process eBook
			var epub = new Epub (file, function (book) {
				_this.book = book;

				// Read TOC
				_this.set ('toc', book.getContents ());

				debug && console.log ('[eBook-Reader::eBookModel::initialize] eBook TOC:');
				debug && console.dir (book.getContents ());

				_this.load (book.getContents ()[0]['src']);
			});

			debug && console.log ('[eBook-Reader::eBookModel::initialize] Leaving');
		},

		// Load given part of book
		load: function (src) {
			var _this = this;
			_this.set ('loading', true);
			_this.book.getComponent (src, function (data) {
				debug && console.log ('[eBook-Reader::eBookModel::load] Got contents');
				_this.set ('contents', data);
				_this.set ('loading', false);
			});
		}
	});
	return (Model);
});
