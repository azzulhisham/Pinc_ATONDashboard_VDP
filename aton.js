// Global Variable
lst_vessel = {};
lst_atoninfo = {};
lst_ngatoninfo = {};
lst_atonData = {};
lst_statistic = [];
lst_statistic_daily = [];
lst_voltdata = [];

lst_light_err = {};
lst_battAton_ng = {};
lst_battLant_ng = {};
lst_offpos_ng = {};
lst_ldr_ng = {};
lst_no_msg6 = {};

summary_det = undefined
analytic_table = undefined
analytic_row_number = 0
selected_data_to_update_map = 0


// DOM Objects
const aton_map = document.getElementById('map')
const closeVesselInfo = document.getElementById("closeVesselInfo")
// const vesselInfo = document.querySelector('.vessel-info')
const vesselInfo = document.getElementById('aton-info-panel')
const msg_count_container = document.getElementById('msg-count-container')
const chartdev1 = document.getElementById("summary-chart1")
const chartdev2 = document.getElementById("summary-chart2")
const chartdev3 = document.getElementById("summary-chart3")
const cnt_msg_6 = document.getElementById('cnt-msg-6')
const cnt_msg_8 = document.getElementById('cnt-msg-8')
const cnt_msg_21 = document.getElementById('cnt-msg-21')
const cnt_msg_6_yest = document.getElementById('cnt-msg-6-yest')
const cnt_msg_8_yest = document.getElementById('cnt-msg-8-yest')
const cnt_msg_21_yest = document.getElementById('cnt-msg-21-yest')

const inp_search = document.getElementById("inp-search")
const btn_search_clear = document.getElementById("btn-search-clr")
const search_mmsi = document.getElementById("search_mmsi")
const meas_dist_func = document.getElementById("distance")
const meas_dist = document.getElementById('meas_dist')

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
const dashboard_date = document.getElementById('dashboard-date')

const chk_select_beacon = document.getElementById('chk-select-beacon')
const chk_select_buoy = document.getElementById('chk-select-buoy')
const chk_select_lighthouse = document.getElementById('chk-select-lighthouse')
const rad_aton_all = document.getElementById('rad-aton-all')
const rad_aton_ok = document.getElementById('rad-aton-ok')
const rad_aton_ng = document.getElementById('rad-aton-ng')

const data_table = document.getElementById('data-table')
const download_csv = document.getElementById('download-csv')
const download_json = document.getElementById('download-json')
const download_pdf = document.getElementById('download-pdf')

// JavaScript to handle mouseover event and show/hide panel
const menuButton = document.getElementById('menuButton');
const infoOptions = document.getElementById('infoOptions');
infoOptions.classList.add('hidden');

const showChart = document.getElementById('showChart');
const dialogShowChart = document.getElementById('dialogShowChart');
dialogShowChart.classList.add("hidden");
const closeChartButton = document.getElementById('closeChart');

//chart dialogue on map
const showReport = document.getElementById('showReport');
const dialogShowReport = document.getElementById('dialogShowReport');
dialogShowReport.classList.add("hidden");
const closeReportButton = document.getElementById('closeReport');
const chart_data = document.getElementById('chart-data')


//chart dialogue on tabulate
const dialogShowReportOnTable = document.getElementById('dialogShowReportOnTable');
dialogShowReportOnTable.classList.add("hidden");
const closeReportOnTableButton = document.getElementById('closeReportOnTable');
const chartOnTable_data = document.getElementById('chartOnTable-data')


//Define variables for input elements
const tabulate_container = document.getElementById('tabulate-container')
const dashboard_title_label = document.getElementById('dashboard-title-label')
const fieldEl = document.getElementById("filter-field");
const typeEl = document.getElementById("filter-type");
const valueEl = document.getElementById("filter-value");
const daily_type = document.getElementById("daily-type");


// Javascript show hide sidebar menu
const sidebarMenu = document.getElementById('sidebarMenu');
const sidebarToggle = document.getElementById('sidebarToggle');
sidebarToggle.addEventListener("click", () => {     
    if (sidebarMenu.style.display !== "none") {
        sidebarMenu.style.display = "none";
    } else { 
        sidebarMenu.style.display = "";
    }
});

// sidebarMenu.classList.add("hidden");


menuTimeoutId = undefined;
optsTimeoutId = undefined;


var test_flg = 0
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
var yyyy = today.getFullYear();
today = '(' + dd + '/' + mm + '/' + yyyy + ')';
dashboard_date.innerText = today


//////////////////////
//     DOM Event
//////////////////////
closeVesselInfo.addEventListener('click', () => {
    if (vesselInfo.classList.contains('open')){
        vesselInfo.classList.remove('open')
    }
    
    if (vesselInfo.classList.contains('openwide')){
        vesselInfo.classList.remove('openwide')
    }
})

search_mmsi.addEventListener('focusout', () => {
    searchVessel(search_mmsi.value)
})

search_mmsi.addEventListener('keypress', (e) => {
    if (e.which === 13){
        searchVessel(search_mmsi.value)
    }  
})

inp_search.addEventListener('focusout', () => {
    searchVessel(inp_search.value)
})

inp_search.addEventListener('keypress', (e) => {
    if (e.which === 13){
        e.preventDefault()
        searchVessel(inp_search.value)
    }  
})

chk_select_beacon.addEventListener('click', (e) => {
    // lst_vessel[mmsi] = marker1
    // lst_atoninfo[mmsi] = obj

    if (!chk_select_beacon.checked){
        for (let i in lst_atoninfo) {
            atonInfo = lst_atoninfo[i]

            if (atonInfo['type'].toLowerCase() == 'beacon'){
                marker = lst_vessel[i]
                marker.remove()
            }
        }
    }
    else
    {
        for (let i in lst_atoninfo) {
            atonInfo = lst_atoninfo[i]

            if (atonInfo['type'].toLowerCase() == 'beacon'){
                marker = lst_vessel[i]

                if (rad_aton_all.checked) {
                    marker.addTo(map)
                }
                
                if (rad_aton_ok.checked && atonInfo['status'] == 1) {
                    marker.addTo(map)
                }

                if (rad_aton_ng.checked && atonInfo['status'] == 0) {
                    marker.addTo(map)
                }
            }
        }
    }  

    cal_summary_details()
})

chk_select_buoy.addEventListener('click', (e) => {
    // lst_vessel[mmsi] = marker1
    // lst_atoninfo[mmsi] = obj

    if (!chk_select_buoy.checked){
        for (let i in lst_atoninfo) {
            atonInfo = lst_atoninfo[i]

            if (atonInfo['type'].toLowerCase() == 'buoy'){
                marker = lst_vessel[i]
                marker.remove()
            }
        }
    }
    else
    {
        for (let i in lst_atoninfo) {
            atonInfo = lst_atoninfo[i]

            if (atonInfo['type'].toLowerCase() == 'buoy'){
                marker = lst_vessel[i]

                if (rad_aton_all.checked) {
                    marker.addTo(map)
                }
                
                if (rad_aton_ok.checked && atonInfo['status'] == 1) {
                    marker.addTo(map)
                }

                if (rad_aton_ng.checked && atonInfo['status'] == 0) {
                    marker.addTo(map)
                }
            }
        }
    }  

    cal_summary_details()
})

chk_select_lighthouse.addEventListener('click', (e) => {
    // lst_vessel[mmsi] = marker1
    // lst_atoninfo[mmsi] = obj

    if (!chk_select_lighthouse.checked){
        for (let i in lst_atoninfo) {
            atonInfo = lst_atoninfo[i]

            if (atonInfo['type'].toLowerCase() == 'lighthouse'){
                marker = lst_vessel[i]
                marker.remove()
            }
        }
    }
    else
    {
        for (let i in lst_atoninfo) {
            atonInfo = lst_atoninfo[i]

            if (atonInfo['type'].toLowerCase() == 'lighthouse'){
                marker = lst_vessel[i]

                if (rad_aton_all.checked) {
                    marker.addTo(map)
                }
                
                if (rad_aton_ok.checked && atonInfo['status'] == 1) {
                    marker.addTo(map)
                }

                if (rad_aton_ng.checked && atonInfo['status'] == 0) {
                    marker.addTo(map)
                }
            }
        }
    } 
    
    cal_summary_details()
})


rad_aton_all.addEventListener('click', (e) => {
    for (let i in lst_atoninfo) {
        atonInfo = lst_atoninfo[i]
        marker = lst_vessel[i]

        let chkElem = document.getElementById('vessels-on-sea_' + atonInfo['mmsi'])
        
        if (chk_select_beacon.checked && atonInfo['type'].toLowerCase() == 'beacon' && chkElem == null) {
            marker.addTo(map)
        }

        if (chk_select_buoy.checked && atonInfo['type'].toLowerCase() == 'buoy' && chkElem == null) {
            marker.addTo(map)
        } 
        
        if (chk_select_lighthouse.checked && atonInfo['type'].toLowerCase() == 'lighthouse' && chkElem == null) {
            marker.addTo(map)
        } 
    }

    cal_summary_details()
})

rad_aton_ok.addEventListener('click', (e) => {
    for (let i in lst_atoninfo) {
        atonInfo = lst_atoninfo[i]
        marker = lst_vessel[i]

        let chkElem = document.getElementById('vessels-on-sea_' + atonInfo['mmsi'])
        
        if (chk_select_beacon.checked && atonInfo['type'].toLowerCase() == 'beacon') {
            if (chkElem == null && atonInfo['status'] == 1) {
                marker.addTo(map)
            }

            if (chkElem != null && atonInfo['status'] == 0) {
                marker.remove()
            }            
        }

        if (chk_select_buoy.checked && atonInfo['type'].toLowerCase() == 'buoy') {
            if (chkElem == null && atonInfo['status'] == 1) {
                marker.addTo(map)
            }

            if (chkElem != null && atonInfo['status'] == 0) {
                marker.remove()
            }            
        }
        
        if (chk_select_lighthouse.checked && atonInfo['type'].toLowerCase() == 'lighthouse') {
            if (chkElem == null && atonInfo['status'] == 1) {
                marker.addTo(map)
            }

            if (chkElem != null && atonInfo['status'] == 0) {
                marker.remove()
            }            
        }
    }

    cal_summary_details()
})

