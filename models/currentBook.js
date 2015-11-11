/* --------------------------------------------------
 * The current book
 * -------------------------------------------------- */
define ([
],

function () {
	var debug = false;

	var Model = Backbone.Model.extend ({
		ready: false,
		file:  undefined,
		part:  undefined,
		position:  undefined,

		initialize: function () {
			var _this = this;
			debug && console.log ('[eBook-Reader::currentBook::initialize] Entering');

			// Store file path to local storage
			this.on ('change:file', function () {
				if (this.get ('ready')) {
					if (this.get ('file') && this.get ('file').name) {
						debug && console.log ('[eBook-Reader::currentBook] Saving file name to localStorage: ' + this.get ('file').name);
						localStorage.setItem ('file', this.get ('file').name);
						this.set ('part', null);
					}
				}
			});

			// Store eBook part to local storage
			this.on ('change:part', function () {
				if (this.get ('ready')) {
					debug && console.log ('[eBook-Reader::currentBook] Updating part to localStorage: ' + this.get ('part'));
					if (this.get ('part')) {
						localStorage.setItem ('part', this.get ('part'));
					}
					else {
						localStorage.removeItem ('part');
					}
					this.set ('position', null);
				}
			});

			// Store current position (aka page) to local storage
			this.on ('change:position', function () {
				if (this.get ('ready')) {
					debug && console.log ('[eBook-Reader::currentBook] Updating position to localStorage: ' + this.get ('position'));
					if (this.get ('position')) {
						localStorage.setItem ('position', this.get ('position'));
					}
					else {
						localStorage.removeItem ('position');
					}
				}
			});

			// Get last part and position references, if any
			this.set ('part', localStorage.getItem ('part'));
			this.set ('position', localStorage.getItem ('position'));

			// Load last opened book reference, if any
			if (localStorage.getItem ('file')) {
				var path = localStorage.getItem ('file');
				var sdcard = navigator.getDeviceStorage ('sdcard');
				var request = sdcard.get (path);
				request.onsuccess = function () {
					debug && console.log ('[eBook-Reader::currentBook::initialize] Got file: ');
					debug && console.dir (this.result);
					_this.set ('file', this.result);
					_this.set ('ready', true);
				};
				request.onerror = function () {
					_this.set ('file', null);
					_this.set ('ready', true);
				};
			}
			else {
				_this.set ('file', null);
				// Delay status update otherwise 'change:ready' event won't get caught
				setTimeout (function () {
					_this.set ('ready', true);
				}, 1000);
			}

			debug && console.log ('[eBook-Reader::currentBook::initialize] Leaving');
		},

		set: function (attr, value) {
			Backbone.Model.prototype.set.call (this, attr, value);
			if (attr === 'file') {
				// Manually trigger "change" event as File object doesn't change itself, only underlying keys change, which Backbone can't detect
				this.trigger ('change:file', this);
			}
		}
	});
	return (Model);
});
