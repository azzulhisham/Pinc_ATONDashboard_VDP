// Global Variable
lst_vessel = {};
lst_atoninfo = {};
lst_atonData = {};


// DOM Objects
const cnt_in_aton = document.getElementById('cnt_in_aton')
const cnt_in_msg6 = document.getElementById('cnt_in_msg6')
const cnt_in_msg21 = document.getElementById('cnt_in_msg21')
const cnt_in_msg8 = document.getElementById('cnt_in_msg8')

const cnt_in_nomsg6 = document.getElementById('cnt_in_nomsg6')
const cnt_in_offpos = document.getElementById('cnt_in_offpos')
const cnt_in_light = document.getElementById('cnt_in_light')
const cnt_in_ldr = document.getElementById('cnt_in_ldr')
const cnt_in_battAton = document.getElementById('cnt_in_battAton')
const cnt_in_battLant = document.getElementById('cnt_in_battLant')



///////////////////
//     mapbox
///////////////////
// Create a popup, but don't add it to the map yet.
const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
});


// GeoJSON object to hold our measurement features
const geojson = {
    'type': 'FeatureCollection',
    'features': []
};
     
// Used to draw a line between points
const linestring = {
    'type': 'Feature',
    'geometry': {
        'type': 'LineString',
        'coordinates': []
    }
};

mapboxgl.accessToken = 'pk.eyJ1IjoiYXp6dWxoaXNoYW0iLCJhIjoiY2s5bjR1NDBqMDJqNDNubjdveXdiOGswYyJ9.SYlfXRzRtpbFoM2PHskvBg';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/mapbox/satellite-v9', // style URL
    center: [102.211728, 3.515546], // starting position [lng, lat]  
    zoom: 6.5, // starting zoom
    pitch: 20
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

const draw = new MapboxDraw({
    displayControlsDefault: true,
    // Select which mapbox-gl-draw control buttons to add to the map.
    controls: {
        polygon: true,
        trash: true
    },
    // Set mapbox-gl-draw to draw by default.
    // The user does not have to click the polygon control button first.
    // defaultMode: 'draw_polygon'
});

// map.addControl(draw);

// map.on('draw.create', polygonDrawn);
// map.on('draw.delete', polygonDrawn);
// map.on('draw.update', polygonDrawn);
 
function polygonDrawn(e) {
    const data = draw.getAll();
    //const answer = document.getElementById('calculated-area');

    if (data.features.length > 0) {
        console.log(JSON.stringify(data))
        // const area = turf.area(data);
        // // Restrict the area to 2 decimal points.
        // const rounded_area = Math.round(area * 100) / 100;
        // answer.innerHTML = `<p><strong>${rounded_area}</strong></p><p>square meters</p>`;
    } 
}

map.on('load', ()=> {
    map.setFog();   
});




