var APPID = '226922067431182' 

// ---------------------------------------------------------------------------------
//  Stuff needed to connect to the FB API and Register Events and stuff
//  Dont touch if you dont know what you are doing  
// ---------------------------------------------------------------------------------
 
window.fbAsyncInit = function() {

    FB.init({
            appId: APPID,
            status: true, 
            cookie: true, 
            xfbml: true
        });

    /*
     *  Register Events 
     */
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

/*
 * Load FB Javascript 
 */
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

