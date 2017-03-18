// function to set the options then draw the map
function build_map(){
    // set the configuration of the google map
    var map_options = {
        // set the cneter latitude and longitude
        center: new google.maps.LatLng(57.149717,-2.094278),
        // set the default zoom level
        zoom: 10,
        // set the type of map
        mapTypeId: google.maps.MapTypeId.TERRAIN};
    // make the google map
    var map = new google.maps.Map(document.getElementById("google_map"), map_options);
}

function changeBackground(id,type){
    if (type == 'good'){
        document.body.style.backgroundImage = "url('resources/img/backgroundGood.png')";
        document.body.style.backgroundColor = "#053201";
    } else {
        document.body.style.backgroundColor = "#484848";
        document.body.style.backgroundImage = "url('resources/img/backgroundBad.png')";
    }
}

/*------------------------------------------*/
/* RESULTS PAGE SPECIFIC*/

function openNav(){
  document.getElementById("resultsBar").style.width = "250px";
  document.getElementById("main").style.marginLeft = "250px";
  document.body.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
}

function closeNav(){
  document.getElementById("resultsBar").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
  document.body.style.backgroundColor = "white";
}
