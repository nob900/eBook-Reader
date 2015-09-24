/* --------------------------------------------------
 * The Library model, loads SD card contents
 * -------------------------------------------------- */
define ([
],

function () {
	var debug = false;

	var Model = Backbone.Model.extend ({
		data: [],

		initialize: function () {
			debug && console.log ('[eBook-Reader::libraryModel::initialize] Entering');

			this.sdcard = navigator.getDeviceStorage ('sdcard');

			this.reload ();

			debug && console.log ('[eBook-Reader::libraryModel::initialize] Leaving');
		},

		reload: function () {
			var _this = this;
			debug && console.log ('[eBook-Reader::libraryModel::reload] Entering');

			_this.set ('data', []);

			// Browse SD card contents
			var files = [];
			var cursor = _this.sdcard.enumerate ();
			cursor.onsuccess = function () {
				var file = this.result;

				// Only consider files having a ".epub" extension
				if (file && file.name.match (/\.epub$/)) {
					debug && console.log ('[eBook-Reader::libraryModel::reload] Found file: ' + file.name);
					files.push (file);
				}

				// Loop if remaing elements
				if (!this.done) {
					this.continue ();
				}
				else {
					// No more file, store data into model
					_this.set ('data', files);

					debug && console.log ('[eBook-Reader::libraryModel::reload] Leaving, SD card data:');
					debug && console.dir (_this.get ('data'));
				}
			}
			cursor.onerror = function () {
				console.warn ('No file found:');
				console.dir (this.error);
				_this.set ('data', []);
			}
		}
	});
	return (Model);
});
