const http = require('http');
const url = require('url');

function calculateTotalCostForOrders(orderSequence) {                   //main function call

		function calcCost(weight, distance) {calculateTotalCostForOrders
		  weight = (weight == 0) ? 0.1 : weight;
		  return (10 + (Math.ceil(weight / 5) - 1) *8) * distance;
		}

		function centersWithWeight(productOrders) {
		  productOrders = productOrders.toUpperCase();
		  var centers = [];
		  let c, a = 'A'.charCodeAt(0), cn, prev = {}; 
		  let costs = [3,2,8,12,25,15,500,1,2];
		  for(let len = productOrders.length, i = 0; i < len; ++i) {
			  c = productOrders.charCodeAt(i) - a;
			  if (c < 0 || c >= costs.length)
			continue;
			  cn = Math.floor(c / 3);
			  if (prev.center == cn) {
				 prev.weight += costs[c];
			  } else {
				 prev = {
					center: cn,
					weight: costs[c],
					cost: -1,
					index: 0
				 };
				 centers.push(prev);
			  }
		  }
		  return centers;
		}

		function getCostFromTo(from, to){
			let distanceMatrix = [
			 [0, 4, -1, 3],
			 [4, 0, 3, 2.5],
			 [-1, 3, 0, 2],
			 [3, 2.5, 2, 0],
			];
			if (!to || from.center == to.center)
				return from;
			let dis = distanceMatrix[from.center][to.center];
			if (dis < 0)
				return from;
			let cost = calcCost(from.weight, dis),
				weight = to.center == 3 ? 0 : (to.weight + from.weight),
				ind = from.center == 3 ? from.index : ++from.index;
				
			return {
				center: to.center,
				weight: weight,
				cost: cost,
				index: ind
			}
		}


  centersWithWeight = centersWithWeight(orderSequence);
  let totalCost = 0;
  var dest =  {
	center: 3,
	weight: 0,
	cost: 0,
	index: 0
  };
  for(let i = 0, len = centersWithWeight.length; i < len; ++i) {
     let fr031 = getCostFromTo(getCostFromTo(centersWithWeight[i], dest), centersWithWeight[i + 1]),
		 fr01 = getCostFromTo(centersWithWeight[i], centersWithWeight[i + 1]),
		 fr031323 = getCostFromTo(getCostFromTo(getCostFromTo(fr031, dest), centersWithWeight[i + 2]),dest),
		 fr03123 = getCostFromTo(getCostFromTo(fr031, centersWithWeight[i + 2]), dest),
		 fr01323 = getCostFromTo(getCostFromTo(getCostFromTo(fr01, dest), centersWithWeight[i + 2]), dest),
		 fr0123 = getCostFromTo(getCostFromTo(fr01, centersWithWeight[i + 2]), dest);
	 let arr = [fr031323, fr03123, fr01323, fr0123], val = fr031323;
	 arr.forEach(function(o){
		if(val.cost > o.cost)
			val = o;
	 });
	 totalCost += val.cost;
	 i += val.index;
  }
  console.log(totalCost);
}

const server = http.createServer((request, response) => {
    // this is the request url
    let request_url = request.url;

    if(request.method === 'GET' && request_url === '/form') {
        const current_url = new URL(request_url);
        const search_params = current_url.searchParams;
        
        if(search_params.has('ordersequence'))
            calculateTotalCostForOrders(search_params.get('ordersequence'));
    }
});

server.listen(8080);