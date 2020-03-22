// initialize the names (text) of the squares
g.selectAll('.sqClass')
  .append('text')
  .text(d => d['Name 3'])
  .attr('id', d => `txt${d.Square}`)
  .attr('text-anchor', 'middle')
  .attr('font-family', 'sans-serif')
  .style('font-size', '0em')
  .attr('x', innerWidth/22)
  .attr('y', innerHeight/22);


// toggle show/unshow the names (text) of the squares on CLICK
g.selectAll('.sqClass')
  .on('click', function(d, i) {
    let fsize = g.select(`#txt${d.Square}`).style('font-size')
    if (fsize == '0.6em') {
      g.select(`#txt${d.Square}`)
        .transition().duration(100)
        .style('font-size', '0em')
    }
    else {
      g.select(`#txt${d.Square}`)
        .transition().duration(100)
        .style('font-size', '0.6em');
    }
  });