rad_aton_ng.addEventListener('click', (e) => {
    for (let i in lst_atoninfo) {
        atonInfo = lst_atoninfo[i]
        marker = lst_vessel[i]

        let chkElem = document.getElementById('vessels-on-sea_' + atonInfo['mmsi'])
        
        if (chk_select_beacon.checked && atonInfo['type'].toLowerCase() == 'beacon') {
            if (chkElem == null && atonInfo['status'] == 0) {
                marker.addTo(map)
            }

            if (chkElem != null && atonInfo['status'] == 1) {
                marker.remove()
            }            
        }

        if (chk_select_buoy.checked && atonInfo['type'].toLowerCase() == 'buoy') {
            if (chkElem == null && atonInfo['status'] == 0) {
                marker.addTo(map)
            }

            if (chkElem != null && atonInfo['status'] == 1) {
                marker.remove()
            }            
        }
        
        if (chk_select_lighthouse.checked && atonInfo['type'].toLowerCase() == 'lighthouse') {
            if (chkElem == null && atonInfo['status'] == 0) {
                marker.addTo(map)
            }

            if (chkElem != null && atonInfo['status'] == 1) {
                marker.remove()
            }            
        }
    }

    cal_summary_details()
})


menuButton.addEventListener('mouseenter', () => {
    if (optsTimeoutId != undefined){
        clearTimeout(optsTimeoutId)
        optsTimeoutId = undefined
    }
    infoOptions.classList.remove('hidden');
});

menuButton.addEventListener('mouseleave', () => {
    menuTimeoutId = setTimeout(() => {
        if (optsTimeoutId == undefined){
            infoOptions.classList.add('hidden');
        }
        
        menuTimeoutId = undefined
    }, 250)
});

infoOptions.addEventListener('mouseenter', () => {
    if (menuTimeoutId != undefined){
        clearTimeout(menuTimeoutId)
        menuTimeoutId = undefined
    }
})

infoOptions.addEventListener('mouseleave', () => {
    optsTimeoutId = setTimeout(() => {
        infoOptions.classList.add('hidden');
        optsTimeoutId = undefined
    }, 250)            
})

// Dialog Cart Handling
showChart.addEventListener('click', () => {
    toggle_msg_counting_chart_panel()
});

closeChartButton.addEventListener('click', () => {
    dialogShowChart.classList.add('hidden');
});


// Dialog Report Handling
showReport.addEventListener('click', () => {
    //data_table.innerHTML = ''

    if (data_table.classList.contains("highcharts-dark")) {
        data_table.classList.remove("highcharts-dark")
    }

    // build_tabulator_table()
    // dialogShowReport.classList.remove('hidden');
    // download_csv.classList.remove('hidden')
    // download_json.classList.remove('hidden')
    // download_pdf.classList.remove('hidden')

    aton_map.classList.add('hidden')
    //dashboard_title_label.innerText = 'ATON ANALYTICS'
    tabulate_container.classList.add('openwide')
});

closeReportButton.addEventListener('click', () => {
    dialogShowReport.classList.add('hidden');
});

closeReportOnTableButton.addEventListener('click', () => {
    dialogShowReportOnTable.classList.add('hidden');
});

btn_search_clear.addEventListener('click', () => {
    inp_search.value = ''
})


//Update filters on value change
document.getElementById("filter-field").addEventListener("change", updateFilter);
document.getElementById("filter-type").addEventListener("change", updateFilter);
document.getElementById("filter-value").addEventListener("keyup", updateFilter);

daily_type.addEventListener('change', function(){
    if (daily_type.value == '') {
        analytic_table = build_tabulator_table(lst_statistic)
    }
    else
    {
        lst_statistic_daily = []
        ws2.send('getdailystatisticstartfrom:' + daily_type.value)        
    }
})


//Clear filters on "Clear Filters" button click
document.getElementById("filter-clear").addEventListener("click", function(){
  fieldEl.value = "";
  typeEl.value = "=";
  valueEl.value = "";
//   daily_type.value = "";

  analytic_table.clearFilter();
});


//trigger download of data.csv file
document.getElementById("download-csv").addEventListener("click", function(){
    analytic_row_number = 0
    analytic_table.download("csv", "data.csv");
});

//trigger download of data.json file
document.getElementById("download-json").addEventListener("click", function(){
    analytic_row_number = 0
    analytic_table.download("json", "data.json");
});

//trigger download of data.xlsx file
//document.getElementById("download-xlsx").addEventListener("click", function(){
//     table.download("xlsx", "data.xlsx", {sheetName:"My Data"});
// });

//trigger download of data.pdf file
document.getElementById("download-pdf").addEventListener("click", function(){
    analytic_row_number = 0
    analytic_table.download("pdf", "data.pdf", {
        orientation:"landscape", //set page orientation to portrait
        title:"Report", //add title to report
    });
});



const update_aton_on_map0 = document.getElementById('update-aton-on-map0')
update_aton_on_map0.addEventListener('click', (e) => {
    selected_data_to_update_map = 0
    update_aton_on_map(update_aton_on_map0, selected_data_to_update_map)
})

const update_aton_on_map1 = document.getElementById('update-aton-on-map1')
update_aton_on_map1.addEventListener('click', (e) => {
    selected_data_to_update_map = 1
    update_aton_on_map(update_aton_on_map1, selected_data_to_update_map)
})

const update_aton_on_map2 = document.getElementById('update-aton-on-map2')
update_aton_on_map2.addEventListener('click', (e) => {
    selected_data_to_update_map = 2
    update_aton_on_map(update_aton_on_map2, selected_data_to_update_map)
})

const update_aton_on_map3 = document.getElementById('update-aton-on-map3')
update_aton_on_map3.addEventListener('click', (e) => {
    selected_data_to_update_map = 3
    update_aton_on_map(update_aton_on_map3, selected_data_to_update_map)
})

const update_aton_on_map4 = document.getElementById('update-aton-on-map4')
update_aton_on_map4.addEventListener('click', (e) => {
    selected_data_to_update_map = 4
    update_aton_on_map(update_aton_on_map4, selected_data_to_update_map)
})

const update_aton_on_map5 = document.getElementById('update-aton-on-map5')
update_aton_on_map5.addEventListener('click', (e) => {
    selected_data_to_update_map = 5
    update_aton_on_map(update_aton_on_map5, selected_data_to_update_map)
})

const update_aton_on_map6 = document.getElementById('update-aton-on-map6')
update_aton_on_map6.addEventListener('click', (e) => {
    selected_data_to_update_map = 6
    update_aton_on_map(update_aton_on_map6, selected_data_to_update_map)
})


///////////////////
//     mapbox
///////////////////
// Create a popup, but don't add it to the map yet.
const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,   
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
function toggle_msg_counting_chart_panel() {
    // dialogShowChart.classList.remove('hidden');
    if (msg_count_container.classList.contains('openwide')) {
        msg_count_container.classList.remove('openwide')

        map.flyTo({
            center: [102.211728, 3.515546],
            zoom: 6.5,
            duration: 3000,
            essential: true // this animation is considered essential with respect to prefers-reduced-motion
        });
    }
    else {
        msg_count_container.classList.add('openwide')

        map.flyTo({
            center: [101.7, 3.515546],
            zoom: 6.5,
            duration: 3000,
            essential: true // this animation is considered essential with respect to prefers-reduced-motion
        });
    }    
}

function close_analytic() {
    aton_map.classList.remove('hidden')
    //dashboard_title_label.innerText = 'ATON MONITORING'
    tabulate_container.classList.remove('openwide')
}

//Custom filter example
function customFilter(data){
    return data.car && data.rating < 3;
}

//Trigger setFilter function with correct parameters
function updateFilter(){
    var filterVal = fieldEl.options[fieldEl.selectedIndex].value;
    var typeVal = typeEl.options[typeEl.selectedIndex].value;
  
    var filter = filterVal == "function" ? customFilter : filterVal;
  
    if(filterVal == "function" ){
      typeEl.disabled = true;
      valueEl.disabled = true;
    }else{
      typeEl.disabled = false;
      valueEl.disabled = false;
    }
  
    if(filterVal){
      analytic_table.setFilter(filter,typeVal, valueEl.value);
    }
  }

meas_dist_func.addEventListener('click', () => {
    // trigger distance measurement
    if (meas_dist_func.classList.contains('distance-bar-deactive')){
        meas_dist_func.classList.remove('distance-bar-deactive')
        meas_dist_func.classList.add('distance-bar-active')

        // distance measurement - data source
        map.addSource('geojson', {
            'type': 'geojson',
            'data': geojson
        });

        // distance measurement - add styles to the map
        map.addLayer({
            id: 'measure-points',
            type: 'circle',
            source: 'geojson',
            paint: {
                'circle-radius': 3,
                'circle-color': '#ffff66'
            },
            filter: ['in', '$type', 'Point']
        });   

        map.addLayer({
            id: 'measure-lines',
            type: 'line',
            source: 'geojson',
            layout: {
                'line-cap': 'round',
                'line-join': 'round'
            },
            paint: {
                'line-color': '#ffff66',
                'line-width': 1.5
            },
            filter: ['in', '$type', 'LineString']
        });        
        
        map.on('mousemove', measurementMousemove); 
        map.on('click', measurementVesselDistance);
    }
    else {
        meas_dist_func.classList.remove('distance-bar-active')
        meas_dist_func.classList.add('distance-bar-deactive')

        map.off('click', measurementVesselDistance);
        map.off('mousemove', measurementMousemove); 

        // distance measurement - add styles to the map
        map.removeLayer('measure-lines');  
        map.removeLayer('measure-points');  

        // distance measurement - data source
        map.removeSource('geojson');  
        geojson.features = []

        meas_dist.value = "Meas. Distance:       "  + " km /       " + " NM"
        map.getCanvas().style.cursor = 'grab'
    }
})


function measurementVesselDistance(e) {
    const features = map.queryRenderedFeatures(e.point, {
        layers: ['measure-points']
    });
         
    // Remove the linestring from the group
    // so we can redraw it based on the points collection.
    if (geojson.features.length > 1) geojson.features.pop();
         
    // If a feature was clicked, remove it from the map.
    if (features.length) {
        const id = features[0].properties.id;
        geojson.features = geojson.features.filter(
            (point) => point.properties.id !== id
        );
    } 
    else {
        const point = {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [e.lngLat.lng, e.lngLat.lat]
            },
            'properties': {
                'id': String(new Date().getTime())
            }
        };
         
        geojson.features.push(point);
    }
         
    if (geojson.features.length > 1) {
        linestring.geometry.coordinates = geojson.features.map(
            (point) => point.geometry.coordinates
        );
         
        geojson.features.push(linestring);
         
        // Populate the distanceContainer with total distance
        const value = document.createElement('pre');
        const distance = turf.length(linestring);

        nm = distance.toLocaleString() * 0.54
        meas_dist.value = "Meas. Distance: " + distance.toLocaleString() + " km / " + nm.toFixed(5) + " NM"
    }
         
    map.getSource('geojson').setData(geojson);    
}

function measurementMousemove(e) {
    const features = map.queryRenderedFeatures(e.point, {
        layers: ['measure-points']
    });
    // Change the cursor to a pointer when hovering over a point on the map.
    // Otherwise cursor is a crosshair.
    map.getCanvas().style.cursor = features.length ? 'pointer' : 'crosshair';
}

