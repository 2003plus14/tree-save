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
