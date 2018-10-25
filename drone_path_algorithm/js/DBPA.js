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
		var totalNumOfPaths = (((this.nodes - 1) * this.nodes) / 2);	// n(n-1)/2
		this.avgPathLength = (totalPathLength / totalNumOfPaths);
	}
	//Cost function needs to be changed. We get negative weights currently
	_costFunction(node_1, node_2) {
		return (((this.distanceArray[node_1][node_2] /
			this.avgPathLength) * 200) - this.urgencyArray[node_2]);
	}

	_formCluster(nodeList){
		//assign weights to edge of graph
		var n=nodeList.length
		var num_clusters=this.drones
		var clusters={};
		var weights=[];	//store the weights of all edges
		for(var i=0;i<num_clusters;i++){
			clusters[i]= {'cost':0 ,'nodes':0}
		}
		for(var i=0;i<n;i++){
				weights[i]=this._costFunction(0,i)
		}
		var min;
		var node;
		for(var i=0;i<num_clusters;i++){
			min=Number.MAX_SAFE_INTEGER;
			for(var j=1;j<n;j++){
				if(weights[j]<min){
					min=weights[j]
					node=j
				}
			}
			clusters[i]['cost']=min
			clusters[i]['nodes']=node
			weights[node]=Number.MAX_SAFE_INTEGER
		}
		//console.log(weights)
		//console.log(clusters)
		return clusters
	}
	runAlgorithm() {
		var nodeList = Array.apply(null, {
			length: this.nodes
		}).map(Number.call, Number);
		nodeList.splice(0, 1);
		var starting_points=this._formCluster(nodeList);
		console.log(starting_points[0]['cost'])
		var droneCosts= {};
		for (var i = 0; i < this.drones; i++) {
			droneCosts[i] = { 'cost': 0 , 'nodes':[0,], }
			droneCosts[i]['cost']=starting_points[i]['cost']
			droneCosts[i]['nodes'].push(starting_points[i]['nodes'])
		}
		console.log(droneCosts)
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
