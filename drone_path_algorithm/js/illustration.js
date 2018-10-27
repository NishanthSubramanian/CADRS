const internalDivisionOfALine = (x1y1, x2y2, m, n) => {
	var x1 = x1y1[0], y1 = x1y1[1], x2 = x2y2[0], y2 = x2y2[1];
	var x = ((m * x2) + (n * x1)) / (m + n),
	y = ((m * y2) + (n * y1)) / (m + n);
	return [x, y];
};

const getIllustrationStates = (path, distances, svgCoords, nodes) => {
	var noOfDrones = Object.keys(path).length;
	var noOfStates = 0;
	for (var drone = 0; drone < noOfDrones; drone++) {
		var drone_nodes = path[drone]['nodes'], distance = 0;
		for (var nodeNo = 1; nodeNo < drone_nodes.length; nodeNo++) {
			distance += distances[drone_nodes[nodeNo - 1]][drone_nodes[nodeNo]]
		}
		if (distance > noOfStates) {
			noOfStates = distance;
		}
	}
	// Taking into account the base states
	noOfStates += 2;
	var droneStates = { 0: {} },
	nodeList = Array.apply(null, {
		length: nodes
	}).map(Number.call, Number);
	// Add state 0
	for (var drone = 0; drone < noOfDrones; drone++) {
		var source = svgCoords[0];
		droneStates[0][drone] = {
			'type': 'based',
			'nodes': path[drone]['nodes'],
			'path': `M ${source[0]} ${source[1]} `,
		};
	}
	droneStates[0] = [droneStates[0], JSON.parse(JSON.stringify(nodeList))];
	// Add remaining states
	for (var state = 1; state < noOfStates; state++) {
		var prevState = JSON.parse(JSON.stringify(droneStates[state - 1][0])),
		thisState = {};
		for (var drone = 0; drone < noOfDrones; drone++) {
			var dronePrevState = JSON.parse(JSON.stringify(prevState[drone]));
			if (dronePrevState['type'] === 'based') {
				var source = dronePrevState['nodes'][0];
				dronePrevState['nodes'].splice(0, 1);
				if (nodeList.lastIndexOf(source) !== -1) {
					nodeList.splice(nodeList.lastIndexOf(source), 1);
				}
				if (dronePrevState['nodes'].length === 0) {
					thisState[drone] = {
						'type': 'dead',
						'path': dronePrevState['path'],
					};
				} else {
					var destination = dronePrevState['nodes'][0],
					sourceCoords = svgCoords[source],
					destinationCoords = svgCoords[destination],
					sourceDist = 1,
					destinationDist = distances[source][destination] - 1,
					nodes = dronePrevState['nodes'];
					var pathPoint = internalDivisionOfALine(
						sourceCoords, destinationCoords,
						sourceDist, destinationDist);
					var path = (dronePrevState['path'] +
						`L ${pathPoint[0]} ${pathPoint[1]} `);
					thisState[drone] = {
						'type': 'travelling',
						'source': source,
						'destination': destination,
						'sourceDist': sourceDist,
						'destinationDist': destinationDist,
						'path': path,
						'nodes': nodes,
					};
				}
			} else if (dronePrevState['type'] === 'travelling') {
				var sourceDist = dronePrevState['sourceDist'] + 1,
				destinationDist = dronePrevState['destinationDist'] - 1,
				sourceCoords = svgCoords[dronePrevState['source']],
				destinationCoords = svgCoords[dronePrevState['destination']];
				if (destinationDist === 0) {
					var pathPoint = svgCoords[dronePrevState['destination']];
					var path = (dronePrevState['path'] +
						`L ${pathPoint[0]} ${pathPoint[1]} `),
					nodes = dronePrevState['nodes'];
					thisState[drone] = {
						'type': 'based',
						'nodes': nodes,
						'path': path,
					};
				} else {
					var source = dronePrevState['source'],
					destination = dronePrevState['destination'],
					nodes = dronePrevState['nodes'];
					var pathPoint = internalDivisionOfALine(
						sourceCoords, destinationCoords,
						sourceDist, destinationDist);
					var path = (dronePrevState['path'] +
						`L ${pathPoint[0]} ${pathPoint[1]} `);
					thisState[drone] = {
						'type': 'travelling',
						'source': source,
						'destination': destination,
						'sourceDist': sourceDist,
						'destinationDist': destinationDist,
						'path': path,
						'nodes': nodes,
					};
				}
			} else if (dronePrevState['type'] === 'dead') {
				thisState[drone] = dronePrevState;
			}
		}
		droneStates[state] = [thisState, JSON.parse(JSON.stringify(nodeList))];
	}
	return [droneStates, noOfStates];
};
