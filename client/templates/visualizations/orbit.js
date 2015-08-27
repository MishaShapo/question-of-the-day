Template.orbit.onCreated(function(){
  var self = this;
  self.ready = new ReactiveVar();
  self.autorun(function() {
    var userHandle  = LongSubs.subscribe('userData');
    self.ready.set(userHandle.ready());
  });
})
Template.orbit.onRendered(function(){
  var self = this;
  
  var orbitScale = d3.scale.linear().domain([1, 3]).range([2.3, 1.5]).clamp(true);
  var radiusScale = d3.scale.linear().domain([0,1,2]).range([90,60,20]).clamp(true);
  var textScale = d3.scale.linear().domain([0,1,2]).range([40,25,20])
  var answerRadiusScale = d3.scale.linear();
  
  var correctColor = "#2ca02c", wrongColor = "#d62728";
  var margins = {
    top: 20,
    left: 20,
    right: 20,
    bottom: 20
  }
  
  var w = self.$('div').width(), h = self.$('div').height();
  var width = w - margins.left - margins.right, height = h - margins.top - margins.bottom;

  var orbit = d3.layout.orbit().size([width/2,height/2])
  .children(function(d) {return d.children})
  .revolution(function(d) {return d.depth})
  .orbitSize(function(d) {return orbitScale(d.depth)})
  .speed(.1)
    
    
  self.autorun(function(){
    if(self.ready.get() && !!Meteor.user()){
      var tags = Meteor.user().tags;
      var dataset = {
        name: Meteor.user().username,
        depth: 0,
        children : []
      };
      if(!!tags){
        tags.forEach(function(cur,index){
          var node = {
            name: cur.name,
            color: cur.color,
            children : [
              {
                name: 'Correct',
                size: cur.correct
              },
              {
                name : 'Wrong',
                size: cur.wrong
              }
            ]
          }
          dataset.children.push(node);
        })
      }

      drawOrbit(dataset)
    }
  })
  
  function drawOrbit(data){
    if(data.children.length === 0){
      d3.select('svg').append('text').text('No data to disaply yet.').attr('y',15).attr('x',15)
      return;
    }
    orbit.nodes(data)
    answerRadiusScale = d3.scale.linear().domain([0,Meteor.user().totalQuestionsAnswered]).range([12,75])
    d3.select('#orbit-visualization')
        .attr("width", width + margins.left + margins.right)
        .attr("height", height + margins.top + margins.bottom)
        .append('g')
        .attr('transform', 'translate(' + width/4 + ',' + height/4 + ')')
        //.attr("transform", "translate(" + margins.left + "," + margins.top + ")")
        .selectAll('g.node')
        .data(orbit.nodes())
        .enter()
        .append('g')
        .attr('class','node')
        .attr('transform', function(d){return 'translate(' + d.x + ',' + d.y +')'})
        //.on('mouseover',nodeOver)
        //.on('mouseout',nodeOut)

      d3.selectAll('g.node')
        .append('circle')
        .attr('r',function(d){
          if(d.depth === 2){
            return answerRadiusScale(d.size)
          }
          return radiusScale(d.depth)
        })
        .style('fill', function(d){
          if(d.depth === 0) {
            return "#dddddd"
          } else if(d.depth === 1) {
            return d.color
          } else if(d.depth === 2){
            if(d.name === 'Correct'){
              return correctColor;
            } else if(d.name === 'Wrong'){
              return wrongColor;
            } else {
              return '#dddddd';
            }
          } else {
            return '#dddddd';
          }
        })
      d3.selectAll('g.node')
        .append('text')
        .text(function(d){
          if(d.depth === 1){
            return d.name;
          } else if(d.depth === 2) {
            return d.size;
          }
        })
        .style("text-anchor", "middle")
        .attr('y',function(d){
          if(d.depth === 1)
            return 9;
          else if(d.depth === 2){
            return 6;
          }
        })
        .attr('font-size', function(d){return textScale(d.depth)})
        .style('fill','white')
        .style('stroke-color','white')
      
      d3.select('svg')
        .selectAll('circle.orbits')
        .data(orbit.orbitalRings())
        .enter()
        .insert('circle','g')
        .attr('transform', 'translate(' + width/4 + ',' + height/4 + ')')
        .attr('class','ring')
        .attr('r',function(d){return d.r})
        .attr('cx',function(d){return d.x})
        .attr('cy',function(d){return d.y})
        .style('fill','none')
        .style('stroke','black')
        .style('stroke-width','1px')
        .style('stroke-opacity',0.15)
      
      orbit.on('tick',function(){
        d3.selectAll("g.node")
          .attr("transform", function(d) {return "translate(" +d.x +"," + d.y+")"});

        d3.selectAll("circle.ring")
        .attr("cx", function(d) {return d.x})
        .attr("cy", function(d) {return d.y});
      })
      
      orbit.start();
  }
  function nodeOver(d){
    orbit.stop();
    d3.select(this).append("text").text(d.name).style("text-anchor", "middle").attr("y", function(data){
      if(data.depth === 0){
        return 75;
      } else if(data.depth === 1){
        return 55;
      } else {
        return 35;
      }
    });
    d3.select(this).select("circle").style("stroke", "black").style("stroke-width", 3);
  }
  function nodeOut(){
    orbit.start();
    d3.selectAll("text").remove();
    d3.selectAll("g.node > circle").style("stroke", "none").style("stroke-width", 0); 
  }
});

Template.orbit.events({
  'click #giveTags' : function() {
    Meteor.loginWithPassword('admin','password');
    Meteor.call('giveTags');
  }
});