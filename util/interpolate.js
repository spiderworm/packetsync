define(
	function() {

		function interpolate(dataA,dataB,percentage) {
			var dataAB = dataA;
			if(dataA && typeof dataA === "object") {
				dataAB = {};
				for(var i in dataA) {
					if(dataB && dataB.hasOwnProperty && dataB.hasOwnProperty(i)) {
						dataAB[i] = interpolate(dataA[i],dataB[i],percentage);
					} else {
						dataAB[i] = dataA[i];
					}
				}
			} else if(typeof dataA === "number" && typeof dataB === "number") {
				dataAB = dataA + percentage * (dataB - dataA);
			}
			return dataAB;
		}

		return interpolate;

	}
);