/////////////////////////////////////////////////////////
// General Purpose Functions
/////////////////////////////////////////////////////////
// Radical Menu
function addVesselRadicalPopupMenu(mmsi){

    const p_nav = document.createElement('nav')
    const p_div = document.createElement('div')
    const p_divBtn = document.createElement('div')
    const p_divI = document.createElement('i')

    p_nav.id = "nav_" + mmsi
    p_divBtn.id = "tog_btn_" + mmsi

    p_divI.className = "fa-solid fa-plus"
    p_divBtn.className = "toggle-btn"
    p_div.className = 'nav-content'

    const p_spanI1 = document.createElement('i')
    p_spanI1.className = "fa-solid fa-earth-americas"
    const p_span1 = document.createElement('span')
    p_span1.className = "menu-item"
    p_span1.setAttribute("style", "--i:1;")
    p_span1.appendChild(p_spanI1)
    p_span1.id = "sp1_" + mmsi

    const p_spanI2 = document.createElement('i')
    p_spanI2.className = "fa-solid fa-database"
    const p_span2 = document.createElement('span')
    p_span2.className = "menu-item"
    p_span2.setAttribute("style", "--i:2;")
    p_span2.appendChild(p_spanI2)
    p_span2.id = "sp2_" + mmsi

    const p_spanI3 = document.createElement('i')
    p_spanI3.className = "fa-solid fa-calendar-day"
    const p_span3 = document.createElement('span')
    p_span3.className = "menu-item"
    p_span3.setAttribute("style", "--i:3;")
    p_span3.appendChild(p_spanI3)
    p_span3.id = "sp3_" + mmsi

    const p_spanI4 = document.createElement('i')
    p_spanI4.className = "fa-solid fa-magnifying-glass"
    const p_span4 = document.createElement('span')
    p_span4.className = "menu-item"
    p_span4.setAttribute("style", "--i:4;")
    p_span4.appendChild(p_spanI4)
    p_span4.id = "sp4_" + mmsi

    const p_spanI5 = document.createElement('i')
    p_spanI5.className = "fa-regular fa-images"
    const p_span5 = document.createElement('span')
    p_span5.className = "menu-item"
    p_span5.setAttribute("style", "--i:5;")
    p_span5.appendChild(p_spanI5)
    p_span5.id = "sp5_" + mmsi

    const p_spanI6 = document.createElement('i')
    p_spanI6.className = "fa-solid fa-timeline"
    const p_span6 = document.createElement('span')
    p_span6.className = "menu-item"
    p_span6.setAttribute("style", "--i:6;")
    p_span6.appendChild(p_spanI6)
    p_span6.id = "sp6_" + mmsi

    const p_spanI7 = document.createElement('i')
    p_spanI7.className = "fa-solid fa-expand"
    const p_span7 = document.createElement('span')
    p_span7.className = "menu-item"
    p_span7.setAttribute("style", "--i:7;")
    p_span7.appendChild(p_spanI7)
    p_span7.id = "sp7_" + mmsi

    const p_spanI8 = document.createElement('i')
    p_spanI8.className = "fa-solid fa-play"
    const p_span8 = document.createElement('span')
    p_span8.className = "menu-item"
    p_span8.setAttribute("style", "--i:8;")
    p_span8.appendChild(p_spanI8)
    p_span8.id = "sp8_" + mmsi

    const p_spanI9 = document.createElement('i')
    p_spanI9.className = "fa-solid fa-clock-rotate-left"
    const p_span9 = document.createElement('span')
    p_span9.className = "menu-item"
    p_span9.setAttribute("style", "--i:9;")
    p_span9.appendChild(p_spanI9)
    p_span9.id = "sp9_" + mmsi

    const p_spanI10 = document.createElement('i')
    p_spanI10.className = "fa-solid fa-gears"
    const p_span10 = document.createElement('span')
    p_span10.className = "menu-item"
    p_span10.setAttribute("style", "--i:10;")
    p_span10.appendChild(p_spanI10)
    p_span10.id = "sp10_" + mmsi

    const p_spanI11 = document.createElement('i')
    p_spanI11.className = "fa-solid fa-map-location-dot"
    const p_span11 = document.createElement('span')
    p_span11.className = "menu-item"
    p_span11.setAttribute("style", "--i:11;")
    p_span11.appendChild(p_spanI11)
    p_span11.id = "sp11_" + mmsi

    const p_spanI12 = document.createElement('i')
    p_spanI12.className = "fa-regular fa-floppy-disk"
    const p_span12 = document.createElement('span')
    p_span12.className = "menu-item"
    p_span12.setAttribute("style", "--i:12;")
    p_span12.appendChild(p_spanI12)
    p_span12.id = "sp12_" + mmsi

    p_divBtn.appendChild(p_divI)
    p_div.appendChild(p_divBtn)

    p_div.appendChild(p_span1)
    p_div.appendChild(p_span2)
    p_div.appendChild(p_span3)
    p_div.appendChild(p_span4)
    p_div.appendChild(p_span5)
    p_div.appendChild(p_span6)
    p_div.appendChild(p_span7)
    p_div.appendChild(p_span8)
    p_div.appendChild(p_span9)
    p_div.appendChild(p_span10)
    p_div.appendChild(p_span11)
    p_div.appendChild(p_span12)

    p_nav.appendChild(p_div)

    return p_nav
}

