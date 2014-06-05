define(
	function() {

		function clone(source) {
			var result = source;
			if(source && typeof source === "object") {
				result = {};
				for(var i in source) {
					result[i] = clone(source[i]);
				}
			}
			return result;
		}

		return clone;

	}
);