function searchVessel(mmsi){
    get_mmsi = undefined

    if (isNaN(mmsi) === false) {
        get_mmsi = lst_vessel[mmsi]
    }
    else {
        var keys = Object.keys(lst_atoninfo);

        for (let i = 0; i < keys.length; i++) {
            key = keys[i]
            aton = lst_atoninfo[key]
            atonName = aton.atonname.toLowerCase()     
            
            if (atonName.includes(mmsi.toLowerCase())){
                mmsi = aton.mmsi
                get_mmsi = lst_vessel[mmsi]
                break
            }
        }
    }

    if (get_mmsi != undefined){
        setFocusVessel(mmsi)

        posData = get_mmsi.getLngLat()
        map.flyTo({
            center: posData,
            zoom: 10,
            duration: 3000,
            essential: true // this animation is considered essential with respect to prefers-reduced-motion
        });
    }
}


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
    p_span1.className = "menu-item bg-green"
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

        if (elemid_text[0] == 'sp6'){
            lst_voltdata = []
            ws2.send('getallatonvoltdata:' + elemid_text[1])
        }

        if (elemid_text[0] == 'sp7'){
            lst_voltdata = []
            ws2.send('getallatonbeatdata:' + elemid_text[1])
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

    const ambient = ['No LDR', 'Dark', 'Dim', 'Bright']
    const lightstatus = ['No Light', 'Light ON', 'Light OFF', 'Light Error']

    if (!toggleBtn.classList.contains('open')) {
        const description = '<div class="text-gray-900"><h4 class="font-bold">' + elemid_text[1] + '</h4>' +
                            '<small> Structure &nbsp;: ' + get_atoninfo['type'] + '</small><br>' +
                            '<small> Name &nbsp;: ' + get_atoninfo['atonname'] + '</small><br>' +
                            '<small> Region &nbsp;: ' + get_atoninfo['region']  + '</small><br>' +
                            '<small> Latitude &nbsp;: ' + coordinates.lat.toFixed(6) + '</small><br>' +
                            '<small> Longitude &nbsp;: ' + coordinates.lng.toFixed(6) + '</small><br>' +
                            '<small> ATON Batt &nbsp;: ' + get_atoninfo['volt_int'].toFixed(2)  + '</small><br>' +
                            '<small> Lantern Batt &nbsp;: ' + get_atoninfo['volt_ex1'].toFixed(2)  + '</small><br>' +
                            '<small> Off Position &nbsp;: ' + (get_atoninfo['off_pos'] == 0 ? 'OK' : 'NG')  + '</small><br>' +
                            '<small> Ambient &nbsp;: ' + ambient[get_atoninfo['ambient']]  + '</small><br>' +
                            '<small> Light &nbsp;: ' + lightstatus[get_atoninfo['light']]  + '</small><br>' +
                            '<small> local Time &nbsp;: ' + get_atoninfo['lcl_ts'] + '</small><br>' +
                            '<small> UTC Time &nbsp;: ' + get_atoninfo['ts'] + '</small></div>'
       
        popup.setLngLat(coordinates).setHTML(description).addTo(map);
    }
}

function removeVesselPopup(e) {
    popup.remove();
}

