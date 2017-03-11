var button_pressed_id = "headerBtnWalk";

function build_map(){
    var map_options = {
        center: new google.maps.LatLng(57.149717,-2.094278),
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.TERRAIN};
    var map = new google.maps.Map(document.getElementById("google-map"), map_options);
}

function button_press_event(button_pressed){
    button_pressed_id.className = 'headerBtn' + 'Off';
    button_pressed_id = document.getElementById(button_pressed);
    button_pressed_id.className = 'headerBtn' + ( ~button_pressed_id.className.indexOf('On', 8) ? 'Off' : 'On');
}
