var map;
var mapStyles = [];
var leaseData;
const readingMin = 1724;
const readingMax = 1893;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 5,
    styles: mapStyles,
    mapTypeId: 'hybrid',
  });

  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://data.heroku.com/dataclips/qkuxanhmttxcluiiqzvdkxtngwkj.json?access-token=d3bcb3a7-f051-470d-a0a0-4db7dacf2ca7');
  xhr.onload = function() {
    leaseData = JSON.parse(xhr.responseText).values[0][0];
    console.error(leaseData);
    map.data.addGeoJson(leaseData);
  };
  xhr.send();

  map.data.setStyle(function(feature) {
    var low = [5, 69, 54];  // color of smallest datum
    var high = [151, 83, 34];
    // console.error(feature.getProperty('id'));
    var delta = (feature.getProperty('f3') - readingMin) / (readingMax - readingMin);
    var color = [];
    for (var i = 0; i < 3; i++) {
      // calculate an integer color based on the delta
      color[i] = high[i] - (high[i] - low[i]) * delta;
    }
    return {
      strokeWeight: 0.5,
      strokeColor: '#fff',
      fillColor: 'hsl(' + color[0] + ',' + color[1] + '%,' + color[2] + '%)',
      fillOpacity: 0.75,
    };
  });

  map.data.addListener('click', e => {
    e.feature.setProperty('state', 'hover');

    var percent = (e.feature.getProperty('f3') - readingMin) /
      (readingMax - readingMin) * 100;

    // update the label
    document.getElementById('data-label').textContent =
      e.feature.getProperty('f2') + ' ' + e.feature.getProperty('f1');
    document.getElementById('data-value').textContent =
      e.feature.getProperty('f3');
    document.getElementById('data-box').style.display = 'block';
    document.getElementById('data-caret').style.display = 'block';
    document.getElementById('data-caret').style.paddingLeft = percent + '%';
  });
}
