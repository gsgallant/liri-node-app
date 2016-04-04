var fs=require('fs');
var keys = require('./keys.js');
var http = require('http');
var request = require('request');
var spotify = require('spotify');
var Twitter = require('twitter');
var colors = require('colors');

// //this is the user's request
var userWants = process.argv[2];
var param = process.argv[3];

var client = new Twitter({
	  consumer_key: keys.twitterKeys.consumer_key,
	  consumer_secret: keys.twitterKeys.consumer_secret,
	  access_token_key: keys.twitterKeys.access_token_key,
	  access_token_secret: keys.twitterKeys.access_token_secret,
});

whatDoesUserWant(userWants,param);

//check the user's request
function whatDoesUserWant(userWants,param){
		switch (userWants){
			case "my-tweets" :
				twitter();
				break;
			case "spotify-this-song":
				spotifyThisSong(param);
				break;
			case "movie-this":
				movie(param);
				break;
			case "do-what-it-says":
				doWhatItSays();
				break;
			default :
				console.log("Your Choices are:\nmy-tweets\nspotify-this-song\nmovie-this\ndo-what-it-says\n");
		}
}
function twitter(){
		console.log("\n\nMost recent Tweets\n".bold.underline.red);
		outputString("\nMost recent Tweets\n");
		
		var params = {screen_name: '@ggx568'};
		client.get('statuses/user_timeline', params, function(error, tweets, response){
		  if (!error) {
		    var totalTweets = tweets.length
		    if (totalTweets>20){
		    	totalTweets=20;
		    }
		    for (i=0;i<totalTweets;++i){
		    	console.log(tweets[i].created_at.bold+": "+tweets[i].text.red);
		    	outputString("\n"+tweets[i].created_at+": "+tweets[i].text);
		    }
		    	console.log("\n");
		  		outputString("\n");
		  }else{console.log(error)}
		});

}

function spotifyThisSong(trackName){
		//if user did not specify a song, default to "what's my age again" per HW instructions
		if(trackName===undefined){
		 	trackName = "what's my age again";
		 }
		spotify.search({ type: 'track', query: trackName }, function(err, data) {
		    if ( err ) {
		        console.log('Error occurred: ' + err);
		        return;
		    }
    
    var items = data.tracks.items;
   
    console.log ("Number of albums with this track: "+items.length.bold);
    outputString("\nNumber of albums with this track: "+items.length);
		    for (i=0;i<items.length;++i){
		    	console.log("\nSong Name: ".bold+items[i].name.red.underline);
		    	console.log("   Preview Link of the song on Spotify: ".bold+items[i].preview_url.blue);
		    	console.log("     Album Name: ".bold+items[i].album.name);
		    	console.log("       Which has ".bold+items[i].artists.length+" artists performing on the track");
		    	
		    	outputString("\n");
		    	outputString("\nSong Name: "+items[i].name);
		    	outputString("\n    Preview Link of the song on Spotify: "+items[i].preview_url);
		    	outputString("\n     Album Name: "+items[i].album.name);
		    	outputString("\n      Which has "+items[i].artists.length+" artists performing on the track");
		    	
			    	for (k=0;k<items[i].artists.length;++k){
			    		console.log("         Artist: ".bold+items[i].artists[k].name);
			    		outputString("\n        Artist: "+items[i].artists[k].name);
			    	}
			}
			//add a blank line for readability and formatting (both terminal and file append)
			console.log("\n");
			outputString("\n");

	});

}		
function movie(movie){
		//if user did not specify a movie we default to Mr. Nobody per HW instructions
		 if(movie===undefined){
		 	movie = 'Mr. Nobody';
		 }
		 request('http://www.omdbapi.com/?t='+movie+'&y=&plot=short&tomatoes=true&r=json', function (error, response, body) {
				if (!error && response.statusCode == 200) {
				   var json = JSON.parse(body);
				   //output to terminal (using npm colors module-very cool)
				   console.log("\nTitle: ".bold+json.Title.red.underline);
				   console.log("Year: ".bold+json.Year);
				   console.log("IMDB Rating: ".bold+json.imdbRating);
				   console.log("Country: ".bold+json.Country);
				   console.log("Language: ".bold+json.Language);
				   console.log("Plot: ".bold+json.Plot);
				   console.log("Actors: ".bold+json.Actors);
				   console.log("Rotten Tomatoes rating: ".bold+json.tomatoRating);
				   console.log("Rotten Tomatoes URL: ".bold+json.tomatoURL.blue+ "\n\n");
		 			//call the function to append to a file.
				  	outputString("\nTitle: "+json.Title);
				  	outputString("\nYear: "+json.Year);
				  	outputString("\nIMDB Rating: "+json.imdbRating);
				  	outputString("\nCountry: "+json.Country);
				  	outputString("\nLanguage : "+json.Language);
				  	outputString("\nPlot: "+json.Plot);
				  	outputString("\nActors: "+json.Actors);
				  	outputString("\nRotten Tomatoes rating: "+json.tomatoRating);
				  	outputString("\nRotten Tomatoes URL: "+json.tomatoURL+ "\n\n")

	 			}
		})
}

function doWhatItSays(){
	fs.readFile("random.txt", "utf-8", function read(err, data) {
		  if(err) {
		      return console.log(err);
		  }
		  //if the random.txt is missing a comma (my-tweets would not require a comma for example)
		  if(data.indexOf(",")>-1){
			  var myOwnProcessArgv = data.split(",");
			  param = myOwnProcessArgv[1];
			  userWants = myOwnProcessArgv[0];
		  }else{
		  	userWants = data.trim();
		  };
 
 		whatDoesUserWant(userWants,param);

	});
}
//append output to file (chose not to include console logs due to the npm colors which would need to be in string so not really DRY code anyway)
function outputString(string){
	
	fs.appendFile('liri_output.txt', string, function(err) {
		  if ( err ) {
		        console.log('Error occurred: ' + err);
		        return;
			}
	});
}





