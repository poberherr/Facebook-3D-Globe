
var APPID = '226922067431182'; 

// ---------------------------------------------------------------------------------
//  Stuff needed to connect to the FB API and Register Events and stuff
//  Dont touch if you dont know what you are doing  
// ---------------------------------------------------------------------------------
 
window.fbAsyncInit = function() {

    FB.init({
            appId: APPID,
            status: true,
            cookie: true,
            xfbml:  true,
            reloadIfSessionStateChanged: true
    });

    FB.Event.subscribe('auth.login', function(response) {
        login();
    });

    FB.Event.subscribe('auth.logout', function(response) {
        logout();
    });

    /*FB.getLoginStatus(function(response) {
        if (response.session) {
            login();
        }
    });*/

};

(function() {
    var fbroot = document.createElement('div');
    fbroot.setAttribute('id','fb-root');
    var e = document.createElement('script');
        e.type = 'text/javascript';
        e.src = document.location.protocol + '//connect.facebook.net/en_US/all.js';
        e.async = true;
    document.body.appendChild(fbroot);
    fbroot.appendChild(e);
}());



// ---------------------------------------------------------------------------------
// Some neat Function do do suff 
// ---------------------------------------------------------------------------------
    
function login()
{
    FB.api('/me', function(response) {
        document.getElementById('name').innerHTML = response.name + " succsessfully logged in!";
    });
}

function logout()
{
    document.getElementById('name').innerHTML = '';
}

function fqlQuery(fqlQueryString,callbackFunction)
{
    FB.api({
            method: 'fql.query',
            query: fqlQueryString
        },callbackFunction
    );
}


function getFriendsData()
{
    var q =  'SELECT uid,name,pic_square,status,hometown_location,current_location FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1 = me())';
    fqlQuery(q,combineAndGetFriendsLocation);
}



function getLocationById(locationID)
{
    var q = 'SELECT page_id,name,longitude,latitude FROM place WHERE page_id=' + locationID;
    fqlQuery(q,showLocation);
}

function showLocation(data)
{
  //alert(JSON.stringify(data)); 
  alert(
    'Name: ' + data[0].name      + "\n" + 
    'Lati: ' + data[0].latitude  + "\n" + 
    'Long: ' + data[0].longitude + "\n" 
  );
}

var friendsdata = {};
var locationdata = {};

function combineAndGetFriendsLocation(data)
{
    var clocids = [];
    //console.log("You have " + data.length + " Friends");

    //document.getElementById('name').innerHTML = "";
    for (var i=0; i<data.length; i++) {
        //renderFriendData(data[i]);
        friendsdata[data[i].uid] = data[i];
        if(data[i].current_location != undefined 
         && data[i].current_location != null){

        if(data[i].current_location.id != undefined 
         && data[i].current_location.id != null){
          clocids.push(data[i].current_location.id);
          }
        }
    }


   //clocids = $.unique(clocids);
   //console.log(clocids.toString());

   //alert(clocids.substring(1));
   var q = 'SELECT page_id,name,longitude,latitude FROM place WHERE page_id IN (' + clocids.toString() + ")";
//console.log(q);
   fqlQuery(q,
     function(data){
    // alert(JSON.stringify(data2));
    for (var i=0; i<data.length; i++) {
          locationdata[data[i].page_id] = data[i];
    }
        combineUserLocation();
     }
   );


}


function combineUserLocation()
{
    var tmpdata = [];
    for (var key in friendsdata){
        var User = friendsdata[key];
        if(User.current_location != undefined) {
            var ucl = User.current_location;
            var locKey = ucl.id;
	    if(locKey in locationdata){
            var loc = locationdata[locKey];
		tmpdata.push((loc.latitude));
                tmpdata.push((loc.longitude));
		tmpdata.push(0);
		tmpdata.push(0.5);
            }
        }
        if(User.hometown_location != undefined){
	    var ucl = User.hometown_location;
            var locKey = ucl.id;
	    if(locKey in locationdata){
            var loc = locationdata[locKey];
		tmpdata.push((loc.latitude));
                tmpdata.push((loc.longitude));
		tmpdata.push(0);
		tmpdata.push(1);
            }

        }
    }
  //console.log(tmpdata);
   var globeData = [ "Locations", tmpdata ];
   renderGlobe([globeData]);
}



