var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var count = 0;

var url;
var stats = [];
var allplayers = [];
var playercount = 0;

var minAttempts = 50;
var year= process.argv[2];

function threePointStats(){
	for (page = 0; page<=2; page++){
  		url='http://espn.go.com/nba/statistics/player/_/stat/3-points/sort/threePointFieldGoalPct/year/'+year +'/count/' + (page*40 +1);
		nbaReq(url);
	}
}

function freeThrowStats(){
  for (page = 0; page<=2; page++){
      url='http://espn.go.com/nba/statistics/player/_/stat/free-throws/count/' + (page*40 +1);
    nbaReq(url);
  }

}


function player(array){
	this.called = array[0];
	this.position = array[1];
  this.threesMade = array[2];
  this.threesAttempts = array[3];
  this.threesPct=(100* this.threesMade/ this.threesAttempts).toFixed(2);

}

function nbaReq(url){
  
  request(url, function(err, resp, body) {
  if (err)
    throw err;
  $ = cheerio.load(body);



	
  $('.oddrow').each(function() {
    count++;
    var name= $(this).find('a').parent().text();
    var playerUrl = $(this).find('a')[0].attribs.href;
    stats[0]=name.substring(0,name.length-4);
    stats[1]=name.substring(name.length-2,name.length);
    stats[2]= $(this).find('a').parent().nextAll().slice(5,6);
    stats[3] = stats[2].next();
    stats[2] = stats[2].text();
    stats[3] = stats[3].text();
    allplayers[playercount]= new player(stats);
    findHeight(playerUrl, playercount);
    playercount++;
	});
  //console.log(allplayers);

  $('.evenrow').each(function() {
    count++;
    var name= $(this).find('a').parent().text();
    var playerUrl = $(this).find('a')[0].attribs.href;
    stats[0]=name.substring(0,name.length-4);
    stats[1]=name.substring(name.length-2,name.length);
    stats[2]= $(this).find('a').parent().nextAll().slice(5,6);
    stats[3] = stats[2].next();
    stats[2] = stats[2].text();
    stats[3] = stats[3].text();
    allplayers[playercount]= new player(stats);
    findHeight(playerUrl, playercount);
    playercount++;
  });
  //console.log(allplayers);
    }); 
}

function findHeight(playerUrl, playercounter){
   request(playerUrl, function(err, resp, body){

    if (err)
      throw err;
    $ = cheerio.load(body);
    var name = $('h1').text().slice(9);
    var height = $('.general-info').children(1).text().split(',')[0];

    var inches = parseInt(height.slice(0,1))*12 +parseInt(height.slice(3,5));
    allplayers[playercounter].height = inches;
    count--;

    if (!count) {
      console.log(allplayers);
      fs.writeFile(year+".txt", JSON.stringify(allplayers), function(err) {
      if(err) {
          console.log(err);
      } else {
          console.log("The file was saved!");
      }
      }); 
    }

  })  

}

threePointStats();