function vessel_info_panel(mmsi){
    const ambient = ["No LDR", "Dark", "Dim", "Bright"]
    const lantern = ["No Monitoring", "Primary", "secandary", "Emergency"]
    const lantern_batt = ["Unknown", "Bad", "Low", "Good"]
    const racon = ["Not Installed", "Not Monitor", "Operating", "Error"]
    const light = ["Not Installed", "Light ON", "Light OFF", "Error"]

    get_atoninfo = lst_atoninfo[mmsi]   // data from message 21
    //get_atonData = lst_atonData[mmsi]   // data from message 6
    console.log(get_atoninfo)

    rms = false;
    elems = document.querySelectorAll('.aton-detail-info')

    elems.forEach((item) => {
        if (!item.classList.contains('hide-container')){
            item.classList.add('hide-container')
        }
    })

    const detMMSI_title = document.getElementById('det-mmsi-title')
    detMMSI_title.innerText = ": " + get_atoninfo['mmsi'] 

    if (rms){
        const panelId = document.getElementById('aton-info')
        panelId.classList.remove('hide-container')

        const detShiptype = document.getElementById('det-atontype')
        const detShipname = document.getElementById('det-atonname')
        const detMMSI = document.getElementById('det-atonmmsi')
        const detRegion = document.getElementById('det-atonregion')

        const det_aidType = document.getElementById('det-aidType')
        const det_aidTypeDesc = document.getElementById('det-aidTypeDesc')
        const det_aidName = document.getElementById('det-aidName')
        const det_positionAccuracyDesc = document.getElementById('det-positionAccuracyDesc')
        const det_longitude = document.getElementById('det-longitude')
        const det_latitude = document.getElementById('det-latitude')
        const det_to_bow = document.getElementById('det-to-bow')
        const det_to_stern = document.getElementById('det-to-stern')
        const det_to_port = document.getElementById('det-to-port')
        const det_to_starboard = document.getElementById('det-to-starboard')
        const det_epfdDesc = document.getElementById('det-epfdDesc')
        const det_utc_second = document.getElementById('det-utc-second')
        const det_off_position = document.getElementById('det-off-position')
        const det_regional = document.getElementById('det-regional')
        const det_raimFlag = document.getElementById('det-raimFlag')
        const det_virtualAid = document.getElementById('det-virtualAid')
        const det_assigned = document.getElementById('det-assigned')

        detShiptype.innerText = ": " + get_atoninfo['type']
        detShipname.innerText = ": " + get_atoninfo['atonname']
        detMMSI.innerText = ": " + get_atoninfo['mmsi']  
        detRegion.innerText = ": " + get_atoninfo['region']  

        det_aidType.innerText = ": " + get_atoninfo['aidType']  
        det_aidTypeDesc.innerText = ": " + get_atoninfo['aidTypeDesc']  
        det_aidName.innerText = ": " + get_atoninfo['aidName']  
        det_positionAccuracyDesc.innerText = ": " + get_atoninfo['positionAccuracyDesc']  
        det_longitude.innerText = ": " + get_atoninfo['longitude']  
        det_latitude.innerText = ": " + get_atoninfo['latitude']  
        det_to_bow.innerText = ": " + get_atoninfo['to_bow']  
        det_to_stern.innerText = ": " + get_atoninfo['to_stern']  
        det_to_port.innerText = ": " + get_atoninfo['to_port']  
        det_to_starboard.innerText = ": " + get_atoninfo['to_starboard']  
        det_epfdDesc.innerText = ": " + get_atoninfo['epfdDesc']  
        det_utc_second.innerText = ": " + get_atoninfo['utc_second']  
        det_off_position.innerText = ": " + get_atoninfo['off_position']  
        det_regional.innerText = ": " + get_atoninfo['regional']  
        det_raimFlag.innerText = ": " + get_atoninfo['raimFlag']  
        det_virtualAid.innerText = ": " + get_atoninfo['virtualAid']  
        det_assigned.innerText = ": " + get_atoninfo['assigned']  
    }
    else {
        dac = get_atoninfo['dac']
        fid = get_atoninfo['fid'] 

        if ((dac == 533 && fid == 1) || (dac == 235 && fid == 10)){
            const panelId = document.getElementById('dac533-fid1')
            panelId.classList.remove('hide-container')

            const detShiptype = document.getElementById('det-shiptype-fid1')
            const detShipname = document.getElementById('det-shipname-fid1')
            const detMMSI = document.getElementById('det-mmsi-fid1')
            const detLastSeen = document.getElementById('det-lastseen-fid1')
            const detLongitude = document.getElementById('det-longitude-fid1')
            const detLatitude = document.getElementById('det-latitude-fid1')

            const det_voltage_int = document.getElementById('det-voltage-int-fid1')
            const det_voltage_ext1 = document.getElementById('det-voltage-ext1-fid1')
            const det_thermal_temp = document.getElementById('det-thermal-temp-fid1')

            const det_racon = document.getElementById('det-racon-fid1')
            const det_light = document.getElementById('det-light-fid1')
            const det_health = document.getElementById('det-health-fid1')
        
            const det_beat = document.getElementById('det-beat-fid1')
            const det_alarm_active = document.getElementById('det-alarm-active-fid1')
            const det_buoy_led_power = document.getElementById('det-buoy-led-power-fid1')
            const det_buoy_low_vin = document.getElementById('det-buoy-low-vin-fid1')
            const det_buoy_photocell = document.getElementById('det-buoy-photocell-fid1')
            const det_buoy_temp = document.getElementById('det-buoy-temp-fid1')

            detShiptype.innerText = ": " + get_atoninfo['type']
            detShipname.innerText = ": " + (get_atoninfo['atonname'].length > 15 ? get_atoninfo['atonname'].substring(0, 15) + '...' : get_atoninfo['atonname'])
            detMMSI.innerText = ": " + get_atoninfo['mmsi']  
            detLastSeen.innerText = ": " + get_atoninfo['lcl_ts'] 
            detLongitude.innerText = ": " + get_atoninfo['ss_longitude'].toFixed(6) 
            detLatitude.innerText = ": " + get_atoninfo['ss_latitude'].toFixed(6)

            det_voltage_int.innerText = ": " + get_atoninfo['volt_int'].toFixed(6)
            det_voltage_ext1.innerText = ": " + get_atoninfo['volt_ex1'].toFixed(6)
            det_thermal_temp.innerText = ": " + get_atoninfo['volt_ex2'].toFixed(6)

            det_racon.innerText = ": " + racon[get_atoninfo['racon']]
            det_light.innerText = ": " + light[get_atoninfo['light']]
            det_health.innerText = ": " + (get_atoninfo['health'] == 0 ? "Good" : "Alarm")
        
            det_beat.innerText = ": " + (get_atoninfo['beat'] == 0 ? "Tick" : "Tock")
            det_alarm_active.innerText = ": " + lantern_batt[get_atoninfo['buoy_led_power']]
            det_buoy_led_power.innerText = ": " + lantern[get_atoninfo['buoy_low_vin']]
            det_buoy_low_vin.innerText = ": " + ambient[get_atoninfo['ambient']]
            det_buoy_photocell.innerText = ": " + (get_atoninfo['buoy_photocell'] == 0 ? "Close" : "Open")
            det_buoy_temp.innerText = ": " + (get_atoninfo['off_pos'] == 0 ? "On Pos." : "Off Pos.")
        }

        if (dac == 533 && fid == 2){
            const panelId = document.getElementById('dac533-fid2')
            panelId.classList.remove('hide-container')

            const detShiptype = document.getElementById('det-shiptype-fid2')
            const detShipname = document.getElementById('det-shipname-fid2')
            const detMMSI = document.getElementById('det-mmsi-fid2')
            const detLastSeen = document.getElementById('det-lastseen-fid2')
            const detLongitude = document.getElementById('det-longitude-fid2')
            const detLatitude = document.getElementById('det-latitude-fid2')

            const det_voltage_int = document.getElementById('det-voltage-int-fid2')
            const det_voltage_ext1 = document.getElementById('det-voltage-ext1-fid2')
            const det_thermal_temp = document.getElementById('det-thermal-temp-fid2')
            const det_off_pos = document.getElementById('det-off-pos-fid2')
            const det_ldr = document.getElementById('det-ldr-fid2')
            const det_racon = document.getElementById('det-racon-fid2')
            const det_light = document.getElementById('det-light-fid2')
            const det_health = document.getElementById('det-health-fid2')
        
            const det_beat = document.getElementById('det-beat-fid2')
            const det_alarm_active = document.getElementById('det-alarm-active-fid2')
            const det_buoy_led_power = document.getElementById('det-buoy-led-power-fid2')
            const det_buoy_low_vin = document.getElementById('det-buoy-low-vin-fid2')
            const det_buoy_photocell = document.getElementById('det-buoy-photocell-fid2')
            const det_buoy_temp = document.getElementById('det-buoy-temp-fid2')
            const det_buoy_force_off = document.getElementById('det-buoy-force-off-fid2')
            const det_buoy_islight = document.getElementById('det-buoy-islight-fid2')
            const det_buoy_errled_short = document.getElementById('det-buoy-errled-short-fid2')
            const det_buoy_errled_open = document.getElementById('det-buoy-errled-open-fid2')
            const det_buoy_errled_voltlow = document.getElementById('det-buoy-errled-voltlow-fid2')
            const det_buoy_errled_vinlow = document.getElementById('det-buoy-errled-vinlow-fid2')
            const det_buoy_errled_power = document.getElementById('det-buoy-errled-power-fid2')
            const det_buoy_adjmaxpower = document.getElementById('det-buoy-adjmaxpower-fid2')


            detShiptype.innerText = ": " + get_atoninfo['type']
            detShipname.innerText = ": " + (get_atoninfo['atonname'].length > 15 ? get_atoninfo['atonname'].substring(0, 15) + '...' : get_atoninfo['atonname'])
            detMMSI.innerText = ": " + get_atoninfo['mmsi']  
            detLastSeen.innerText = ": " + get_atoninfo['lcl_ts']  
            detLongitude.innerText = ": " + get_atoninfo['ss_longitude'].toFixed(6) 
            detLatitude.innerText = ": " + get_atoninfo['ss_latitude'].toFixed(6)

            det_voltage_int.innerText = ": " + get_atoninfo['volt_int'].toFixed(6)
            det_voltage_ext1.innerText = ": " + get_atoninfo['volt_ex1'].toFixed(6)
            det_thermal_temp.innerText = ": " + get_atoninfo['volt_ex2'].toFixed(6)
            det_off_pos.innerText = ": " + (get_atoninfo['off_pos'] == 0 ? "On Pos." : "Off Pos.")
            det_ldr.innerText = ": " + ambient[get_atoninfo['ambient']]
            det_racon.innerText = ": " + racon[get_atoninfo['racon']]
            det_light.innerText = ": " + light[get_atoninfo['light']]
            det_health.innerText = ": " + (get_atoninfo['health'] == 0 ? "Good" : "Alarm")
        
            det_beat.innerText = ": " + (get_atoninfo['beat'] == 0 ? "Tick" : "Tock")
            det_alarm_active.innerText = ": " + (get_atoninfo['alarm_active'] == 0 ? "Normal" : "Fail")
            det_buoy_led_power.innerText = ": " + (get_atoninfo['buoy_led_power'] == 0 ? "Off" : "On")
            det_buoy_low_vin.innerText = ": " + (get_atoninfo['buoy_low_vin'] == 0 ? "Normal" : "Fail")
            det_buoy_photocell.innerText = ": " + (get_atoninfo['buoy_photocell'] == 0 ? "Off" : "On")
            det_buoy_temp.innerText = ": " + (get_atoninfo['buoy_temp'] == 0 ? "Normal" : "Fail")
            det_buoy_force_off.innerText = ": " + (get_atoninfo['buoy_force_off'] == 0 ? "Off" : "On")
            det_buoy_islight.innerText = ": " + (get_atoninfo['buoy_islight'] == 0 ? "Off" : "On")
            det_buoy_errled_short.innerText = ": " + (get_atoninfo['buoy_errled_short'] == 0 ? "Normal" : "Fail")
            det_buoy_errled_open.innerText = ": " + (get_atoninfo['buoy_errled_open'] == 0 ? "Off" : "On")
            det_buoy_errled_voltlow.innerText = ": " + (get_atoninfo['buoy_errled_voltlow'] == 0 ? "Normal" : "Fail")
            det_buoy_errled_vinlow.innerText = ": " + (get_atoninfo['buoy_errled_vinlow'] == 0 ? "Close" : "Open")
            det_buoy_errled_power.innerText = ": " + (get_atoninfo['buoy_errled_power'] == 0 ? "Off" : "On")
            det_buoy_adjmaxpower.innerText = ": " + (get_atoninfo['buoy_adjmaxpower'] == 0 ? "Normal" : "Fail")          
        }

        if (dac == 533 && fid == 4){
            const panelId = document.getElementById('dac533-fid4')
            panelId.classList.remove('hide-container')

            const detShiptype = document.getElementById('det-shiptype')
            const detShipname = document.getElementById('det-shipname')
            const detMMSI = document.getElementById('det-mmsi')

            const det_voltage_int = document.getElementById('det-voltage-int')
            const det_voltage_ext1 = document.getElementById('det-voltage-ext1')
            const det_thermal_temp = document.getElementById('det-thermal-temp')
            const det_off_pos = document.getElementById('det-off-pos')
            const det_ldr = document.getElementById('det-ldr')
            const det_racon = document.getElementById('det-racon')
            const det_light = document.getElementById('det-light')
            const det_health = document.getElementById('det-health')
        
            const det_beat = document.getElementById('det-beat')
            const det_alarm_active = document.getElementById('det-alarm-active')
            const det_buoy_led_power = document.getElementById('det-buoy-led-power')
            const det_buoy_low_vin = document.getElementById('det-buoy-low-vin')
            const det_buoy_photocell = document.getElementById('det-buoy-photocell')
            const det_buoy_temp = document.getElementById('det-buoy-temp')
            const det_buoy_force_off = document.getElementById('det-buoy-force-off')
            const det_buoy_islight = document.getElementById('det-buoy-islight')
            const det_buoy_errled_short = document.getElementById('det-buoy-errled-short')
            const det_buoy_errled_open = document.getElementById('det-buoy-errled-open')
            const det_buoy_errled_voltlow = document.getElementById('det-buoy-errled-voltlow')
            const det_buoy_errled_vinlow = document.getElementById('det-buoy-errled-vinlow')
            const det_buoy_errled_power = document.getElementById('det-buoy-errled-power')
            const det_buoy_adjmaxpower = document.getElementById('det-buoy-adjmaxpower')
            const det_buoy_sensor_interrupt = document.getElementById('det-buoy-sensor-interrupt')
            const det_buoy_solarcharging = document.getElementById('det-buoy-solarcharging')


            detShiptype.innerText = ": " + get_atoninfo['type']
            detShipname.innerText = ": " + get_atoninfo['atonname']
            detMMSI.innerText = ": " + get_atoninfo['mmsi']  

            det_voltage_int.innerText = ": " + get_atoninfo['volt_int'].toFixed(6)
            det_voltage_ext1.innerText = ": " + get_atoninfo['volt_ex1'].toFixed(6)
            det_thermal_temp.innerText = ": " + get_atoninfo['volt_ex2'].toFixed(6)
            det_off_pos.innerText = ": " + (get_atoninfo['off_pos'] == 0 ? "On Pos." : "Off Pos.")
            det_ldr.innerText = ": " + ambient[get_atoninfo['ambient']]
            det_racon.innerText = ": " + racon[get_atoninfo['racon']]
            det_light.innerText = ": " + light[get_atoninfo['light']]
            det_health.innerText = ": " + (get_atoninfo['health'] == 0 ? "Good" : "Alarm")
        
            det_beat.innerText = ": " + (get_atoninfo['beat'] == 0 ? "Tick" : "Tock")
            det_alarm_active.innerText = ": " + (get_atoninfo['alarm_active'] == 0 ? "No" : "Yes")
            det_buoy_led_power.innerText = ": " + (get_atoninfo['buoy_led_power'] == 0 ? "No" : "Yes")
            det_buoy_low_vin.innerText = ": " + (get_atoninfo['buoy_low_vin'] == 0 ? "No" : "Yes")
            det_buoy_photocell.innerText = ": " + (get_atoninfo['buoy_photocell'] == 0 ? "No" : "Yes")
            det_buoy_temp.innerText = ": " + (get_atoninfo['buoy_temp'] == 0 ? "No" : "Yes")
            det_buoy_force_off.innerText = ": " + (get_atoninfo['buoy_force_off'] == 0 ? "No" : "Yes")
            det_buoy_islight.innerText = ": " + (get_atoninfo['buoy_islight'] == 0 ? "No" : "Yes")
            det_buoy_errled_short.innerText = ": " + (get_atoninfo['buoy_errled_short'] == 0 ? "No" : "Yes")
            det_buoy_errled_open.innerText = ": " + (get_atoninfo['buoy_errled_open'] == 0 ? "No" : "Yes")
            det_buoy_errled_voltlow.innerText = ": " + (get_atoninfo['buoy_errled_voltlow'] == 0 ? "No" : "Yes")
            det_buoy_errled_vinlow.innerText = ": " + (get_atoninfo['buoy_errled_vinlow'] == 0 ? "No" : "Yes")
            det_buoy_errled_power.innerText = ": " + (get_atoninfo['buoy_errled_power'] == 0 ? "No" : "Yes")
            det_buoy_adjmaxpower.innerText = ": " + (get_atoninfo['buoy_adjmaxpower'] == 0 ? "No" : "Yes")
            det_buoy_sensor_interrupt.innerText = ": " + (get_atoninfo['buoy_sensor_interrupt'] == 0 ? "No" : "Yes")
            det_buoy_solarcharging.innerText = ": " + (get_atoninfo['buoy_solarcharging'] == 0 ? "No" : "Yes")            
        }

    }
}

