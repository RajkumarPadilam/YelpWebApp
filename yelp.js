var latitude=32.75;
var longitude=-97.13;
var geocoder;
var map;
var southWestLat;
var southWestLong;
var	northEastLat;
var northEastLong;
var setOneTimeRun=true;

function initialize () {		
		geocoder = new google.maps.Geocoder();
		var mapOptions = {
					zoom: 16,
					center: new google.maps.LatLng(latitude, longitude)
				  };
				  map = new google.maps.Map(document.getElementById('map-canvas'),
					  mapOptions);
		grabMyPosition();
		centerMe();
		}

function grabMyPosition() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(centerMe);
    } else {
        alert("You don't support this");
    }
}

function centerMe(position) {
    var coords = new google.maps.LatLng(
        position.coords.latitude,
        position.coords.longitude
    );

    map.setCenter(coords);
	//alert(map.getBounds()+"-"+coords);
	southWestLat=map.getBounds().getSouthWest().lat();
    southWestLong=map.getBounds().getSouthWest().lng();
	northEastLat=map.getBounds().getNorthEast().lat();
	northEastLong=map.getBounds().getNorthEast().lng();
	// or
    //map.panTo(coords);
}

function codeAddress(jsonOBJ) {
	//alert("entering"+geocoder);
	var address;
	var marker=null;
	for (var i = 0, len = jsonOBJ.businesses.length; i < len; ++i) {
		
    address = ""+jsonOBJ.businesses[i].location.display_address;
	//alert(address);
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        map.setCenter(results[0].geometry.location);
        marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
        });
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
	}
  }
  
function loadScript() {
		if(setOneTimeRun){
		//alert("oneeee");
		  var script = document.createElement('script');
		  script.type = 'text/javascript';
		  script.src = 'https://maps.googleapis.com/maps/api/js?AIzaSyADcI0TU8LGYYKluSUjnc2IaFalqpbJS5M&sensor=false&' +
			  'callback=initialize';
		  document.body.appendChild(script);
		  setOneTimeRun=false;
		  }
		  else{initialize();}
		}

function sendRequest () {
   var xhr = new XMLHttpRequest();
   var query = encodeURI(document.getElementById("search").value);
   //alert(query+"&bounds="+southWestLat+","+southWestLong+"|"+northEastLat+","+northEastLong+"&limit=10");
   xhr.open("GET", "proxy.php?term="+query+"&bounds="+southWestLat+","+southWestLong+"|"+northEastLat+","+northEastLong+"&limit=10");
   xhr.setRequestHeader("Accept","application/json");
   xhr.onreadystatechange = function () {
       if (this.readyState == 4) {
          var json = JSON.parse(this.responseText);
          var str = JSON.stringify(json,undefined,2);
          //document.getElementById("output").innerHTML = "<pre>" + str + "</pre>";
		  if(json!=null)
		  getLocation(json);
       }
   };
   xhr.send(null);
}

function getLocation(jsonOBJ){
	// get the longitude and latitude form the yelp webservice call
	document.getElementById("list").innerHTML='';
	latitude=jsonOBJ.region.center.latitude;
	longitude=jsonOBJ.region.center.longitude;
	getSearchDetails(jsonOBJ);
	initialize();
}


  
function getSearchDetails(jsonOBJ){
for (var i = 0, len = jsonOBJ.businesses.length; i < len; ++i) {
     var firstResult = jsonOBJ.businesses[i];
	 var listItem = document.createElement("li");
	 var img = document.createElement("img");
	 img.style.width="200px";
	 img.style.height="170px";
	 img.src=firstResult.image_url;
	 
	 var rating=document.createElement("img");
	 rating.style.width="50px";
	 rating.style.height="20px";
	 rating.src=firstResult.rating_img_url;
	 
	 var anchor=document.createElement("a");
	 anchor.href=firstResult.url;
	 anchor.innerHTML="<b>"+firstResult.name+"</b>";
	 anchor.style.margin="0 auto";
	 anchor.style.display="block";
	 anchor.style.width="200px";
	 anchor.style.color="black";
	 anchor.target="_blank";
	 
	 var label=document.createElement("label");
	 label.innerHTML="<br><u><b>Snippet</b></u> :<br>"+firstResult.snippet_text;
	 
	 
	 listItem.appendChild(anchor);
	 listItem.appendChild(document.createElement("br"));
	 listItem.appendChild(img);
	 listItem.appendChild(document.createElement("br"));
	 listItem.appendChild(rating);
	 listItem.appendChild(label);
	 
	 document.getElementById("list").appendChild(listItem);
		}
	codeAddress(jsonOBJ);
}