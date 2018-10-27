var fetchIllustration;

const getRandomInt = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
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

const displayData = (noOfNodes, noOfDrones, distances, urgencies) => {
	var htmlHolder = `<tr><th>&#8211;</th>`;
	for (var node = 0; node < noOfNodes; node++) {
		htmlHolder += `<th>${node}</th>`;
	}
	htmlHolder += `</tr>`;
	for (var node1 = 0; node1 < noOfNodes; node1++) {
		htmlHolder += `<tr><th>${node1}</th>`;
		for (var node2 = 0; node2 < noOfNodes; node2++) {
			if (node1 !== node2) {
				htmlHolder += `<td>${distances[node1][node2]}</td>`;
			} else {
				htmlHolder += `<td>&#8211;</td>`;
			}
		}
		htmlHolder += `</tr>`;
	}
	document.getElementById('nodes-data').innerHTML = htmlHolder;
	htmlHolder = `<tr>`;
	for (var node = 0; node < noOfNodes; node++) {
		htmlHolder += `<th>${node}</th>`;
	}
	htmlHolder += `</tr>`;
	for (var node = 0; node < noOfNodes; node++) {
		htmlHolder += `<td>${urgencies[node]}</td>`;
	}
	htmlHolder += `</tr>`;
	document.getElementById('drones-data').innerHTML = htmlHolder;
};

const main = () => {
	var nodes = 9, drones = 3;
	var distArray = {}, urgArray = {};
	for (var node1 = 0; node1 < nodes; node1++) {
		distArray[node1] = {};
		for (var node2 = node1 + 1; node2 < nodes; node2++) {
			distArray[node1][node2] = getRandomInt(4, 20);
		}
		for (var node2 = 0; node2 < node1; node2++) {
			distArray[node1][node2] = distArray[node2][node1];
		}
	}
	for (var node = 0; node < nodes; node++) {
		urgArray[node] = getRandomInt(1, 100);
	}
	displayData(nodes, drones, distArray, urgArray);
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
