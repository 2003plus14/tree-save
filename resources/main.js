var results_transport_buttons_array;
var results_transport_buttons_array_type = [false, true, true, false, false];

// generate the array of buttons and add click events to each of them
function generate_array(){
    // array of our buttons
    results_transport_buttons_array = document.getElementsByClassName("results_transport_buttons");
    for (let i = 0; i < results_transport_buttons_array.length; i++){
        // Add a listener for our transport buttons
        results_transport_buttons_array[i].addEventListener("click", function() {
            for (let i = 0; i < results_transport_buttons_array.length; i++){
                results_transport_buttons_array[i].className = "results_transport_buttons button button_circle";
            }
            toggleBtn(this, 'big'); 
            if( i + 1 < results_transport_buttons_array.length ) toggleBtn(results_transport_buttons_array[i+1], 'middle');
            if ( i - 1 > - 1 ) toggleBtn(results_transport_buttons_array[i-1], 'middle');
            changeBackground(i);
        });
    }
}

// function to change swap classes around
function toggleBtn(element, type) {
    var className = 'results_transport_buttons_' + type, classString = element.className, nameIndex = classString.indexOf(className);

    if (nameIndex == -1) {
        classString += ' ' + className;
    } else {
        classString = classString.substr(0, nameIndex) + classString.substr(nameIndex+className.length);
    }
    element.className = classString;
}

// change the background dependant on the button press
function changeBackground(i){
    if ( results_transport_buttons_array_type[ i ] ){
        document.body.style.backgroundImage = "url('resources/img/backgroundGood.png')";
        document.body.style.backgroundColor = "#053201";
    } else {
        document.body.style.backgroundImage = "url('resources/img/backgroundBad.png')";
        document.body.style.backgroundColor = "#484848";
    }
}


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
    var map = new google.maps.Map(document.getElementById("google-map"), map_options);
}


// side bar
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
