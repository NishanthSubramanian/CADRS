var fetchIllustration;

const createTable = (illustrations, state) => {
	var stateIllustration = illustrations[state][0];
	var tableElement = document.getElementById('state-table');
	tableElement.innerHTML = `<tr>
		<th colspan="5">State ${state}</th>
	</tr>`;
	for (var drone = 0; drone < Object.keys(stateIllustration).length; drone++) {
		var droneState = stateIllustration[drone];
		if (droneState['type'] === 'travelling') {
			tableElement.innerHTML += `<tr>
				<th id="table-drone-${drone}" rowspan="2">Drone ${drone}</th>
				<th>Source Node</th>
				<th>Destination Node</th>
				<th>Distance from Source</th>
				<th>Distance to Destination</th>
			</tr>
			<tr>
				<td id="source-${drone}">${droneState['source']}</td>
				<td id="dest-${drone}">${droneState['destination']}</td>
				<td id="s-dist-${drone}">${droneState['sourceDist']}</td>
				<td id="d-dist-${drone}">${droneState['destinationDist']}</td>
			</tr>`;
		} else if ((droneState['type'] === 'based') ||
			(droneState['type'] === 'dead')) {
			tableElement.innerHTML += `<tr>
				<th id="table-drone-${drone}" rowspan="2">Drone ${drone}</th>
				<th>Source Node</th>
				<th>Destination Node</th>
				<th>Distance from Source</th>
				<th>Distance to Destination</th>
			</tr>
			<tr>
				<td id="source-${drone}">&#8211;</td>
				<td id="dest-${drone}">&#8211;</td>
				<td id="s-dist-${drone}">&#8211;</td>
				<td id="d-dist-${drone}">&#8211;</td>
			</tr>`;
		}
	}
}

const main = () => {
	var nodes = 9, drones = 3;
	var distArray = {
		0: {
			1: 15, 2: 9,
			3: 16, 4: 4,
			5: 13, 6: 5,
			7: 9, 8: 14
		},
		1: {
			0: 15, 2: 19,
			3: 7, 4: 17,
			5: 10, 6: 5,
			7: 21, 8: 14
		},
		2: {
			0: 9, 1: 19,
			3: 16, 4: 4,
			5: 13, 6: 5,
			7: 9, 8: 14
		},
		3: {
			0: 16, 1: 7,
			2: 16, 4: 7,
			5: 16, 6: 11,
			7: 13, 8: 9
		},
		4: {
			0: 4, 1: 17,
			2: 4, 3: 7,
			5: 5, 6: 15,
			7: 19, 8: 4
		},
		5: {
			0: 13, 1: 10,
			2: 13, 3: 16,
			4: 5, 6: 12,
			7: 6, 8: 14
		},
		6: {
			0: 5, 1: 5,
			2: 5, 3: 11,
			4: 15, 5: 14,
			7: 12, 8: 11
		},
		7: {
			0: 9, 1: 21,
			2: 9, 3: 13,
			4: 19, 5: 6,
			6: 12, 8: 3
		},
		8: {
			0: 14, 1: 14,
			2: 14, 3: 9,
			4: 4, 5: 14,
			6: 11, 7: 3
		},
	}, urgArray = {
		0: 73,
		1: 23,
		2: 45,
		3: 91,
		4: 62,
		5: 39,
		6: 71,
		7: 35,
		8: 15,
	};
	var dbpaInstance = new DBPA(nodes, drones, distArray, urgArray);
	var drone_path = dbpaInstance.runAlgorithm();
	var svgNodes = {
		0: [200, 280],
		1: [340, 100],
		2: [400, 250],
		3: [380, 425],
		4: [650, 450],
		5: [575, 150],
		6: [550, 300],
		7: [800, 166],
		8: [775, 375],
	};
	Array.prototype.contains = function(obj) {
	    var i = this.length;
	    while (i--) {
	        if (this[i] == obj) {
	            return true;
	        }
	    }
	    return false;
	}
	// Begin Illustration
	illustrations = getIllustrationStates(drone_path, distArray, svgNodes, nodes);
	fetchIllustration = val => {
		var getState = illustrations[0][val];
		var getNodes = getState[1];
		var getDroneState = getState[0];
		for (var node = 0; node < nodes; node++) {
			var nodeElement = document.getElementById(`node-${node}`);
			if (getNodes.contains(node)) {
				nodeElement.setAttribute('style', 'fill: black;');
			} else {
				nodeElement.setAttribute('style', 'fill: green;');
			}
		}
		for (var drone = 0; drone < Object.keys(getDroneState).length; drone++) {
			var droneElement = document.getElementById(`drone-${drone}`);
			droneElement.setAttribute('style', `d: path("${getDroneState[drone]['path']}");`);
		}
		document.getElementById('input-value').innerHTML = `${val} / ${illustrations[1] - 1}`;
		createTable(illustrations[0], val);
	};
	var svg = document.getElementById('svg-illustration');
	for (var drone = 0; drone < drones; drone++) {
		svg.innerHTML += `<path id="drone-${drone}"></path>`;
	}
	var input = document.getElementById('state-picker');
	input.setAttribute('max', illustrations[1] - 1);
	fetchIllustration(input.value);
	createTable(illustrations[0], input.value);
};

if ((document.readyState === 'complete') ||
	((document.readyState === 'loading') &&
		!document.documentElement.doScroll)) {
	main();
} else {
	document.addEventListener('DOMContentLoaded', main);
}