function summary_details(obj) {
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

function compute_summary_details(atonInfo, data){
    data.atons_cnt += 1
    
    if (atonInfo['aa_rowcountby_mmsi'] == 0) {
        data.no_msg6_cnt += 1 
        lst_no_msg6[atonInfo['mmsi']] = atonInfo
    }
    if (atonInfo['light'] == 3){
        data.light_err_cnt += 1
        lst_light_err[atonInfo['mmsi']] = atonInfo
    }
    if (atonInfo['volt_int'] < 12.0) {
        data.battAton_cnt += 1
        lst_battAton_ng[atonInfo['mmsi']] = atonInfo
    }
    if (atonInfo['volt_ex1'] < 12.0) {
        data.battLant_cnt += 1
        lst_battLant_ng[atonInfo['mmsi']] = atonInfo
    }
    if (atonInfo['off_pos'] != 0) {
        data.offpos_cnt += 1
        lst_offpos_ng[atonInfo['mmsi']] = atonInfo
    }
    if (atonInfo['ambient'] == 0) {
        data.ldr_cnt += 1
        lst_ldr_ng[atonInfo['mmsi']] = atonInfo
    }

    return data
}



function cal_summary_details() {
    let summary_data = {
        atons_cnt: 0,
        light_err_cnt: 0,
        battAton_cnt: 0,
        battLant_cnt: 0,
        offpos_cnt: 0,
        ldr_cnt: 0,
        no_msg6_cnt: 0,
    }

    lst_light_err = {};
    lst_battAton_ng = {};
    lst_battLant_ng = {};
    lst_offpos_ng = {};
    lst_ldr_ng = {};
    lst_no_msg6 = {};


    if (chk_select_beacon.checked && chk_select_buoy.checked && chk_select_lighthouse.checked && rad_aton_all.checked) {
        summary_details(summary_det)

        for (let i in lst_atoninfo){
            atonInfo = lst_atoninfo[i]
            summary_data = compute_summary_details(atonInfo, summary_data)
        }   
    }
    else {
        if (chk_select_beacon.checked && chk_select_buoy.checked && chk_select_lighthouse.checked && rad_aton_ok.checked) {
            for (let i in lst_atoninfo) {
                atonInfo = lst_atoninfo[i]
    
                if (atonInfo['status'] == 1) {
                    summary_data = compute_summary_details(atonInfo, summary_data)
                }
            }

            for (let i in lst_ngatoninfo) {
                atonInfo = lst_ngatoninfo[i]
    
                if (atonInfo['status'] == 1) {
                    summary_data = compute_summary_details(atonInfo, summary_data)
                }
            }
        }      

        if (chk_select_beacon.checked && chk_select_buoy.checked && chk_select_lighthouse.checked && rad_aton_ng.checked) {
            for (let i in lst_atoninfo) {
                atonInfo = lst_atoninfo[i]

                if (atonInfo['status'] == 0) {
                    summary_data = compute_summary_details(atonInfo, summary_data)
                }
            }

            for (let i in lst_ngatoninfo) {
                atonInfo = lst_ngatoninfo[i]

                if (atonInfo['status'] == 0) {
                    summary_data = compute_summary_details(atonInfo, summary_data)
                }
            }            
        }  
        
        /// ok
        if (chk_select_beacon.checked && chk_select_buoy.checked && !chk_select_lighthouse.checked && rad_aton_ok.checked) {
            for (let i in lst_atoninfo) {
                atonInfo = lst_atoninfo[i]
    
                if (atonInfo['status'] == 1 && (atonInfo['type'].toLowerCase() == 'beacon' || atonInfo['type'].toLowerCase() == 'buoy')) {
                    summary_data = compute_summary_details(atonInfo, summary_data)
                }
            }

            for (let i in lst_ngatoninfo) {
                atonInfo = lst_ngatoninfo[i]
    
                if (atonInfo['status'] == 1 && (atonInfo['type'].toLowerCase() == 'beacon' || atonInfo['type'].toLowerCase() == 'buoy')) {
                    summary_data = compute_summary_details(atonInfo, summary_data)
                }
            }
        }  
        
        if (chk_select_beacon.checked && !chk_select_buoy.checked && chk_select_lighthouse.checked && rad_aton_ok.checked) {
            for (let i in lst_atoninfo) {
                atonInfo = lst_atoninfo[i]
    
                if (atonInfo['status'] == 1 && (atonInfo['type'].toLowerCase() == 'beacon' || atonInfo['type'].toLowerCase() == 'lighthouse')) {
                    summary_data = compute_summary_details(atonInfo, summary_data)
                }
            }

            for (let i in lst_ngatoninfo) {
                atonInfo = lst_ngatoninfo[i]
    
                if (atonInfo['status'] == 1 && (atonInfo['type'].toLowerCase() == 'beacon' || atonInfo['type'].toLowerCase() == 'lighthouse')) {
                    summary_data = compute_summary_details(atonInfo, summary_data)
                }
            }
        } 
        
        if (chk_select_beacon.checked && !chk_select_buoy.checked && !chk_select_lighthouse.checked && rad_aton_ok.checked) {
            for (let i in lst_atoninfo) {
                atonInfo = lst_atoninfo[i]
    
                if (atonInfo['status'] == 1 && atonInfo['type'].toLowerCase() == 'beacon') {
                    summary_data = compute_summary_details(atonInfo, summary_data)
                }
            }

            for (let i in lst_ngatoninfo) {
                atonInfo = lst_ngatoninfo[i]
    
                if (atonInfo['status'] == 1 && atonInfo['type'].toLowerCase() == 'beacon') {
                    summary_data = compute_summary_details(atonInfo, summary_data)
                }
            }
        } 
        
        if (!chk_select_beacon.checked && chk_select_buoy.checked && chk_select_lighthouse.checked && rad_aton_ok.checked) {
            for (let i in lst_atoninfo) {
                atonInfo = lst_atoninfo[i]
    
                if (atonInfo['status'] == 1 && (atonInfo['type'].toLowerCase() == 'buoy' || atonInfo['type'].toLowerCase() == 'lighthouse')) {
                    summary_data = compute_summary_details(atonInfo, summary_data)
                }
            }

            for (let i in lst_ngatoninfo) {
                atonInfo = lst_ngatoninfo[i]
    
                if (atonInfo['status'] == 1 && (atonInfo['type'].toLowerCase() == 'buoy' || atonInfo['type'].toLowerCase() == 'lighthouse')) {
                    summary_data = compute_summary_details(atonInfo, summary_data)
                }
            }
        }          

        if (!chk_select_beacon.checked && chk_select_buoy.checked && !chk_select_lighthouse.checked && rad_aton_ok.checked) {
            for (let i in lst_atoninfo) {
                atonInfo = lst_atoninfo[i]
    
                if (atonInfo['status'] == 1 && atonInfo['type'].toLowerCase() == 'buoy') {
                    summary_data = compute_summary_details(atonInfo, summary_data)
                }
            }

            for (let i in lst_ngatoninfo) {
                atonInfo = lst_ngatoninfo[i]
    
                if (atonInfo['status'] == 1 && atonInfo['type'].toLowerCase() == 'buoy') {
                    summary_data = compute_summary_details(atonInfo, summary_data)
                }
            }
        }  

        if (!chk_select_beacon.checked && !chk_select_buoy.checked && chk_select_lighthouse.checked && rad_aton_ok.checked) {
            for (let i in lst_atoninfo) {
                atonInfo = lst_atoninfo[i]
    
                if (atonInfo['status'] == 1 && atonInfo['type'].toLowerCase() == 'lighthouse') {
                    summary_data = compute_summary_details(atonInfo, summary_data)
                }
            }

            for (let i in lst_ngatoninfo) {
                atonInfo = lst_ngatoninfo[i]
    
                if (atonInfo['status'] == 1 && atonInfo['type'].toLowerCase() == 'lighthouse') {
                    summary_data = compute_summary_details(atonInfo, summary_data)
                }
            }
        }  

        /// ng
        if (chk_select_beacon.checked && chk_select_buoy.checked && !chk_select_lighthouse.checked && rad_aton_ng.checked) {
            for (let i in lst_atoninfo) {
                atonInfo = lst_atoninfo[i]
    
                if (atonInfo['status'] == 0 && (atonInfo['type'].toLowerCase() == 'beacon' || atonInfo['type'].toLowerCase() == 'buoy')) {
                    summary_data = compute_summary_details(atonInfo, summary_data)
                }
            }

            for (let i in lst_ngatoninfo) {
                atonInfo = lst_ngatoninfo[i]
    
                if (atonInfo['status'] == 0 && (atonInfo['type'].toLowerCase() == 'beacon' || atonInfo['type'].toLowerCase() == 'buoy')) {
                    summary_data = compute_summary_details(atonInfo, summary_data)
                }
            }
        }  
        
        if (chk_select_beacon.checked && !chk_select_buoy.checked && chk_select_lighthouse.checked && rad_aton_ng.checked) {
            for (let i in lst_atoninfo) {
                atonInfo = lst_atoninfo[i]
    
                if (atonInfo['status'] == 0 && (atonInfo['type'].toLowerCase() == 'beacon' || atonInfo['type'].toLowerCase() == 'lighthouse')) {
                    summary_data = compute_summary_details(atonInfo, summary_data)
                }
            }

            for (let i in lst_ngatoninfo) {
                atonInfo = lst_ngatoninfo[i]
    
                if (atonInfo['status'] == 0 && (atonInfo['type'].toLowerCase() == 'beacon' || atonInfo['type'].toLowerCase() == 'lighthouse')) {
                    summary_data = compute_summary_details(atonInfo, summary_data)
                }
            }
        } 
        
        if (chk_select_beacon.checked && !chk_select_buoy.checked && !chk_select_lighthouse.checked && rad_aton_ng.checked) {
            for (let i in lst_atoninfo) {
                atonInfo = lst_atoninfo[i]
    
                if (atonInfo['status'] == 0 && atonInfo['type'].toLowerCase() == 'beacon') {
                    summary_data = compute_summary_details(atonInfo, summary_data)
                }
            }

            for (let i in lst_ngatoninfo) {
                atonInfo = lst_ngatoninfo[i]
    
                if (atonInfo['status'] == 0 && atonInfo['type'].toLowerCase() == 'beacon') {
                    summary_data = compute_summary_details(atonInfo, summary_data)
                }
            }
        } 
        
        if (!chk_select_beacon.checked && chk_select_buoy.checked && chk_select_lighthouse.checked && rad_aton_ng.checked) {
            for (let i in lst_atoninfo) {
                atonInfo = lst_atoninfo[i]
    
                if (atonInfo['status'] == 0 && (atonInfo['type'].toLowerCase() == 'buoy' || atonInfo['type'].toLowerCase() == 'lighthouse')) {
                    summary_data = compute_summary_details(atonInfo, summary_data)
                }
            }

            for (let i in lst_ngatoninfo) {
                atonInfo = lst_ngatoninfo[i]
    
                if (atonInfo['status'] == 0 && (atonInfo['type'].toLowerCase() == 'buoy' || atonInfo['type'].toLowerCase() == 'lighthouse')) {
                    summary_data = compute_summary_details(atonInfo, summary_data)
                }
            }
        }          

        if (!chk_select_beacon.checked && chk_select_buoy.checked && !chk_select_lighthouse.checked && rad_aton_ng.checked) {
            for (let i in lst_atoninfo) {
                atonInfo = lst_atoninfo[i]
    
                if (atonInfo['status'] == 0 && atonInfo['type'].toLowerCase() == 'buoy') {
                    summary_data = compute_summary_details(atonInfo, summary_data)
                }
            }

            for (let i in lst_ngatoninfo) {
                atonInfo = lst_ngatoninfo[i]
    
                if (atonInfo['status'] == 0 && atonInfo['type'].toLowerCase() == 'buoy') {
                    summary_data = compute_summary_details(atonInfo, summary_data)
                }
            }
        }  

        if (!chk_select_beacon.checked && !chk_select_buoy.checked && chk_select_lighthouse.checked && rad_aton_ng.checked) {
            for (let i in lst_atoninfo) {
                atonInfo = lst_atoninfo[i]
    
                if (atonInfo['status'] == 0 && atonInfo['type'].toLowerCase() == 'lighthouse') {
                    summary_data = compute_summary_details(atonInfo, summary_data)
                }
            }

            for (let i in lst_ngatoninfo) {
                atonInfo = lst_ngatoninfo[i]
    
                if (atonInfo['status'] == 0 && atonInfo['type'].toLowerCase() == 'lighthouse') {
                    summary_data = compute_summary_details(atonInfo, summary_data)
                }
            }
        } 

        /// all
        if (chk_select_beacon.checked && chk_select_buoy.checked && !chk_select_lighthouse.checked && rad_aton_all.checked) {
            for (let i in lst_atoninfo) {
                atonInfo = lst_atoninfo[i]
    
                if (atonInfo['type'].toLowerCase() == 'beacon' || atonInfo['type'].toLowerCase() == 'buoy') {
                    summary_data = compute_summary_details(atonInfo, summary_data)
                }
            }

            for (let i in lst_ngatoninfo) {
                atonInfo = lst_ngatoninfo[i]
    
                if (atonInfo['type'].toLowerCase() == 'beacon' || atonInfo['type'].toLowerCase() == 'buoy') {
                    summary_data = compute_summary_details(atonInfo, summary_data)
                }
            }
        }  
        
        if (chk_select_beacon.checked && !chk_select_buoy.checked && chk_select_lighthouse.checked && rad_aton_all.checked) {
            for (let i in lst_atoninfo) {
                atonInfo = lst_atoninfo[i]
    
                if (atonInfo['type'].toLowerCase() == 'beacon' || atonInfo['type'].toLowerCase() == 'lighthouse') {
                    summary_data = compute_summary_details(atonInfo, summary_data)
                }
            }

            for (let i in lst_ngatoninfo) {
                atonInfo = lst_ngatoninfo[i]
    
                if (atonInfo['type'].toLowerCase() == 'beacon' || atonInfo['type'].toLowerCase() == 'lighthouse') {
                    summary_data = compute_summary_details(atonInfo, summary_data)
                }
            }
        } 
        
        if (chk_select_beacon.checked && !chk_select_buoy.checked && !chk_select_lighthouse.checked && rad_aton_all.checked) {
            for (let i in lst_atoninfo) {
                atonInfo = lst_atoninfo[i]
    
                if (atonInfo['type'].toLowerCase() == 'beacon') {
                    summary_data = compute_summary_details(atonInfo, summary_data)
                }
            }

            for (let i in lst_ngatoninfo) {
                atonInfo = lst_ngatoninfo[i]
    
                if (atonInfo['type'].toLowerCase() == 'beacon') {
                    summary_data = compute_summary_details(atonInfo, summary_data)
                }
            }
        } 
        
        if (!chk_select_beacon.checked && chk_select_buoy.checked && chk_select_lighthouse.checked && rad_aton_all.checked) {
            for (let i in lst_atoninfo) {
                atonInfo = lst_atoninfo[i]
    
                if (atonInfo['type'].toLowerCase() == 'buoy' || atonInfo['type'].toLowerCase() == 'lighthouse') {
                    summary_data = compute_summary_details(atonInfo, summary_data)
                }
            }

            for (let i in lst_ngatoninfo) {
                atonInfo = lst_ngatoninfo[i]
    
                if (atonInfo['type'].toLowerCase() == 'buoy' || atonInfo['type'].toLowerCase() == 'lighthouse') {
                    summary_data = compute_summary_details(atonInfo, summary_data)
                }
            }
        }          

        if (!chk_select_beacon.checked && chk_select_buoy.checked && !chk_select_lighthouse.checked && rad_aton_all.checked) {
            for (let i in lst_atoninfo) {
                atonInfo = lst_atoninfo[i]
    
                if (atonInfo['type'].toLowerCase() == 'buoy') {
                    summary_data = compute_summary_details(atonInfo, summary_data)
                }
            }

            for (let i in lst_ngatoninfo) {
                atonInfo = lst_ngatoninfo[i]
    
                if (atonInfo['type'].toLowerCase() == 'buoy') {
                    summary_data = compute_summary_details(atonInfo, summary_data)
                }
            }
        }  

        if (!chk_select_beacon.checked && !chk_select_buoy.checked && chk_select_lighthouse.checked && rad_aton_all.checked) {
            for (let i in lst_atoninfo) {
                atonInfo = lst_atoninfo[i]
    
                if (atonInfo['type'].toLowerCase() == 'lighthouse') {
                    summary_data = compute_summary_details(atonInfo, summary_data)
                }
            }

            for (let i in lst_ngatoninfo) {
                atonInfo = lst_ngatoninfo[i]
    
                if (atonInfo['type'].toLowerCase() == 'lighthouse') {
                    summary_data = compute_summary_details(atonInfo, summary_data)
                }
            }
        } 

        aton_summary = {
            'aton_cnt': summary_data.atons_cnt,
            'no_msg6_cnt': summary_data.no_msg6_cnt,
            'no_msg6_cnt_p': ((summary_data.no_msg6_cnt / summary_data.atons_cnt) * 100).toFixed(2) + '%',
            'light_cnt': summary_data.light_err_cnt,
            'light_cnt_p': (((summary_data.light_err_cnt) / summary_data.atons_cnt) * 100).toFixed(2) + '%',
            'battAton_cnt': summary_data.battAton_cnt,
            'battAton_cnt_p': (((summary_data.battAton_cnt) / summary_data.atons_cnt) * 100).toFixed(2) + '%',
            'battLant_cnt': summary_data.battLant_cnt,
            'battLant_cnt_p': (((summary_data.battLant_cnt) / summary_data.atons_cnt) * 100).toFixed(2) + '%',
            'offpos_cnt': summary_data.offpos_cnt,
            'offpos_cnt_p': (((summary_data.offpos_cnt) / summary_data.atons_cnt) * 100).toFixed(2) + '%',
            'ldr_cnt': summary_data.ldr_cnt,
            'ldr_cnt_p': (((summary_data.ldr_cnt) / summary_data.atons_cnt) * 100).toFixed(2) + '%',
        }
    
        summary_details(aton_summary)
    }

    if (selected_data_to_update_map == 0) {
        update_aton_on_map(update_aton_on_map0, selected_data_to_update_map)
    }
    else if (selected_data_to_update_map == 1) {
        update_aton_on_map(update_aton_on_map1, selected_data_to_update_map)
    }
    else if (selected_data_to_update_map == 2) {
        update_aton_on_map(update_aton_on_map3, selected_data_to_update_map)
    }
    else if (selected_data_to_update_map == 3) {
        update_aton_on_map(update_aton_on_map3, selected_data_to_update_map)
    }
    else if (selected_data_to_update_map == 4) {
        update_aton_on_map(update_aton_on_map4, selected_data_to_update_map)
    }
    else if (selected_data_to_update_map == 5) {
        update_aton_on_map(update_aton_on_map5, selected_data_to_update_map)
    }
    else if (selected_data_to_update_map == 6) {
        update_aton_on_map(update_aton_on_map6, selected_data_to_update_map)
    }
}



function update_aton_on_map(elem, dataNo) {
    update_aton_on_map0.children[1].classList.remove('selected-summary-elem-OK')
    update_aton_on_map1.children[1].classList.remove('selected-summary-elem-NG')
    update_aton_on_map2.children[1].classList.remove('selected-summary-elem-NG')
    update_aton_on_map3.children[1].classList.remove('selected-summary-elem-NG')
    update_aton_on_map4.children[1].classList.remove('selected-summary-elem-NG')
    update_aton_on_map5.children[1].classList.remove('selected-summary-elem-NG')
    update_aton_on_map6.children[1].classList.remove('selected-summary-elem-NG')


    if (dataNo === 0) {
        elem.children[1].classList.add('selected-summary-elem-OK')
    }
    else {
        elem.children[1].classList.add('selected-summary-elem-NG')
    }
    

    for (let i in lst_atoninfo) {
        atonInfo = lst_atoninfo[i]
        marker = lst_vessel[i]
        selected_aton = undefined

        if (dataNo === 1) {
            selected_aton =  lst_no_msg6[i]
        }
        else if (dataNo === 2) {
            selected_aton =  lst_light_err[i]
        }
        else if (dataNo === 3) {
            selected_aton =  lst_battAton_ng[i]
        }
        else if (dataNo === 4) {
            selected_aton =  lst_battLant_ng[i]
        }
        else if (dataNo === 5) {
            selected_aton =  lst_ldr_ng[i]
        }
        else if (dataNo === 6) {
            selected_aton =  lst_offpos_ng[i]
        }
        else if (dataNo === 0) {
            selected_aton =  atonInfo
        }
        
        
        if (selected_aton == undefined){
            marker.remove()
        }
        else{
            let chkElem = document.getElementById('vessels-on-sea_' + atonInfo['mmsi'])

            if (chkElem == null) {
                if (dataNo != 0){
                    marker.addTo(map)
                }
                else {
                    if (chk_select_beacon.checked && chk_select_buoy.checked && chk_select_lighthouse.checked && rad_aton_all.checked) {
                        if ((atonInfo['type'].toLowerCase() == 'beacon' || atonInfo['type'].toLowerCase() == 'buoy' || atonInfo['type'].toLowerCase() == 'lighthouse')){
                            marker.addTo(map)
                        }
                    }
                    else {
                        if (chk_select_beacon.checked && chk_select_buoy.checked && chk_select_lighthouse.checked && rad_aton_ok.checked) {
                            if (atonInfo['status'] == 1) {
                                marker.addTo(map)
                            }
                        }      
                
                        if (chk_select_beacon.checked && chk_select_buoy.checked && chk_select_lighthouse.checked && rad_aton_ng.checked) {
                            if (atonInfo['status'] == 0) {
                                marker.addTo(map)
                            }       
                        } 

                        /// ok
                        if (chk_select_beacon.checked && chk_select_buoy.checked && !chk_select_lighthouse.checked && rad_aton_ok.checked) {
                            if (atonInfo['status'] == 1 && (atonInfo['type'].toLowerCase() == 'beacon' || atonInfo['type'].toLowerCase() == 'buoy')) {
                                marker.addTo(map)
                            }
                        }  
                        
                        if (chk_select_beacon.checked && !chk_select_buoy.checked && chk_select_lighthouse.checked && rad_aton_ok.checked) {
                            if (atonInfo['status'] == 1 && (atonInfo['type'].toLowerCase() == 'beacon' || atonInfo['type'].toLowerCase() == 'lighthouse')) {
                                marker.addTo(map)
                            }
                        } 
                        
                        if (chk_select_beacon.checked && !chk_select_buoy.checked && !chk_select_lighthouse.checked && rad_aton_ok.checked) {
                            if (atonInfo['status'] == 1 && atonInfo['type'].toLowerCase() == 'beacon') {
                                marker.addTo(map)
                            }
                        } 
                        
                        if (!chk_select_beacon.checked && chk_select_buoy.checked && chk_select_lighthouse.checked && rad_aton_ok.checked) {
                            if (atonInfo['status'] == 1 && (atonInfo['type'].toLowerCase() == 'buoy' || atonInfo['type'].toLowerCase() == 'lighthouse')) {
                                marker.addTo(map)
                            }
                        }          

                        if (!chk_select_beacon.checked && chk_select_buoy.checked && !chk_select_lighthouse.checked && rad_aton_ok.checked) {
                            if (atonInfo['status'] == 1 && atonInfo['type'].toLowerCase() == 'buoy') {
                                marker.addTo(map)
                            }
                        }  

                        if (!chk_select_beacon.checked && !chk_select_buoy.checked && chk_select_lighthouse.checked && rad_aton_ok.checked) {
                            if (atonInfo['status'] == 1 && atonInfo['type'].toLowerCase() == 'lighthouse') {
                                marker.addTo(map)
                            }
                        } 
                        

                        /// ng
                        if (chk_select_beacon.checked && chk_select_buoy.checked && !chk_select_lighthouse.checked && rad_aton_ng.checked) {
                            if (atonInfo['status'] == 0 && (atonInfo['type'].toLowerCase() == 'beacon' || atonInfo['type'].toLowerCase() == 'buoy')) {
                                marker.addTo(map)
                            }
                        }  
                        
                        if (chk_select_beacon.checked && !chk_select_buoy.checked && chk_select_lighthouse.checked && rad_aton_ng.checked) {
                            if (atonInfo['status'] == 0 && (atonInfo['type'].toLowerCase() == 'beacon' || atonInfo['type'].toLowerCase() == 'lighthouse')) {
                                marker.addTo(map)
                            }
                        } 
                        
                        if (chk_select_beacon.checked && !chk_select_buoy.checked && !chk_select_lighthouse.checked && rad_aton_ng.checked) {
                            if (atonInfo['status'] == 0 && atonInfo['type'].toLowerCase() == 'beacon') {
                                marker.addTo(map)
                            }
                        } 
                        
                        if (!chk_select_beacon.checked && chk_select_buoy.checked && chk_select_lighthouse.checked && rad_aton_ng.checked) {
                            if (atonInfo['status'] == 0 && (atonInfo['type'].toLowerCase() == 'buoy' || atonInfo['type'].toLowerCase() == 'lighthouse')) {
                                marker.addTo(map)
                            }
                        }          

                        if (!chk_select_beacon.checked && chk_select_buoy.checked && !chk_select_lighthouse.checked && rad_aton_ng.checked) {
                            if (atonInfo['status'] == 0 && atonInfo['type'].toLowerCase() == 'buoy') {
                                marker.addTo(map)
                            }
                        }  

                        if (!chk_select_beacon.checked && !chk_select_buoy.checked && chk_select_lighthouse.checked && rad_aton_ng.checked) {
                            if (atonInfo['status'] == 0 && atonInfo['type'].toLowerCase() == 'lighthouse') {
                                marker.addTo(map)
                            }
                        } 
                        
                        
                        /// all
                        if (chk_select_beacon.checked && chk_select_buoy.checked && !chk_select_lighthouse.checked && rad_aton_all.checked) {
                            if (atonInfo['type'].toLowerCase() == 'beacon' || atonInfo['type'].toLowerCase() == 'buoy') {
                                marker.addTo(map)
                            }
                        }  
                        
                        if (chk_select_beacon.checked && !chk_select_buoy.checked && chk_select_lighthouse.checked && rad_aton_all.checked) {
                            if (atonInfo['type'].toLowerCase() == 'beacon' || atonInfo['type'].toLowerCase() == 'lighthouse') {
                                marker.addTo(map)
                            } 
                        }
                        
                        if (chk_select_beacon.checked && !chk_select_buoy.checked && !chk_select_lighthouse.checked && rad_aton_all.checked) {
                            if (atonInfo['type'].toLowerCase() == 'beacon') {
                                marker.addTo(map)
                            }
                        } 
                        
                        if (!chk_select_beacon.checked && chk_select_buoy.checked && chk_select_lighthouse.checked && rad_aton_all.checked) {
                            if (atonInfo['type'].toLowerCase() == 'buoy' || atonInfo['type'].toLowerCase() == 'lighthouse') {
                                marker.addTo(map)
                            }
                        }          

                        if (!chk_select_beacon.checked && chk_select_buoy.checked && !chk_select_lighthouse.checked && rad_aton_all.checked) {
                            if (atonInfo['type'].toLowerCase() == 'buoy') {
                                marker.addTo(map)
                            }
                        }  

                        if (!chk_select_beacon.checked && !chk_select_buoy.checked && chk_select_lighthouse.checked && rad_aton_all.checked) {
                            if (atonInfo['type'].toLowerCase() == 'lighthouse') {
                                marker.addTo(map)
                            }
                        }                         
                    }
                }
            }
        }
    }
}

/////////////////////////////////////////////////////////
// JavaScript example using WebSocket object
// Create a WebSocket object for historical data
/////////////////////////////////////////////////////////
// const ws2_URL = "ws://localhost:38381";
// const ws2_URL = "ws://10.10.20.200:38389";
// const ws2_URL = "ws://60.54.119.42:38389";
const ws2_URL = "wss://dash.datainsight.my/wss/";

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
        ws2.send('getatonmsgcount:')
        
        setInterval(() => {
            ws2.send('getatonmsgcount:')
        }, 30000)
    });

    // Add an event listener for when a message is received from the server
    ws2.addEventListener("message", function(event) {
        let obj = JSON.parse(event.data);

        if (obj['payload'] === 'getatoninitialcount') {
            summary_details(obj)
            summary_det = JSON.parse(event.data);
            cal_summary_details()
        }

        if (obj['payload'] === 'getallaton') {
            if (obj['ss_messageType'] == 21 && obj['ss_rowcountby_mmsi'] > 0) {
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
                        // el.style.zIndex = 100
        
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
                else
                {
                    mmsi = obj['mmsi']
                    get_ngaton = lst_ngatoninfo[mmsi]
        
                    if (get_ngaton === undefined){
                        lst_ngatoninfo[mmsi] = obj
                    }
                }   
            }
            else {
                mmsi = obj['mmsi']
                get_ngaton = lst_ngatoninfo[mmsi]
        
                if ( get_ngaton === undefined){
                    lst_ngatoninfo[mmsi] = obj
                }                
            }
        }

        if (obj['payload'] === 'getatonstatistic') {
            lst_statistic.push(obj) 
        }

        if (obj['payload'] === 'getatonstatistic_done') {
            analytic_table = build_tabulator_table(lst_statistic)

            analytic_table.on("rowDblClick", function(e, row){
                //e - the click event object
                //cell - cell component
                rowData = row.getData()
                lst_voltdata = []
                ws2.send('getallatonvoltdata:' + rowData.al_mmsi)
            });
        } 

        if (obj['payload'] === 'getdailystatisticstartfrom') {
            lst_statistic_daily.push(obj) 
        }

        if (obj['payload'] === 'getdailystatisticstartfrom_done') {
            analytic_table = build_tabulator_table(lst_statistic_daily)
            alert('The data in the table has been refresh...')
        } 
        
        if (obj['payload'] === 'getallatonvoltdata') {
            lst_voltdata.push(obj) 
        }

        if (obj['payload'] === 'getallatonvoltdata_done') {
            if (tabulate_container.classList.contains('openwide')) {
                chartOnTable_data.innerHTML = ''
                chartOnTable_data.classList.add("highcharts-dark")
                build_chart()
                dialogShowReportOnTable.classList.remove('hidden');
            }
            else {
                chart_data.innerHTML = ''
                chart_data.classList.add("highcharts-dark")
                build_chart()
                dialogShowReport.classList.remove('hidden');
            }
        }  

        if (obj['payload'] === 'getallatonbeatdata') {
            lst_voltdata.push(obj) 
        }

        if (obj['payload'] === 'getallatonbeatdata_done') {
            chart_data.innerHTML = ''
            chart_data.classList.add("highcharts-dark")
            build_chart_beat()
            dialogShowReport.classList.remove('hidden');
        }         
        
        if (obj['payload'] === 'getatonmsgcount') {
            updateChart(obj.items)
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
        console.log("Error: " + event);
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

var customAccessor = function(value, data, type, params, column, row){
    //value - original value of the cell
    //data - the data for the row
    //type - the type of access occurring  (data|download|clipboard)
    //params - the accessorParams object passed from the column definition
    //column - column component for the column this accessor is bound to
    //row - row component for the row

    //return Math.floor(value); //return the new value for the cell data.

    analytic_row_number += 1

    return analytic_row_number
}

function build_tabulator_table(statistic_data) {
    //Build Tabulator
    var table = new Tabulator("#data-table", {
        height: "86%",
        resizableColumnFit:true,
        renderHorizontal:"virtual",
        clipboard:true,
        // responsiveLayout:"hide",
        data:statistic_data,
        columns:[
            {title:"No", field:"no", formatter:"rownum", accessor:customAccessor},
            {title:"Site Name", field:"al_name", headerFilter:"input", width:100},
            {title:"MMSI", field:"mmsi", headerFilter:"input", width:100},
            {title:"Structure", field:"al_type", headerFilter:"input", width:100},
            {title:"Region", field:"al_region", headerFilter:"input", width:120},
            {title:"Min.<br>Temp.", field:"minTemp"},
            {title:"Max.<br>Temp.", field:"maxTemp"},

            {title:"Min. Batt<br>ATON", field:"minBattAton", formatter:function(cell, formatterParams){
                var value = cell.getValue();
                if(value < 12.0){
                    cell.getElement().style.backgroundColor = "rgba(29, 78, 216, 1)";
                    return value;
                }else{
                    return value;
                } 
            }},
            {title:"Max. Batt<br>ATON", field:"maxBattAton", formatter:function(cell, formatterParams){
                var value = cell.getValue();
                if(value > 15.0){
                    cell.getElement().style.backgroundColor = "rgba(29, 78, 216, 1)";
                    return value;
                }else{
                    return value;
                } 
            }},
            {title:"Avg. Batt<br>ATON", field:"meanBattAton"},
            {title:"Stddev<br>Batt ATON", field:"stddevBattAton"},
            {title:"Skew Batt<br>ATON", field:"skewBattAton"},
            {title:"Kurt Batt<br>ATON", field:"kurtBattAton"},

            {title:"Min. Batt<br>Lantern", field:"minBattLant", formatter:function(cell, formatterParams){
                var value = cell.getValue();
                if(value < 12.0){
                    cell.getElement().style.backgroundColor = "rgba(29, 78, 216, 1)";
                    return value;
                }else{
                    return value;
                } 
            }},
            {title:"Max. Batt<br>Lantern", field:"maxBattLant", formatter:function(cell, formatterParams){
                var value = cell.getValue();
                if(value > 15){
                    cell.getElement().style.backgroundColor = "rgba(29, 78, 216, 1)";
                    return value;
                }else{
                    return value;
                } 
            }},
            {title:"Avg. Batt<br>Lantern", field:"meanBattLant"},
            {title:"Stddev<br>Batt Lantern", field:"stddevBattLant"},
            {title:"Skew Batt<br>Lantern.", field:"skewBattLant"},
            {title:"Kurt Batt<br>Lantern", field:"kurtBattLant"},

            {title:"off<br>Position", field:"off_pos", headerFilter:"input", formatter:function(cell, formatterParams){
                var value = cell.getValue();
                if(value == 'NG'){
                    cell.getElement().style.backgroundColor = "rgba(29, 78, 216, 1)";
                    return 'NG';
                }else{
                    return 'OK';
                } 
            }},
            {title:"Message 6<br>Counting", field:"msg6Count", formatter:function(cell, formatterParams){
                var value = cell.getValue();
                if(value <= 0){
                    cell.getElement().style.backgroundColor = "rgba(29, 78, 216, 1)";
                    return value;
                }else{
                    return value;
                } 
            }},
            {title:"Site with<br>Message 6", field:"siteTx", headerFilter:"input", formatter:function(cell, formatterParams){
                var value = cell.getValue();
                if(value == 'NG'){
                    cell.getElement().style.backgroundColor = "rgba(29, 78, 216, 1)";
                    return 'NG';
                }else{
                    return 'OK';
                } 
            }},            
            {title:"Last Seen<br>(Second)", field:"at_ts"},
            {title:"Last<br>Maintain", field:"last_maintain"}
        ],
    });

    //trigger download of data.html file
    // document.getElementById("download-html").addEventListener("click", function(){
    //     table.download("html", "data.html", {style:true});
    // });

    return table
}


function build_chart(){
    // download_csv.classList.add('hidden')
    // download_json.classList.add('hidden')
    // download_pdf.classList.add('hidden')

    x = []
    y1 = []
    y2 = []

    lst_voltdata.forEach(elem => {
        x.push(elem.ts)
        y1.push(elem.volt_int)
        y2.push(elem.volt_ex1)
    })

    chartDivId = 'chart-data' 
    if (tabulate_container.classList.contains('openwide')) {
        chartDivId = 'chartOnTable-data' 
    }

    Highcharts.chart(chartDivId, {
        chart: {
            styledMode: true
        },

        title: {
            text:  lst_voltdata[0].mmsi + ' - ' + lst_voltdata[0].atonname + '<br>ATON Battery Voltage and Lantern Voltage for last 7 days',
            align: 'center'
        },
  
        yAxis: {
            title: {
                text: 'Voltage'
            }
        },
    
        xAxis: {
            categories: x
            
            // type: 'datetime',
            // offset: 40
        },
    
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },
    
        series: [{
            name: 'ATON',
            data: y1
        }, {
            name: 'Lantern',
            data: y2
        }],
    
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }
    });
}

function build_chart_beat(){
    // download_csv.classList.add('hidden')
    // download_json.classList.add('hidden')
    // download_pdf.classList.add('hidden')

    x = []
    y1 = []
    y2 = []

    lst_voltdata.forEach(elem => {
        x.push(elem.ts)
        y1.push(elem.beat)
    })

    Highcharts.chart('chart-data', {
        chart: {
            styledMode: true
        },

        title: {
            text:  lst_voltdata[0].mmsi + ' - ' + lst_voltdata[0].atonname + '<br>ATON Beat for last 7 days',
            align: 'center'
        },
  
        yAxis: {
            title: {
                text: 'State'
            }
        },
    
        xAxis: {
            categories: x
            
            // type: 'datetime',
            // offset: 40
        },
    
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },
    
        series: [{
            name: 'ATON Beat',
            data: y1
        }],
    
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }
    });
}

