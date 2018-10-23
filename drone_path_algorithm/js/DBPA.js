const DBPA = class {
	constructor(nodes, drones, distanceArray, urgencyArray) {
		this.nodes = nodes;
		this.drones = drones;
		this.distanceArray = distanceArray;
		this.urgencyArray = urgencyArray;
		this._calculateAvgPathLength();
	}
	_calculateAvgPathLength() {
		var totalPathLength = 0;
		for (var i = 0; i < this.nodes; i++) {
			for (var j = (i + 1); j < this.nodes; j++) {
				totalPathLength += this.distanceArray[i][j];
			}
		}
		var totalNumOfPaths = (((this.nodes - 1) * this.nodes) / 2);
		this.avgPathLength = (totalPathLength / totalNumOfPaths);
	}
	_costFunction(node_1, node_2) {
		return (((this.distanceArray[node_1][node_2] /
			this.avgPathLength) * 200) - this.urgencyArray[node_2]);
	}
	runAlgorithm() {
		var nodeList = Array.apply(null, {
			length: this.nodes
		}).map(Number.call, Number);
		nodeList.splice(0, 1);
		var droneCosts= {};
		for (var i = 0; i < this.drones; i++) {
			droneCosts[i] = { 'cost': 0 , 'nodes':[0,], }
		}
		while (nodeList) {
			var smallest = [null, null, Number.MAX_SAFE_INTEGER];
			var tempCost;
			for (var n = 0; n < nodeList.length; n++) {
				for (var d = 0; d < this.drones; d++) {
					tempCost = droneCosts[d]['cost'] + this._costFunction(
						droneCosts[d]['nodes'][droneCosts[d]['nodes'].length - 1],
						nodeList[n]);
					if (tempCost < smallest[2]) {
						smallest = [d, nodeList[n], tempCost];
					}
				}
			}
			if (smallest[1]) {
				droneCosts[smallest[0]]['cost'] += smallest[2];
				droneCosts[smallest[0]]['nodes'].push(smallest[1]);
				nodeList.splice(nodeList.lastIndexOf(smallest[1]), 1);
			} else {
				break;
			}
		}
		return droneCosts;
	}
};
