const mapHeight = 600; // adjust this parameter to size the world map
const mapWidth = 1600 / 811.52 * mapHeight;
const R = mapWidth/2/Math.PI*1.18; // last number for fine-tuning

const latitude = [0,5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90];
const X = [1,0.9986,0.9954,0.99,0.9822,0.973,0.96,0.9427,0.9216,0.8962,0.8679,0.835,0.7986,0.7597,0.7186,0.6732,0.6213,0.5722,0.5322];
const Y = [0,0.062,0.124,0.186,0.248,0.31,0.372,0.434,0.4958,0.5571,0.6176,0.6769,0.7346,0.7903,0.8435,0.8936,0.9394,0.9761,1];

function getX(lat, lon) {
    x = 0.8487 * R * everpolate.linear(lat, latitude, X) * lon/180*Math.PI;
    return mapWidth/2 + x;
  };
function getY(lat) {
    y = 1.3523 * R * everpolate.linear(lat, latitude, Y);
    return mapHeight/2 - y;
  };

const svgMapOverlay = d3.select('.div1')
  .append('svg')
  .attr('height', mapHeight)
  .attr('width', mapWidth);

svgMapOverlay
  .append('svg:image')
  .attr('href', 'Robinson.svg')
  .attr('height', mapHeight)
  .attr('width', mapWidth);

// enter data into newly appended groups
function enterData(data) {
  svgMapOverlay.selectAll('g.gLocation')
    .data(data)
	.enter()
	.append('g')
	.classed('gLocation', true)
	.attr('id', d => {
	  if (d['Province/State'] == '') {
		return d['Country/Region'];
	  }
	  else {
		return d['Province/State'] + ', ' + d['Country/Region'];
	  }
	});
};

// translate the group locations
function translateG() {
  svgMapOverlay.selectAll('g.gLocation')
    .each(function(d) {
	  x = getX(d.Lat, d.Long);
	  y = getY(d.Lat)
	  d3.select(this)
	    .attr('transform', `translate(${x}, ${y})`);
	});
};

// function to get radius of circle
function getRadius(n, data) {
  let keys = Object.keys(data[0]);
  let lastKey = keys[keys.length -1];
  let maxStrData = data[0][lastKey];
  let maxN = maxStrData.split(',')[0];
  radius = (n/maxN)**0.5 * 35;
  return radius;
};

// func to get lastKey
function getLastKey(data) {
  let keys = Object.keys(data[0]);
  let lastKey = keys[keys.length -1];
  return lastKey;
};

// func to get deathRate
function getDeathRate(key, d) {
  return d[key].split(',')[1] / d[key].split(',')[0];
};

// initialise the circles on the latest data
function initCircle(data) {
  svgMapOverlay.selectAll('g.gLocation')
    .each(function(d) {
      key = getLastKey(data);
      n = d[key].split(',')[0];
      d3.select(this)
        .append('circle')
        .attr('r', getRadius(n,data))
        .attr('fill', seqScale(getDeathRate(key, d)))
        .attr('stroke', 'black')
        .attr('stroke-width', 1.5);
    });
}

// update circle attributes
function updateCircle(num, data) {
  let keys = Object.keys(data[0]);
  let key = keys[num + 5];
  svgMapOverlay.selectAll('g.gLocation')
    .each(function(d) {
      n = d[key].split(',')[0];
      d3.select(this)
        .select('circle')
        .attr('r', getRadius(n,data))
        .attr('fill', seqScale(getDeathRate(key, d)))
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
    });
  d3.select('#slider-description')
    .text(`Adjust the slider below to move through the timeline: ${key}`);
};

// func for min and max death rates
function getMinMaxDR(data) {
  let keys = Object.keys(data[0]);
  let key = keys[keys.length - 1];
  let minDeathRate = Infinity;
  let maxDeathRate = 0;
  data.forEach(function(d) {
    nD = d[key].split(',')[1];
    nC = d[key].split(',')[0];
    if (nD/nC < minDeathRate) {
      minDeathRate = nD/nC;
    }
    if (nD/nC > maxDeathRate) {
      maxDeathRate = nD/nC;
    }
  });
  return [minDeathRate, maxDeathRate];
};

// set up seqScale
function createSeqScale(data) {
  return d3.scaleSequential()
    .domain(getMinMaxDR(data))
    .interpolator(d3.interpolateInferno);
};

// create legend for seqScale
function createLegend(data) {
  let width = 350;
  let nInterv = 10; // how many legend intervals
  let legendWidth = width + width/(nInterv - 1);
  let minMax = getMinMaxDR(data);
  var minMaxRange = Array.from(Array(nInterv).keys())
  minMaxRange.forEach(function(x, i, arr){
    arr[i] = x/(nInterv-1) * (minMax[1] - minMax[0]);
  });
  minMaxRange.forEach(function(x, i, arr){
    arr[i] = x + minMax[0];
  });
  svgMapOverlay.append('g')
    .classed('gLegend', true)
    .attr('transform', 
      `translate(${(mapWidth-legendWidth)/2},${mapHeight*0.85})`);
  minMaxRange.forEach(function(x){
    d3.select('.gLegend')
      .append('text')
      .text(`${(x*100).toFixed(2)}`)
      .attr('x', (x - minMax[0]) / (minMax[1] - minMax[0]) * width)
      .attr('y', 20)
      .style('font-size', '0.7em');
    d3.select('.gLegend')
      .append('rect')
      .attr('stroke', 'black')
      .attr('stroke-width', 1.5)
      .attr('x', (x - minMax[0]) / (minMax[1] - minMax[0]) * width)
      .attr('y', 0)
      .attr('height', 10)
      .attr('width', width/(nInterv - 1))
      .attr('fill', seqScale(x));
  });
  d3.select('.gLegend')
    .append('text')
    .text('Death rates (%)')
    .attr('y', -5);
};

// slider creation
function createSlider(data) {
  let keys = Object.keys(data[0]);
  let key = keys[keys.length - 1]
  const slider = d3
    .sliderBottom()
    .min(0)
    .max(keys.length - 6)
    .step(1)
    .width(400)
    .default(keys.length - 6)
    .displayValue(false)
    .on('onchange', num => {
      updateCircle(num, data);
    });
  const gSlider = d3
    .select('div#slider')
    .append('svg')
    .attr('height', 100)
    .attr('width', mapWidth)
    .append('g')
    .attr('transform', `translate(${(mapWidth - slider.width()) / 2}, 30)`);
  d3.select('#slider-description')
    .text(`Adjust the slider below to move through the timeline: ${key}`);
  gSlider
    .call(slider);
};

// read the data and render it
d3.csv('time_series_top15.csv').then(function(data) {
  enterData(data);
  translateG();
  seqScale = createSeqScale(data);
  initCircle(data);
  createSlider(data);
  createLegend(data);
});