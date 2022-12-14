import React, { useRef, useEffect, useReducer, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import styled from "styled-components";

import ControlPanel from '../components/ControlPanel';
import DistrictSummary from '../components/DistrictSummary'
import geoJson from "../components/data.json"; // TODO: Pull from server


// FIXME: Can't put this in source control! Pull from env var instead
mapboxgl.accessToken = 'pk.eyJ1IjoianRtY2tlbnppZSIsImEiOiJjbGFqdmw0ZjYwNGdkM3BwNXIwN21nNDcyIn0.66B3_VUFKgWJ4HG9ARPTjA';

const MapBase = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

// TODO Refactor into action creators
const mapActionTypes = {
  setSelectedDistricts: "setSelectedDistricts"
}

// Center map on Twin Donuts
const mapCenter = {
  longitude: -71.13801,
  latitude: 42.35353
}; 

const districts = Array.from(new Set(geoJson.features.map(f => f.properties.district))).sort();

const summaries = { };
for (let district of districts) {
  const totalStations = geoJson.features.filter(f => f.properties.district === district).length;
  const totalDocks = geoJson.features.filter(f => f.properties.district === district).map(f => Number.parseInt(f.properties.totalDocks)).reduce((count, td) => count += td)
  summaries[district] = {
    totalStations: totalStations,
    totalDocks: totalDocks
  }
}
  
const initialState = {
  mapState: {
    lng: mapCenter.longitude,
    lat: mapCenter.latitude,
    zoom: 11,
  },
  filters: {
    districtOptions: ["", ...districts],
    selectedDistricts: [""],
    allFeatures: geoJson,
    filteredFeatures: geoJson,
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case mapActionTypes.setSelectedDistricts:
      return {
        ...state,
        filters: {
          ...state.filters,
          selectedDistricts: action.payload
        }
      };
    default:
      throw new Error();
  }
}

const BikeMap = () => {

  const [state, dispatch] = useReducer(reducer, initialState);
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);

  // Initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [state.mapState.lng, state.mapState.lat],
      zoom: state.mapState.zoom
    });

    map.on('load', () => {
      map.addSource('stations', {
        type: "geojson",
        data: geoJson,
        // cluster: true,
        // clusterMaxZoom: 14, // Max zoom to cluster points on
        // clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
      });
      map.addLayer({
        'id': 'stations',
        'source': 'stations',
        'type': 'circle',
        'paint': {
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,
            100,
            30,
            750,
            40
          ],
          "circle-color": "#2CA3E1",
          "circle-stroke-color": "#1D428A",
          "circle-stroke-width": 5 
        }
      });
      /*
      map.addLayer({
        id: 'station-count',
        type: 'symbol',
        source: 'stations',
        filter: ['has', 'point_count'],
        paint: {
          'text-color': '#FFFFFF',
        },
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12
        }
      });
      */

    })

    map.on('click', 'stations', (e) => {
      // Copy coordinates array.
      const station = {
        properties: {...e.features[0].properties},
        coordinates: e.features[0].geometry.coordinates.slice(),
      };

      // TODO: Refactor into component
      const StationPopup = `<div>
        <p><span style="font-weight: bold">Location: </span><span>${station.properties.name}</span></p>
        <p><span style="font-weight: bold">Coordinates (latitude, longitude): </span><span>${station.properties.latitude}, ${station.properties.longitude}</span></p>
        <p><span style="font-weight: bold">District: </span><span>${station.properties.district}</span></p>
        <p><span style="font-weight: bold">Total Docks: </span><span>${station.properties.totalDocks}</span></p>
        <p><span style="font-weight: bold">Public: </span><span>${station.properties.public? "Yes" : "No"}</span></p>
        <p><span style="font-weight: bold">Deployed in: </span><span>${station.properties.deploymentYear}</span></p>
        <p><span style="font-weight: bold">ID: </span><span>${station.properties.number}</span></p>
      </div>`;
      
      new mapboxgl.Popup()
      .setLngLat(station.coordinates)
      .setHTML(StationPopup)
      .addTo(map);
    });


    // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    setMap(map);

    // Clean up on unmount
    return () => map.remove();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  let selectedDistricts = state.filters.selectedDistricts;
  if (selectedDistricts.length === 1 && selectedDistricts[0] === "") {
    selectedDistricts = districts;
  };
  
  useEffect(() => {
    if(map && map.loaded()) {
      map.setFilter('stations', [
        'in',
        'district',
        ...selectedDistricts,
      ]);
    }
  }, [selectedDistricts, map]);


  const filters = [
    {
      label: "District",
      options: state.filters.districtOptions,
      onChange: (selections) => {
        dispatch({type: mapActionTypes.setSelectedDistricts, payload: selections})
      }
    }
  ];

  const summary = {
    totalStations: 0,
    totalDocks: 0,
  };

  for (let district of selectedDistricts) {
    summary.totalStations = summary.totalStations + summaries[district].totalStations;
    summary.totalDocks = summary.totalDocks + summaries[district].totalDocks;
  }

  return (
    <div>
      <ControlPanel header="Filters" controls={filters}/>
      {selectedDistricts &&
        <DistrictSummary selectedDistricts={selectedDistricts} summary={summary} summaries={summaries}/>
      }
      <MapBase ref={mapContainerRef} />
    </div>
  );
};

export default BikeMap;