function renderGlobe(data)
{
	//data = globedata;
    if(!Detector.webgl){
      Detector.addGetWebGLMessage();
    } else {      
      //console.log(data);
      //var years = ['1990','1995','2000'];
      var container = document.getElementById('container');
      var globe = new DAT.Globe(container);
      //var i, tweens = [];
      /*var settime = function(globe, t) {
        return function() {
          new TWEEN.Tween(globe).to({time: t/years.length},500).easing(TWEEN.Easing.Cubic.EaseOut).start();
         var y = document.getElementById('year'+years[t]);
          if (y.getAttribute('class') === 'year active') {
            return;
          }
          var yy = document.getElementsByClassName('year');
          for(i=0; i<yy.length; i++) {
            yy[i].setAttribute('class','year');
          }
          y.setAttribute('class', 'year active');
        };
      };*/
      /*for(var i = 0; i<years.length; i++) {
        var y = document.getElementById('year'+years[i]);
        y.addEventListener('mouseover', settime(globe,i), false);
      }*/
      //var xhr;
      //TWEEN.start();
      //xhr = new XMLHttpRequest();
      //xhr.open('GET', '/globe/population909500.json', true);
      //xhr.onreadystatechange = function(e) {
        //if (xhr.readyState === 4) {
          //if (xhr.status === 200) {
            //var data = JSON.parse(xhr.responseText);
            //window.data = data;
            //for (i=0;i<data.length;i++) {

		/*$.getJSON("01-2009.js", function(adata){

			globe.addData(adata[1], {format: 'magnitude'});

			globe.createPoints();

			// Begin animation
			//globe.animate();
		});*/


            for (var i=0;i<data.length;i++) {
              globe.addData(data[i][1], {format: 'legend'});
              //globe.addData(data[i][1], {format: 'legend', name: data[i][0], animated: true});

		/*globe._baseGeometry = new THREE.Geometry();
    		var c = new THREE.Color();
    		c.setHSV( ( 0.6 - ( data[i][2] * 0.5 ) ), 1.0, 1.0 );
		var subgeo = new THREE.Geometry();
	      globe.addPoint(data[i][0],data[i][1],,c,subgeo);
		globe._baseGeometry = subgeo;
		*/
            } 
            globe.createPoints();
            //settime(globe,0)();
            globe.animate();
          //}
        //}
      //};
      //xhr.send(null);
    } // else 
}

function renderFriendData(data)
{
    var txt= '';
    txt += '<div style="border:3px solid black;float:left;padding:3px;margin:4px;text-align:center;width:180px;" >' + data.name + "<br />";
    txt += '<img src="' + data.pic_square + '" alt="" />' + "<br />";
    
    if(data.hometown_location != null){
        txt += '<a href="#" onclick="getLocationById('+ data.hometown_location.id + ');return false;">Hometown</a>'  + "<br />";
    }else{
        txt += '<strike>Hometown</strike>'  + "<br />";
    }
    if(data.current_location != null){
        txt += '<a href="#" onclick="getLocationById('+ data.current_location.id + ');return false;">Current Location</a>' + "<br />";
    }else{
        txt += '<strike>Current Location</strike>'  + "<br />";
    }
    txt += '</div>';
    document.getElementById('name').innerHTML += txt;
}

// ---------------------------------------------------------------------------------
//  Other stuff not needed at the Momenet 
// ---------------------------------------------------------------------------------

/*function streamPublish(name, description, hrefTitle, hrefLink, userPrompt){
    FB.ui({
        method: 'stream.publish',
        message: '',
        attachment: {
            name: name,
            caption: '',
            description: (description),
            href: hrefLink
        },
        action_links: [
            { text: hrefTitle, href: hrefLink }
        ],
        user_prompt_message: userPrompt
    },
    function(response) {
    });
}*/

/*function showStream(){
    FB.api('/me', function(response) {
        //console.log(response.id);
        streamPublish(response.name, 'Thinkdiff.net contains geeky stuff', 'hrefTitle', 'http://thinkdiff.net', "Share thinkdiff.net");
    });
}*/

/*function share(){
    var share = {
        method: 'stream.share',
        u: 'http://thinkdiff.net/'
    };
    FB.ui(share, function(response) { console.log(response); });
}*/

/*function graphStreamPublish(){
    var body = 'Reading New Graph api & Javascript Base FBConnect Tutorial from Thinkdiff.net';
    FB.api('/me/feed', 'post', { message: body }, function(response) {
        if (!response || response.error) {
            alert('Error occured');
        } else {
            alert('Post ID: ' + response.id);
        }
    });
}*/

/*function fqlQuery(){
    FB.api('/me', function(response) {
         var query = FB.Data.query('select name, hometown_location, sex, pic_square from user where uid={0}', response.id);
         query.wait(function(rows) {           
           document.getElementById('name').innerHTML =
             'Your name: ' + rows[0].name + "<br />" +
             '<img src="' + rows[0].pic_square + '" alt="" />' + "<br />";
         });
    });
}*/

/*function setStatus(){
    status1 = document.getElementById('status').value;
    FB.api({
        method: 'status.set',
        status: status1
      },function(response) {
        if (response == 0){
            alert('Your facebook status not updated. Give Status Update Permission.');
        }
        else{
            alert('Your facebook status updated');
        }
      }
    );
}*/
