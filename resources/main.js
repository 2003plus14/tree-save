var
  // global tracker for determining which box to add the selected location to
  welcome_which_map,
  // global tracker for the marker
  welcome_marker = null,
  // array to hold all of our location selection boxes
  welcome_input_boxes_array = [],
  // array for the locatiosn
  welcome_locations_array = [];

// function to set the options then draw the map
function welcome_build_map() {
  // set the configuration of the google map
  var map_options = {
    // set the cneter latitude and longitude
    center: new google.maps.LatLng(57.149717, -2.094278),
    // set the default zoom level
    zoom: 10
  };
  // set up the geocoder that will turn coords into locations
  var geocoder = new google.maps.Geocoder,
    // set the info window object that will be attached to the marker
    welcome_info_window = new google.maps.InfoWindow,
    // instantiate a directions service
    directionsService = new google.maps.DirectionsService,
    // set the renderer for the directions
    directionsDisplay = new google.maps.DirectionsRenderer({
      map: map
    }),
    // make the google map
    map = new google.maps.Map(
      document.getElementById("google_map"), map_options);
  // add an event listener to the map to get the location
  google.maps.event.addListener(map, 'click', function(event) {
    // if there is a marker there, remove it
    if (welcome_marker) welcome_marker.setMap(null);
    // call the function the handle the location
    welcome_geocode_location(geocoder, map, welcome_info_window, event.latLng);
  });
}

// function to get work out the location and handle creating the info window
function welcome_geocode_location(
  geocoder, map, welcome_info_window, location) {
  // call the geocode api
  geocoder.geocode({
    'location': location
  }, function(results, status) {
    // if the geocoding returns successfully
    if (status === 'OK') {
      // make our marker
      welcome_marker = new google.maps.Marker({
        // set the position to the location clicked
        position: location,
        // set the map to our map
        map: map
      });
      welcome_marker.setAnimation(google.maps.Animation.BOUNCE);
      // set the contents of our info window to the address
      welcome_info_window.setContent(
        // add some text and two buttons for choosing
        "<h5>" + location + "</h5><b2><h2>" +
        results[0].formatted_address +
        "</h2><p>is this the correct place?<p><br>\
                <button class='button welcome_info_button'\
                id='yes'>yes</button>\
                <button class='button welcome_info_button'\
                id='no'>no</button>");
      // open info window on marker
      //(this has to be here otherwise we cant access the buttons)
      welcome_info_window.open(map, welcome_marker);
      // create an array of the two buttons on the info window we just made
      var welcome_info_buttons = document.getElementsByClassName(
        'welcome_info_button');
      // iterate through the array
      for (let i = 0; i < welcome_info_buttons.length; i++) {
        // add an event listener to each
        welcome_info_buttons[i].addEventListener('click', function() {
          // if id of button is 'yes' call function to set the location
          if (welcome_info_buttons[i].id === 'yes')
            welcome_info_button_press(
              welcome_info_buttons[i],
              welcome_marker,
              welcome_info_window,
              results[0]
            );
          // then remove the marker
          welcome_marker.setMap(null);
        });
      }
      // if the status return as over query limit then tell the user
    } else if (status === 'OVER_QUERY_LIMIT')
      welcome_info_window.setContent(
        '<h2>slow down!</h2><h4>too many requests</h4>');
    // else if it returns as no results found then tell the user
    else if (status === 'ZERO_RESULTS')
      welcome_info_window.setContent(
        '<h3>sorry no results found!</h3><h1>:(</h1>');
    // if there is something else returned panic
    else welcome_info_window.setContent(
      '<h3>something has gone terribly wrong</h3>');
    // ensure the info window is opened
    welcome_info_window.open(map, welcome_marker);
  });
}

// function to set the contents of input boxes and hide map
function welcome_info_button_press(btn, welcome_marker, info, loc) {
  // determine where the map was opened from
  let i = (welcome_which_map == 'start') ? 0 : 1;
  //set the value of the input box to the location reverse geocode
  welcome_input_boxes_array[i].value = loc.formatted_address;
  welcome_locations_array[i] = loc.place_id;
  // 'close' the map
  show('main');
}