function clearFocusVessel(){
    const vesselList = document.querySelectorAll('.atons-on-sea')

    vesselList.forEach((itm) => {
        targetVessel = itm.style.getPropertyValue('--mmsi')
        targetelem = 'vessels-on-sea_' + targetVessel
        elem = document.getElementById(targetelem)

        child = elem.children[0]
        if (child.classList.contains('focus-top-left')) {
            child.classList.remove('focus-top-left')
        }

        child = elem.children[1]
        if (child.classList.contains('focus-top-right')){
            child.classList.remove('focus-top-right')
        }

        child = elem.children[2]
        if (child.classList.contains('focus-bottom-right')){
            child.classList.remove('focus-bottom-right')
        }

        child = elem.children[3]
        if (child.classList.contains('focus-bottom-left')){
            child.classList.remove('focus-bottom-left')
        }
    })  

    const lighthouseList = document.querySelectorAll('.atons-lh-on-sea')

    lighthouseList.forEach((itm) => {
        targetVessel = itm.style.getPropertyValue('--mmsi')
        targetelem = 'vessels-on-sea_' + targetVessel
        elem = document.getElementById(targetelem)

        child = elem.children[0]
        if (child.classList.contains('focus-top-left')) {
            child.classList.remove('focus-top-left')
        }

        child = elem.children[1]
        if (child.classList.contains('focus-top-right')){
            child.classList.remove('focus-top-right')
        }

        child = elem.children[2]
        if (child.classList.contains('focus-bottom-right')){
            child.classList.remove('focus-bottom-right')
        }

        child = elem.children[3]
        if (child.classList.contains('focus-bottom-left')){
            child.classList.remove('focus-bottom-left')
        }
    })     
}

function setFocusVessel(targetVessel){
        // focus marker on the vessel
        clearFocusVessel()
        targetelem = 'vessels-on-sea_' + targetVessel
        elem = document.getElementById(targetelem)
        child = elem.children[0]
        child.classList.add('focus-top-left')
        child = elem.children[1]
        child.classList.add('focus-top-right')
        child = elem.children[2]
        child.classList.add('focus-bottom-right')
        child = elem.children[3]
        child.classList.add('focus-bottom-left') 
}

function toggleRadicalMenu(e) {
    popup.remove();

    const selectedVessel = this.parentElement
    targetVessel = selectedVessel.style.getPropertyValue('--mmsi')

    // focus marker on the vessel
    setFocusVessel(targetVessel)


    if (e.which === 1) {

    }
    else if (e.which === 3 ){
        // Radical popup menu
        const toggleBtn = this.querySelector(".toggle-btn")
        
        this.classList.toggle("open")
        toggleBtn.classList.toggle("open")
    }
}

async function radicalMenuClick(e) {
    elemId = this.id
    elemid_text = elemId.split('_')
    //ws.send('playback:' + parseInt(elemid_text[1]))

    const navmenu = document.getElementById("nav_" + elemid_text[1])
    const toggleBtn = document.getElementById("tog_btn_" + elemid_text[1])

    if (toggleBtn.classList.contains('open')){
        navmenu.classList.toggle("open")
        toggleBtn.classList.toggle("open")

        if (elemid_text[0] == 'sp12'){
            vessel_info_panel(elemid_text[1])
            vesselInfo.classList.add('openwide')
        }
    }
}

