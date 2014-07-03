define(
	[
		'./TimeDataPoint.js',
		'./util/clone.js',
		'./util/interpolate.js'
	],
	function(
		TimeDataPoint,
		clone,
		interpolate
	) {

		function TimeDataStore(startMS,startData) {
			this._startMS = startMS;
			this._dataPoints = [];
			this.addUpdate(startMS,startData);
		}
		TimeDataStore.prototype.addUpdate = function(timestamp,update) {
			var i = 0;
			for(var j=this._dataPoints.length-1; j>=0; j--) {
				if(this._dataPoints[j].timestamp <= timestamp) {
					i = j+1;
					break;
				}
			}
			var point = new TimeDataPoint(timestamp,update,{});
			this.__insertDataPoint(i,point);
		}
		TimeDataStore.prototype.getDataAt = function(timestamp) {
			var points = this.__findDataPoints(timestamp);
			if(points.previous) {
				if(!points.next || points.next === points.previous) {
					return clone(points.previous.data);
				}
				var point = this.__interpolate(points.previous,points.next,timestamp);
				return point.data;
			}
			return null;
		}
		TimeDataStore.prototype.__insertDataPoint = function(i,timeDataPoint) {
			this._dataPoints.splice(i,0,timeDataPoint);
			for(var j=i; j<this._dataPoints.length; j++) {
				var data = this._dataPoints[j-1] ? this._dataPoints[j-1].data : {};
				this._dataPoints[j].data = applyUpdate(data,this._dataPoints[j].update);
			}
			while(this._dataPoints.length > 500) {
				this._dataPoints.shift();
			}
		}
		TimeDataStore.prototype.__findDataPoints = function(timestamp) {
			var result = {previous: null, next: null};
			for(var i=this._dataPoints.length-1; i>=0; i--) {
				if(this._dataPoints[i].timestamp === timestamp) {
					result.previous = result.next = this._dataPoints[i];
					break;
				} else if(this._dataPoints[i].timestamp < timestamp) {
					result.previous = this._dataPoints[i];
					if(this._dataPoints[i+1]) {
						result.next = this._dataPoints[i+1];
					}
					break;
				}
			}
			return result;
		}
		TimeDataStore.prototype.__interpolate = function(pointA,pointB,timestamp) {
			var result = new TimeDataPoint(timestamp);
			var percentage = (timestamp - pointA.timestamp) / (pointB.timestamp - pointA.timestamp);
			result.data = interpolate(pointA.data,pointB.data,percentage);
			return result;
		}








		function applyUpdate(data,update) {
			
			function handle(data,update) {

				for(var i in update) {
					switch(i) {
						case "@push":
							if(!data.__pushed) {
								data.__pushed = {};
							}
							if(!data.__pushed[update[i]]) {
								data.__pushed[update[i]] = [];
							}
							data.__pushed[update[i]].unshift(data[update[i]]);
							data[update[i]] = undefined;
						break;
						case "@pop":
							if(!data.__pushed) {
								data.__pushed = {};
							}
							if(!data.__pushed[update[i]]) {
								data.__pushed[update[i]] = [];
							}
							var result = data.__pushed[update[i]].shift();
							data[update[i]] = result;
						break;
						case "@clear":
							if(!data.__pushed) {
								data.__pushed = {};
							}
							if(!data.__pushed[update[i]]) {
								data.__pushed[update[i]] = [];
							}
							while(data.__pushed[update[i]][0]) {
								data.__pushed[update[i]].shift();
							}
							data[update[i]] = undefined;
						break;
						case "@remove":
							data[update[i]] = undefined;
						break;
						default:
							if(update[i] && typeof update[i] === "object") {
								if(typeof data[i] !== "object") {
									data[i] = {};
								}
								handle(data[i],update[i]);
							} else {
								data[i] = update[i];
							}
						break;
					}
				}

			}

			var result = clone(data);

			handle(result,update);

			return result;

		}


		return TimeDataStore;

	}
);