// function to make the input boxes to integrate with places api
function welcome_load() {
  // fill our array of input boxes
  welcome_input_boxes_array =
    document.getElementsByClassName('welcome_box_input_box');
  // iterate through the array of input boxes
  for (let i = 0; i < welcome_input_boxes_array.length; i++)
    // at each add the autocomplete api with the cities constraint
    welcome_locations_array[i] = new google.maps.places.Autocomplete(
      welcome_input_boxes_array[i], {
        types: ['(cities)'],
        placeIdOnly: true
      });
  welcome_build_map();
}

// function to get the inputs from the buttons
function welcome_inputs_selected() {
  new google.maps.DistanceMatrixService().getDistanceMatrix({
    origins: [{
      'placeId': welcome_locations_array[0] instanceof Object ?
        welcome_locations_array[0].getPlace().place_id : welcome_locations_array[0]
    }],
    destinations: [{
      'placeId': welcome_locations_array[1] instanceof Object ?
        welcome_locations_array[1].getPlace().place_id : welcome_locations_array[1]
    }],
    travelMode: 'DRIVING'
  }, callback);
}

// function to dispaly the map on button press
function welcome_show_map(who) {
  // set our global variable to the button presseer
  welcome_which_map = who;
  // show the map
  show('map');
}

// function to handle callback from distance api
function callback(response, status) {
  // if the server responds with OK
  if (status == 'OK') {
    // set the part of the response into a var
    var results = response.rows[0].elements;
    for (var j = 0; j < results.length; j++) {
      if (results[j].status == 'ZERO_RESULTS')
        alert('Sorry we can only handle land routes at this time');
      else {
        buildResult(
          response.originAddresses[0],
          response.destinationAddresses[j],
          results[j].duration,
          results[j].distance);
      }
    }
  }
}

function buildResult(f, t, r, d) {
  // get the emissions
  let e = getEm(d),
    // get the trees required
    s = treeSave(e, r),
    // set the html to add trees
    x = '<img class="tree" src="resources/img/tree.png"/>',
    // set the output string
    o = '',
    // set the time
    m = (Math.ceil((s * 10000)) / 10000);
  // set the duration to the text version
  r = r.text;
  // set the distance to the text version
  d = d.text;
  // loop through while i is less than the number of trees required,
  // add a tree to the output
  for (let i = 0; i < s; i++) o += x;
  // build array with the strings
  let it = [f + ',', t, d, r, e + ' tonnes of CO2', s + ' trees'],
    // and with the elements to set
    el = document.getElementsByClassName('obj');
  // loop through the array of elements setting it to our strings
  for (let i = 0; i < el.length; i++) el[i].innerHTML = it[i];
  // show the results page
  show('results');
}

// function to return the emissions based on the distance
function getEm(d) {
  // as a temporary measure just using data from the epa to return
  //  an estimated value
  // rounded((distance(m)/1000)*(co2 per uk gallon/average mpg) * 100) / 100
  return Math.round((((d.value / 1000) * (0.0155 / 60)) + 0.00001) * 100) / 100;
}

// function to return the trees saved based on the emissions
function treeSave(e, r) {
  // as a temporary measure just using data from the epa to return
  //  an estimated value
  return Math.ceil(e / ((0.003859 / 365 / 24 / 60) * r.value));
}

// function to toggle the sidebar
function toggleSidebar(x) {
  document.getElementById("results_bar").style.width =
    x == 'o' ? '250px' : '0';
}

function show(s) {
  document.getElementById("welcome_results_pane").style.display =
    s == 'results' ? 'block' : 'none';
  document.getElementById("closePane").style.display =
    s == 'results' ? 'block' : 'none';
  document.getElementById("welcome_box").style.display =
    s == 'main' ? 'block' : 'none';
  document.getElementById("google_map").style.zIndex =
    s == 'map' ? '2' : '-2';
}