// message counting 
// Add data to the chart
function addData(chart, label, newData) {
    chart.data.labels.push(label);
    dscnt = 0;
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(newData[dscnt]);
        dscnt += 1;
    });
    chart.update();
}

// Remove data from the chart
function removeData(chart) {
    chart.data.labels.shift();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.shift();
    });
    chart.update();
}

const chart = new Chart(chartdev1, {
    type: 'line',
    data: {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        datasets: [
            {
                label: 'Message 6',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                borderColor: '#ff796f',
                borderWidth: 1
            },
            {
                label: 'Message 8',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                borderColor: 'rgb(129, 255, 129)',
                borderWidth: 1
            },
            {
                label: 'Message 21',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                borderColor: '#5d70ff',
                borderWidth: 1
            }                         
        ]
    },
    options: {
        responsive: true,
        scales: {
            x: {
                ticks: {
                    //autoSkip: false,
                    maxRotation: 90,
                    minRotation: 90,
                    color: "#fff",
                    font: {
                        size: 9, // Adjust the font size for x-axis ticks,
                    }                     
                }
            },
            y: {
                display: true,
                ticks: {
                    // beginAtZero: true,
                    //steps: 5,
                    //stepValue: 5,
                    suggestedMin: 30.0,
                    suggestedMax: 130.0,
                    color: "#fff",
                    font: {
                        size: 9, // Adjust the font size for x-axis ticks,
                        color: "#fff"
                    } 
                }
            }                        
        },
        plugins: {
            title: {
                display: false,
                text: 'Last 100 minutes'
            },
            legend: {
                display: true,
                labels: {
                    color: '#fff', 
                    font: {
                        size: 9 
                    }
                }
            }            
        }        
    }    
})

