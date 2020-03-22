const svg = d3.select('svg');

const height = +svg.attr('height');
const width = +svg.attr('width');

const render = data => {
  const margin = {top: 40, right: 40, bottom: 40, left: 40};
  const pltMargin = {top: 120, right: 30, bottom: 60, left: 100};
  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.left - margin.right;
  const numSquares = Object.keys(data).length - 1;
  const nEach = 11; // number of squares on each side of board
  const squareExt = 30; // square extension length
  const titleXAdjust = -50;
  const lineDescripts = ['No houses', '1 house', '2 houses', '3 houses',
	'4 houses', '4 houses and 1 hotel'];
  
  const xValue = d => [10,9,8,7,6,5,4,3,2,1,
    0,0,0,0,0,0,0,0,0,0,
    0,1,2,3,4,5,6,7,8,9,
    10,10,10,10,10,10,10,10,10,10][d.Square];
  
  const yValue = d => [10,10,10,10,10,10,10,10,10,10,
    10,9,8,7,6,5,4,3,2,1,
    0,0,0,0,0,0,0,0,0,0,
    0,1,2,3,4,5,6,7,8,9][d.Square];

  const xScale = d3.scaleLinear()
  .domain([0, 10])
  .range([0, (10/11)*innerWidth]);
  
  const yScale = d3.scaleLinear()
  .domain([0, 10])
  .range([0, (10/11)*innerHeight]);
  
  const g = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top}) rotate(0, 0, 0)`);

  // data joining and appending rects
  g.selectAll('.sqClass').data(data)
  .enter().append('g')
    .classed('sqClass', true)
    .attr('id', d => 'sq'+d.Square)
    .each(function(d) {
      let w = 0;
      if ([0,10,20,30].includes(+d.Square)) {
        w = innerWidth / nEach + squareExt;
      } else{
        w = innerWidth / nEach;
      };
      d3.select(`g#sq${d.Square}`)
        .append('rect')
          .attr('fill', 'white')
          .attr('stroke', 'black')
          .attr('stroke-width', 1)
          .attr('width', w)
          .attr('height', innerHeight / nEach + squareExt);
    });
  
  // translating the sqClass groups to their correct positions, and rotating them
  function transformSqClass(d, i) {
    switch (xValue(d)) {
      case 0: rotAngle = 90; break;
      case 10: rotAngle = -90; break;
    };
    switch (yValue(d)) {
      case 0: rotAngle = 180; break;
      case 10: rotAngle = 0; break;
    };
    if ([0,10,20,30].includes(+d.Square)){
      rotAngle = +d.Square/10*90;
    };
    d3.select(this)
      .attr('transform', `translate(${xScale(xValue(d))}, 
        ${yScale(yValue(d))}) rotate(${rotAngle}, ${innerWidth/2/nEach}, ${innerHeight/2/nEach})`);
  };
  g.selectAll('.sqClass')
    .each(transformSqClass);

  // initialize the names (text) of the squares
  g.selectAll('.sqClass').each(function(d) {
    let fweight = 400;
    let fsize = '0.6em'
    if ([0,10,20,30].includes(+d.Square)){
      fweight = 800;
      fsize = '0.7em'
    };
    d3.select(this)
      .append('text')
      .attr('id', `txt${d.Square}`)
      .attr('class', 'txtClass')
      .attr('text-anchor', 'middle')
      .attr('font-family', 'sans-serif')
      .style('font-size', fsize)
      .style('font-weight', fweight)
      .attr('x', innerWidth/nEach/2)
      .attr('y', innerHeight/nEach/3);
  });
  let text = g.selectAll('.txtClass');
  text.selectAll('tspan')
    .data(d => {
      let result = [];
      let words = d['Name 3'].split(' ');
      if (d['Name 3'].length > 12) {
        result[0] = words.slice(0,2).join(' ');
        result[1] = words.slice(2).join(' ');
      }else {result[0] = words.join(' ')};
      return result;
    })
    .enter()
    .append('tspan')
    .text(d => d)
    .attr('x', innerWidth/nEach/2)
    .attr('dx', 0)
    .attr('dy', 10)

  // show the names (text) of the squares on MOUSEOVER
  // g.selectAll('.sqClass')
  //   .on('mouseover', function(d, i) {
  //     g.select(`#txt${d.Square}`)
  //       .transition().duration(100)
  //       .style('font-size', '0.6em')
  //   })
  //   .on('mouseout', function(d, i) {
  //     g.select(`#txt${d.Square}`)
  //       .transition().duration(100)
  //       .style('font-size', '0em')
  //   });

  // add the color rects of the property groups
  function addPropertyColor(d, i) {
    colorDict = {'Brown (Dark Purple)': 'indigo', 'Light Blue': 'skyblue',
      'Pink': 'pink', 'Orange': 'orange', 'Red': 'red', 'Yellow': 'yellow',
      'Green': 'green', 'Dark Blue': 'darkblue'};
    if (d.Color != "") {
      d3.select(this).append('rect')
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
        .attr('width', innerWidth / nEach)
        .attr('height', innerHeight / nEach / 4)
        .attr('fill', colorDict[d.Color]);
    }
  };
  g.selectAll('.sqClass')
    .each(addPropertyColor);

  // rotate whole board on CLICK
  const rotateButtonSize = 50;
  svg.append('g')
    .classed('gRotateButton', true)
    .attr('transform', `translate(${width-rotateButtonSize/2}, ${height-rotateButtonSize/2})`)
      .on('click', () => {
        let boardRotate = +g.attr('transform').split('rotate')[1].split(',')[0].slice(1)%360;
        boardRotate = Math.round(boardRotate/90)*90;
        console.log(boardRotate);
        g.transition().duration(200)
          .attrTween('transform', function(){
            return d3.interpolateString(`translate(${margin.left}, ${margin.right}) rotate(${boardRotate}, ${innerWidth/2}, ${innerHeight/2})`,
              `translate(${margin.left}, ${margin.right}) rotate(${+boardRotate+90}, ${innerWidth/2}, ${innerHeight/2})`)
          });
        }
      )
      .append('image')
      .attr('href', 'rotate.svg')
      .attr('height', rotateButtonSize)
      .attr('width', rotateButtonSize)
      .attr('x', -rotateButtonSize/2)
      .attr('y', -rotateButtonSize/2);
  
  // function for plotting probability of landing
  function plotProb(dataApi) {
    function getProbMinMax(dataApi) {
      probArr = [...Array(40).keys()].map(x => +dataApi[x].p_landings).sort((a,b) => a-b);
      return [probArr[0], probArr.slice(-1)];
    }
    let xTransl = (width - innerWidth)/2 + innerWidth/nEach + pltMargin.left;
    let yTransl = (height - innerHeight)/2 + innerHeight/nEach + pltMargin.top;
    let plotWidth = (innerWidth - innerWidth/nEach*2)/2 - pltMargin.left - pltMargin.right;
    let plotHeight = (innerHeight - innerHeight/nEach*2) - pltMargin.top - pltMargin.bottom;
    let barWidth = 10;
    let minProb = getProbMinMax(dataApi)[0];
    let maxProb = getProbMinMax(dataApi)[1];
    let sqArr = [...Array(40).keys()];
    
    svg.append('g')
      .classed('gPlotProb', true)
      .attr('transform', `translate(${xTransl}, ${yTransl})`);

    // write header text
    d3.select('.gPlotProb')
      .append('text')
      .text('Probabilities of landing')
      .style('font-family', 'sans-serif')
      .style('font-size', '1em')
      .style('font-weight', 700)
      .attr('x', titleXAdjust)
      .attr('y', -50);
    
    let xScale = d3.scaleLinear()
      .domain([0, maxProb])
      .range([0, plotWidth]);
    let yScale = d3.scaleBand()
      .domain(sqArr)
      .range([0, plotHeight]);
      
    // plot bar chart  
    d3.select('.gPlotProb').selectAll('.probBar')
      .data(dataApi)
      .enter()
      .append('rect')
        .classed('probBar', true)
        .attr('id', d => 'bar'+d.ID)
        .attr('y', d => yScale(+d.ID))
        .attr('height', barWidth)
        .attr('width', d => xScale(+d.p_landings))
      .attr('fill', '#4682b4')
      
    // write id of square beside bars
    d3.selectAll('.probBar')
      .each(function(d) {
        d3.select('.gPlotProb')
          .append('text')
          .text(data[+d.ID]['Name 3'])
          .attr('text-anchor', 'end')
          .attr('x', -3)
          .attr('y', yScale(+d.ID) + 8)
          .style('font-family', 'sans-serif')
          .style('font-size', '0.45em')
      });
      
    // react when mouseover squares
    function mouseOverG(d) {
      numStr = '#bar'+d.Square;
      d3.select(numStr)
        .attr('fill', 'orange');
    };
    function mouseOutG(d) {
      numStr = '#bar'+d.Square;
      d3.select(numStr)
        .attr('fill', '#4682b4');
    };
    d3.selectAll('.sqClass')
      .on('mouseover', mouseOverG)
      .on('mouseout', mouseOutG);
      
    // react when mouseover plot
    function mouseOverPlot(d) {
      function getColor(num) {
      myColor = d3.scaleSequential().domain([probArr[1], maxProb])
        .interpolator(d3.interpolateBuGn);
      let prob = dataApi[num].p_landings;
      let scaleFactor = .8;
      return myColor(prob**scaleFactor*maxProb**(1-scaleFactor)); // note: using non linear scale to emphasize diff
      }
      d3.select('#sq'+d.ID)
        .append('circle')
        .attr('r', 20)
        .attr('stroke', 'black')
        .attr('cx', innerHeight/nEach/2)
        .attr('cy', innerHeight/nEach/1)
        .attr('fill', 'orange');
      d3.select('#bar'+d.ID)
        .attr('fill', 'orange');
      d3.selectAll('g.sqClass')
        .select('rect')
        .attr('fill', d => getColor(+d.Square));
    };
    function mouseOutPlot(d) {
      d3.select('#sq'+d.ID)
        .select('circle')
        .remove();
      d3.select('#bar'+d.ID)
        .attr('fill', '#4682b4');
      d3.selectAll('g.sqClass')
      .select('rect')
        .attr('fill', 'white');
    };
    d3.selectAll('.probBar')
      .on('mouseover', mouseOverPlot)
      .on('mouseout', mouseOutPlot);
	
  };

  // function for plotting rent to cost ratio
  function plotRatio(dataApi) {
    let xTransl = (width - innerWidth)/2 + innerWidth/2 + pltMargin.left;
    let yTransl = (height - innerHeight)/2 + innerHeight/nEach + pltMargin.top;
    let plotWidth = (innerWidth - innerWidth/nEach*2)/2 - pltMargin.left - pltMargin.right;
    let plotHeight = (innerHeight - innerHeight/nEach*2) - pltMargin.top - pltMargin.bottom;
    let sqArr = [...Array(40).keys()].filter(x => data[x].Type == 'Property');
    let ratioArr = []; // (nhouses x nsquares) 
    let minRatio = Infinity;
    let maxRatio = -Infinity;
    for (let i = 0; i < 6; i++) {
      rentCost = sqArr.map(x => dataApi[x].expected_rent[i] / dataApi[x].expected_cost[i]);
      if (Math.min(...rentCost) < minRatio) {
        minRatio = Math.min(...rentCost);
      };
      if (Math.max(...rentCost) > maxRatio) {
        maxRatio = Math.max(...rentCost)
      };
      ratioArr.push(rentCost);
    };
    
    svg.append('g')
      .classed('gPlotRatio', true)
      .attr('transform', `translate(${xTransl}, ${yTransl})`);

    // write header text
    d3.select('.gPlotRatio')
      .append('text')
      .text('Rent-cost ratio (streets)')
      .style('font-family', 'sans-serif')
      .style('font-size', '1em')
      .style('font-weight', 700)
      .attr('x', titleXAdjust)
      .attr('y', -50);

    let xScale = d3.scaleLinear()
      .domain([minRatio, maxRatio])
      .range([0, plotWidth]);
    let yScale = d3.scaleBand()
      .domain(sqArr)
      .range([0, plotHeight]);

    // plot line chart
    let line = d3.line()
      .x(function(d, i){
        return xScale(d.value);
      })
      .y(function(d, i){
        return yScale(sqArr[i]);
      });
    for (let i = 0; i < 6; i++) {
      let dataset = ratioArr[i].map(function(x){return {'i': i, 'value': x}});
      d3.select('.gPlotRatio').append('path')
        .datum(dataset)
        .classed(`line${i}`, true)
        .attr("d", line)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 2.4);
    };

    // Create an axis component with d3.axisBottom
    d3.select('.gPlotRatio').append("g")
      .attr("class", "xAxis")
      .attr("transform", `translate(0,${plotHeight*0.98})`)
      .call(d3.axisBottom(xScale));

    // write id of rows
    d3.select('.gPlotRatio').selectAll('.rowTxt')
      .data(sqArr.map(function(x){return {'value': x}}))
      .enter()
      .append('text')
        .classed('rowTxt', true)
        .attr('id', d => 'rowTxt'+d.value)
        .text(d => data[d.value]['Name 3'])
        .attr('text-anchor', 'end')
        .attr('x', -10)
        .attr('y', d => yScale(+d.value) + 3)
        .style('font-family', 'sans-serif')
        .style('font-size', '0.45em');

    // react when mouseover squares (change id style)
    function mouseOverG(d) {
      numStr = '#rowTxt'+d.Square;
      d3.select(numStr)
        .style('fill', 'orange')
        .style('font-weight', 700)
        .style('font-size', '0.9em');
      numStr = '#bar'+d.Square;
      d3.select(numStr)
        .attr('fill', 'orange');
    };
    function mouseOutG(d) {
      numStr = '#rowTxt'+d.Square;
      d3.select(numStr)
        .style('fill', 'black')
        .style('font-weight', 400)
        .style('font-size', '0.45em');
      numStr = '#bar'+d.Square;
      d3.select(numStr)
        .attr('fill', '#4682b4');
    };
    for (let i = 0; i < sqArr.length; i++) {
      d3.select('#sq'+sqArr[i])
        .on('mouseover', mouseOverG)
        .on('mouseout', mouseOutG);
    };
	
	// react when mouseover lines
	function mouseOverLine(d) {
	  num = '.line'+d[0].i;
	  d3.select(num)
	    .attr('stroke', 'orange');
	  d3.selectAll('.lineDescrip')
	    .remove();
	  d3.select('.gPlotRatio')
        .append('text')
		.classed('lineDescrip', true)
        .text(lineDescripts[d[0].i])
        .style('font-family', 'sans-serif')
        .style('font-size', '1em')
        .style('font-weight', 700)
		.style('fill', 'orange')
        .attr('x', titleXAdjust)
        .attr('y', -25);
	};
	function mouseOutLine(d) {
	  num = '.line'+d[0].i;
	  d3.select(num)
		.transition().duration(500)
	    .attr('stroke', 'steelblue');
	  d3.selectAll('.lineDescrip')
	    .transition().duration(500)
		.style('font-size', '0em')
	    .remove();
	};
	for (let i=0; i<6; i++) {
	  d3.select('.line'+i)
	    .on('mouseover', mouseOverLine)
		.on('mouseout', mouseOutLine);
	};
  };

  // fetch data from API, then do some stuff with the data
  fetch('https://cors-anywhere.herokuapp.com/https://monopoly-nus.appspot.com/api/basic/strategy/3')
    .then(response => {
	  let data_api = response.json();
	  return data_api;
	})
	.then(data_api => {
	  console.log(data_api.locations);
    plotProb(data_api.locations);
    plotRatio(data_api.locations);
	});
};

// render the chart
d3.csv('mpy_csv.csv').then(data => {
  render(data);
  console.log(data);
});