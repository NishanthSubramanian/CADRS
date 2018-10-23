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
	var displayElement = document.getElementById('content');
	displayElement.innerHTML = JSON.stringify(dbpaInstance.runAlgorithm(), null, 4);
}

if ((document.readyState === 'complete') ||
	((document.readyState === 'loading') &&
		!document.documentElement.doScroll)) {
	main();
} else {
	document.addEventListener('DOMContentLoaded', main);
}