const chart1 = new Chart(chartdev2, {
    type: 'line',
    data: {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        datasets: [
            {
                label: 'Message 6',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                borderColor: '#ff796f',
                borderWidth: 1
            },
            {
                label: 'Message 8',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                borderColor: 'rgb(129, 255, 129)',
                borderWidth: 1
            },
            {
                label: 'Message 21',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                borderColor: '#5d70ff',
                borderWidth: 1
            }                         
        ]
    },
    options: {
        responsive: true,
        scales: {
            x: {
                ticks: {
                    //autoSkip: false,
                    maxRotation: 90,
                    minRotation: 90,
                    color: "#fff",
                    font: {
                        size: 9, // Adjust the font size for x-axis ticks,
                    }                     
                }
            },
            y: {
                display: true,
                ticks: {
                    // beginAtZero: true,
                    //steps: 5,
                    //stepValue: 5,
                    suggestedMin: 30.0,
                    suggestedMax: 130.0,
                    color: "#fff",
                    font: {
                        size: 9, // Adjust the font size for x-axis ticks,
                        color: "#fff"
                    } 
                }
            }                        
        },
        plugins: {
            title: {
                display: false,
                text: 'Last 100 minutes'
            },
            legend: {
                display: true,
                labels: {
                    color: '#fff',
                    font: {
                        size: 9 
                    }
                }
            }            
        }        
    }    
})

