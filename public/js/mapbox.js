/* eslint-disable */
// -> we use this command to disable eslint

// console.log(locations);
export const showMap = locations => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiaGFuZWVuLWVsYmVuZGFyeSIsImEiOiJjbTZsMG51Y2IwM3h5Mm1zOHExcWlvb3FmIn0.rqiYwc6V_IJTOwtQ2cISfA';
  const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v11',
    scrollZoom: false
    //   center: [-74.5, 40], // starting position [lng, lat]. Note that lat must be set between -90 and 90
    //   zoom: 9, // starting zoom,
    //   interactive: false
  });
  // the area that will include all of out locations
  const bounds = new mapboxgl.LngLatBounds();
  locations.forEach(loc => {
    // create marker
    const el = document.createElement('div');
    el.className = 'marker';
    //   add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);
    // add popup
    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>${loc.day}: ${loc.description}</p>`)
      .addTo(map);
    // extend map bounds to include current locations
    bounds.extend(loc.coordinates);
  });
  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100
    }
  });
};