function showVesselPopup(e) {
    elemId = this.id
    elemid_text = elemId.split('_')
    get_mmsi = lst_vessel[elemid_text[1]]
    get_atoninfo = lst_atoninfo[elemid_text[1]]

    const toggleBtn = document.getElementById("tog_btn_" + elemid_text[1])
    const coordinates = get_mmsi.getLngLat()

    if (!toggleBtn.classList.contains('open')) {
        const description = '<h4>' + elemid_text[1] + '</h4>' +
                            '<small> Name &nbsp;: ' + get_atoninfo['atonname'] + '</small><br>' +
                            '<small> Region &nbsp;: ' + get_atoninfo['region']  + '</small><br>' +
                            '<small> Latitude &nbsp;: ' + coordinates.lat + '</small><br>' +
                            '<small> Longitude &nbsp;: ' + coordinates.lng + '</small>'
       
        popup.setLngLat(coordinates).setHTML(description).addTo(map);
    }
}

function removeVesselPopup(e) {
    popup.remove();
}


/////////////////////////////////////////////////////////
// JavaScript example using WebSocket object
// Create a WebSocket object for historical data
/////////////////////////////////////////////////////////
const ws2_URL = "ws://MYKUL-MBP-02.local:38381";
// Define a heartbeat interval in milliseconds
const HEARTBEAT_INTERVAL2 = 30000;

// Define a variable to store the heartbeat timeout ID
let heartbeatTimeout2;

let ws2 = new WebSocket(ws2_URL);
init_WebSocket2();

