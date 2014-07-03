define(
	['./EventObject.js'],
	function(EventObject) {

		window.timelines = [];

		function Timeline(id,timeDataStore,currentMS) {
			EventObject.apply(this);
			this.id = id;
			this._timeDataStore = timeDataStore;
			this._currentMS = currentMS;
			this._lastTickMS = (new Date()).getTime();
			this._currentData = null;
			this._playSpeed = 1;

			var sync = this;
			function tick() {
				sync._tick();
				requestAnimationFrame(tick);
			}
			requestAnimationFrame(tick);
		}
		Timeline.prototype = new EventObject();
		Timeline.PLAYING = 'playing';
		Timeline.prototype.play = function() {
			this._playSpeed = 1;
			this._state = Timeline.PLAYING;
			this._lastTickMS = (new Date()).getTime();
		}
		Timeline.prototype.pause = function() {
			this._state = Timeline.PAUSED;
		}
		Timeline.prototype.playAt = function(ms) {
			this._currentMS = ms;
			this.play();
		}
		Timeline.prototype.setPlaySpeed = function(speed) {
			this._playSpeed = speed;
		}
		Timeline.prototype.onNewData = function(callback) {
			return this._on('new-data',callback);
		}
		Timeline.prototype._tick = function() {
			if(this._state === Timeline.PLAYING) {
				var ms = (new Date()).getTime();
				var msdelta = ms - this._lastTickMS;
				this._lastTickMS = ms;
				this._currentMS += this._playSpeed * msdelta;

				this._currentData = this._timeDataStore.getDataAt(this._currentMS);

				this._fire('new-data',[this._currentData]);
			}
		}

		return Timeline;

	}
);