const chart2 = new Chart(chartdev3, {
    type: 'line',
    data: {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        datasets: [
            {
                label: 'Message 6',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                borderColor: '#ff796f',
                borderWidth: 1
            },
            {
                label: 'Message 8',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                borderColor: 'rgb(129, 255, 129)',
                borderWidth: 1
            },
            {
                label: 'Message 21',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                borderColor: '#5d70ff',
                borderWidth: 1
            }                         
        ]
    },
    options: {
        responsive: true,
        scales: {
            x: {
                ticks: {
                    //autoSkip: false,
                    maxRotation: 90,
                    minRotation: 90,
                    color: "#fff",
                    font: {
                        size: 9, // Adjust the font size for x-axis ticks,
                    }                     
                }
            },
            y: {
                display: true,
                ticks: {
                    // beginAtZero: true,
                    //steps: 5,
                    //stepValue: 5,
                    suggestedMin: 30.0,
                    suggestedMax: 130.0,
                    color: "#fff",
                    font: {
                        size: 9, // Adjust the font size for x-axis ticks,
                        color: "#fff"
                    } 
                }
            }                        
        },
        plugins: {
            title: {
                display: false,
                text: 'Last 100 minutes'
            },
            legend: {
                display: true,
                labels: {
                    color: '#fff',
                    font: {
                        size: 9 
                    }
                }
            }            
        }        
    }    
})

const updateChart = (data) => {
    const date = new Date();
    const isoString = date.toISOString();

    date.setHours(date.getHours() + 0);
    datestr = date.toLocaleTimeString('en-MY', { hour12: false });

    n = data.msg6_cnt
    s = data.msg8_cnt
    t = data.msg21_cnt

    cnt_msg_6.innerText = ": " + data.msg6_cnt
    cnt_msg_8.innerText = ": " + data.msg8_cnt
    cnt_msg_21.innerText = ": " + data.msg21_cnt

    addData(chart, data.ts2, [n, s, t])
    removeData(chart)

    n = data.msg6_cnt_yesterday
    s = data.msg8_cnt_yesterday
    t = data.msg21_cnt_yesterday

    cnt_msg_6_yest.innerText = ": " + data.msg6_cnt_yesterday
    cnt_msg_8_yest.innerText = ": " + data.msg8_cnt_yesterday
    cnt_msg_21_yest.innerText = ": " + data.msg21_cnt_yesterday

    addData(chart1, data.ts2, [n, s, t])
    removeData(chart1)  
    
    n = data.msg6_cnt - data.msg6_cnt_yesterday
    s = data.msg8_cnt - data.msg8_cnt_yesterday
    t = data.msg21_cnt - data.msg21_cnt_yesterday

    addData(chart2, data.ts2, [n, s, t])
    removeData(chart2)      
};


setTimeout(toggle_msg_counting_chart_panel, 5000)