function init_WebSocket2(){
    // Add an event listener for when the connection is opened
    ws2.addEventListener("open", function(event) {
        // Send a message to the server
        // ws.send("Hello Server!");
        // Start the heartbeat timeout

        startHeartbeat2();
        
        ws2.send('getallaton:0')
        //ws2.send('getallatonmsg:0')
    });

    // Add an event listener for when a message is received from the server
    ws2.addEventListener("message", function(event) {
        let obj = JSON.parse(event.data);

        if (obj['payload'] === 'getatoninitialcount') {
            cnt_in_aton.innerText = obj['aton_cnt']
            // cnt_in_msg6.innerText = obj['msg6_cnt']
            // cnt_in_msg21.innerText = obj['msg21_cnt']
            // cnt_in_msg8.innerText = obj['msg8_cnt']

            cnt_in_nomsg6.innerText = obj['no_msg6_cnt'] + ' (' + obj['no_msg6_cnt_p'] + ')'
            cnt_in_offpos.innerText = obj['offpos_cnt'] + ' (' + obj['offpos_cnt_p'] + ')'
            cnt_in_light.innerText = obj['light_cnt'] + ' (' + obj['light_cnt_p'] + ')'
            cnt_in_ldr.innerText = obj['ldr_cnt'] + ' (' + obj['ldr_cnt_p'] + ')'
            cnt_in_battAton.innerText = obj['battAton_cnt'] + ' (' + obj['battAton_cnt_p'] + ')'
            cnt_in_battLant.innerText = obj['battLant_cnt'] + ' (' + obj['battLant_cnt_p'] + ')'
        }

        if (obj['payload'] === 'getallaton') {
            if (obj['ss_messageType'] == 21) {
                lat = obj['ss_latitude']
                lng = obj['ss_longitude']
                mmsi = obj['mmsi']
                atonName = obj['atonname']
                region = obj['region']
                type = obj['type']
                aton_status = obj['status']
                cog = type.toLowerCase() == 'lighthouse' ? 0 : 45;            

                var size = Object.keys(lst_vessel).length;
        
                if (lat > -90 && lat <= 90){
                    get_mmsi = lst_vessel[mmsi]
        
                    if (get_mmsi === undefined) {
                        
                        const el = document.createElement('div');        
                        el.id = type.toLowerCase() == 'lighthouse' ? 'aton-lighthouse' : 'aton' ;
    
                        if (type.toLowerCase() == 'buoy'){
                            el.className = 'buoyClass'
                        }

                        // setting ATON display color according to legend
                        if (type.toLowerCase() == 'beacon'){
                            if (aton_status == 1) {
                                el.classList.add('beacon-ok')
                            }
                            else {
                                el.classList.add('beacon-ng')
                            }
                        }


                        if (type.toLowerCase() == 'buoy'){
                            if (aton_status == 1) {
                                el.classList.add('buoy-ok')
                            }
                            else {
                                el.classList.add('buoy-ng')
                            }
                        }

                        if (type.toLowerCase() == 'lighthouse'){
                            if (aton_status == 1) {
                                el.classList.add('lighthouse-ok')
                            }
                            else {
                                el.classList.add('lighthouse-ng')
                            }
                        }
    
                        el.setAttribute('style', '--mmsi:' + mmsi);
                        popupLabel = "<h3>MMSI : "  + mmsi + "</h1><p>Langkawi</p>"
                    
                        const marker1 = new mapboxgl.Marker({element:el, rotation: cog})
                        .setLngLat([lng, lat])
                        //.setPopup(new mapboxgl.Popup().setHTML(popupLabel)) // add popup
                        .addTo(map); 
        
                        // add radical menu to vessel
                        const el_vessel = document.createElement('div')
                        el_vessel.className = type.toLowerCase() == 'lighthouse' ? 'atons-lh-on-sea' : 'atons-on-sea';
                        el_vessel.setAttribute('style', '--mmsi:' + mmsi);
                        el_vessel.id = 'vessels-on-sea_' + mmsi
        
                        const vl_zoom1 = document.createElement('div')
                        vl_zoom1.className = 'corner'
                        vl_zoom1.id = 'top-left'
        
                        const vl_zoom2 = document.createElement('div')
                        vl_zoom2.className = 'corner'
                        vl_zoom2.id = 'top-right'
        
                        const vl_zoom3 = document.createElement('div')
                        vl_zoom3.className = 'corner'
                        vl_zoom3.id = 'bottom-right'
        
                        const vl_zoom4 = document.createElement('div')
                        vl_zoom4.className = 'corner'
                        vl_zoom4.id = 'bottom-left'
                        
                        el_vessel.appendChild(vl_zoom1)
                        el_vessel.appendChild(vl_zoom2)
                        el_vessel.appendChild(vl_zoom3)
                        el_vessel.appendChild(vl_zoom4)
        
                        const radical_menu = addVesselRadicalPopupMenu(mmsi)
                        radical_menu.style.transform = "rotate(-" + cog + "deg)"
                        el_vessel.appendChild(radical_menu)
                        el.appendChild(el_vessel)
                        el.style.zIndex = 100
        
                        const nav = document.getElementById("nav_" + mmsi)
                        nav.addEventListener('mouseup', toggleRadicalMenu)
                        nav.addEventListener('mouseenter', showVesselPopup)
                        nav.addEventListener('mouseleave', removeVesselPopup)
        
                        const menuList = nav.querySelectorAll('.menu-item')
        
                        menuList.forEach((itm) => {
                            itm.addEventListener('click', radicalMenuClick)
                        })   
                
                        lst_vessel[mmsi] = marker1
                        lst_atoninfo[mmsi] = obj
                    }
                    else {
                        // get_mmsi.setLngLat([lng, lat])
                        // get_mmsi.setRotation(cog)
                    }
                }    
            }
        }

        if (obj['payload'] === 'getallatonmsg') {
            if (obj['messageType'] == 6) {
                atonStatus = 'ok'
                mmsi = obj['mmsi']
                dac = obj['dac']
                fid = obj['fid']
                
                get_mmsi = lst_vessel[mmsi]
                atonInfo = lst_atoninfo[mmsi]
    
                // if (get_mmsi !== undefined) { 
                //     lst_atonData[mmsi] = obj
                    
                //     if ((dac == 533 && (fid == 1 || fid == 2 || fid == 4)) || (dac == 235 && fid == 10)) {
                //         light = obj['light']
                //         volt_int = obj['volt_int']
                //         volt_ex1 = obj['volt_ex1']
                //         off_pos = obj['off_pos']
                    
                //         if (light != 3 && volt_int >= 12.5 && volt_ex1 >= 12.5 && off_pos == 0) {
                //             atonStatus = 'ok'
                //         }
                //         else {
                //             if (light === 3) {
                //                 atonStatus = 'ng'
                //             }
                //             else {
                //                 atonStatus = 'wn'
                //             }
                //         }
    
                //         atonType = atonInfo['type'].toLowerCase() == 'lighthouse' ? '#aton-lighthouse' : '#aton'
                //         vesselList = document.querySelectorAll(atonType)
    
                //         vesselList.forEach((itm) => {
                //             targetVessel = itm.style.getPropertyValue('--mmsi')
    
                //             if (parseInt(targetVessel) === mmsi) {
                //                 if (atonStatus == 'ok'){
                //                     if (itm.classList.contains('aton-error') || itm.classList.contains('aton-warn')) {
                //                         itm.classList.remove('aton-error')
                //                         itm.classList.remove('aton-warn')
                //                         itm.classList.add('aton-ok')
                //                     }
                //                     else if (!itm.classList.contains('aton-ok'))
                //                     {
                //                         itm.classList.add('aton-ok')
                //                     }
                //                 }
                //                 else 
                //                 {
                //                     if (atonStatus == 'wn'){
                //                         if (itm.classList.contains('aton-ok') || itm.classList.contains('aton-error')) {
                //                             itm.classList.remove('aton-ok')
                //                             itm.classList.remove('aton-error')
                //                             itm.classList.add('aton-warn')
                //                         }
                //                         else if (!itm.classList.contains('aton-warn'))
                //                         {
                //                             itm.classList.add('aton-warn')
                //                         }
                //                     }
                //                     else {
                //                         if (itm.classList.contains('aton-ok') || itm.classList.contains('aton-warn')) {
                //                             itm.classList.remove('aton-ok')
                //                             itm.classList.remove('aton-warn')
                //                             itm.classList.add('aton-error')
                //                         }
                //                         else if (!itm.classList.contains('aton-error'))
                //                         {
                //                             itm.classList.add('aton-error')
                //                         }
                //                     }
                //                 }
                //             }
                //         })                  
                //     }
                // }
            }
        }

        // Reset the heartbeat timeout
        resetHeartbeat2();
    });

    // Add an event listener for when an error occurs
    ws2.addEventListener("error", function(event) {
        // Log the error
        console.log("Error: " + event.message);
    });

    // Add an event listener for when the connection is closed
    ws2.addEventListener("close", function(event) {
        // Log the close code and reason
        console.log("Connection closed: " + event.code + " " + event.reason);
        // Clear the heartbeat timeout
        clearHeartbeat2();

        alert("Connection closed: " + event.code + " " + event.reason)
        location.reload();
    });
}


function startHeartbeat2() {
    // Set a timeout to send a ping message after the heartbeat interval
    heartbeatTimeout2 = setTimeout(function() {
        // Send a ping message and log it
        ws2.send("ping");
        console.log("Send a ping message!");
        // Start the heartbeat timeout again
        startHeartbeat2();
    }, HEARTBEAT_INTERVAL2);
}

// Define a function to reset the heartbeat timeout
function resetHeartbeat2() {
    // Clear the existing heartbeat timeout
    clearHeartbeat2();
    // Start the heartbeat timeout again
    startHeartbeat2();
}

// Define a function to clear the heartbeat timeout
function clearHeartbeat2() {
    // Clear the existing heartbeat timeout if any
    if (heartbeatTimeout2) {
        clearTimeout(heartbeatTimeout2);
        heartbeatTimeout2 = null;
    }
}

// function updateDashboard(){
//     ws2.send('getatoninitialcount:0')
// }

// setInterval(updateDashboard, 30000);

