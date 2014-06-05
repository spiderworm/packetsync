define(
	function() {

		function TimeDataPoint(timestamp,update,data) {
			this.timestamp = timestamp;
			this.update = update;
			this.data = data;
		}

		return TimeDataPoint;
	}
);