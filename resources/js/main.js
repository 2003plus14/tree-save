function buildMap(){
        var mapOptions = {
            center: new google.maps.LatLng(57.149717,-2.094278),
            zoom: 10,
            mapTypeId: google.maps.MapTypeId.TERRAIN
        }
        var map = new google.maps.Map(document.getElementById("google-map"), mapOptions);
}

function buttonPress(){
    for (var i = 0 ; i < imageArray.length ; ++i) {
        function(index) {
            imageArray[index].addEventListener("click", function() {
                alert ("You clicked region number: " + index);
            });
        } ( i);
    }
}
