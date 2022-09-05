<template>
  <section class="relative">
    <!-- <h1 v-if="pending" class="bg-black white tc pa5">Loading superfundData</h1> -->
    <div class="map-controls absolute top-2 left-2 z-2">
      <button class="pa1 ma2" @click="resetMapView">Full U.S.</button>
      <button
        class="pa1 ma2"
        @click="
          flyToLocation({
            lat: 34.30267994231717,
            lng: -92.0855819157041,
            zoom: 9,
          })
        "
      >
        Pine Bluff Chemical Agent Disposal Facility
      </button>
      <button
        class="pa1 ma2"
        @click="
          flyToLocation({
            lat: 18.128444691377894,
            lng: -65.44000720750446,
            zoom: 11,
          })
        "
      >
        The Vieques, Puerto Rico, Naval Training Range
      </button>
      <button
        class="pa1 ma2"
        @click="
          flyToLocation({
            // lat: 18.128444691377894,
            // lng: -65.44000720750446,
            // 29°23′00″N 098°34′51″W
            lat: 29.383333,
            lng: -98.580833,
            zoom: 13,
          })
        "
      >
        Kelly Air Force Base
      </button>
    </div>
    <div
      id="superfund-map"
      ref="superfundMapRoot"
      class="ba b--white w-100 vh-50 z-1"
    ></div>
  </section>
</template>

<script setup>
import * as mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { bbox } from '@turf/turf'
import * as superfundData from '~/assets/superfund_sites.json'

const map = ref(null)
const initialZoom = 4

const initialCenter = [-90.0489801, 35.1495343]
const boundingBox = [-124.848974, 24.396308, -66.885444, 49.384358]

function flyToLocation(location) {
  map.value.flyTo({
    center: [location.lng, location.lat],
    zoom: location.zoom,
    duration: location.duration ? location.duration : 3200,
  })
}

function resetMapView() {
  map.value.fitBounds(boundingBox, {
    padding: 100,
  })
}

onMounted(() => {
  console.log('superfundData', superfundData)

  map.value = new mapboxgl.Map({
    container: 'superfund-map',
    // container: this.$refs.superfundMapRoot
    style: 'mapbox://styles/mapbox/light-v9',
    // center: initialCenter,
    zoom: initialZoom,
    projection: 'globe',
    accessToken:
      'pk.eyJ1IjoiZWpmb3giLCJhIjoiY2lyZjd0bXltMDA4b2dma3JzNnA0ajh1bSJ9.iCmlE7gmJubz2RtL4RFzIw',
  })

  map.value.fitBounds(boundingBox, {
    padding: 100,
  })

  map.value.addControl(
    new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
      showUserHeading: true,
      fitBoundsOptions: {
        maxZoom: 11,
      },
    })
  )
  map.value.on('load', () => {
    // get bounding box of superfundData and use it to fitBounds
    // const boundingBox = bbox(superfundData)
    // bounding box of the continental US
    map.value.fitBounds(boundingBox, {
      padding: 100,
    })
    if (!map.value.getLayer('superfund-sites')) {
      map.value.addLayer({
        id: 'superfund-sites',
        type: 'circle',
        source: {
          type: 'geojson',
          data: superfundData,
        },
        paint: {
          'circle-radius': ['/', ['get', 'Site Score'], 6],
          'circle-color': 'rgba(255,0,0,0.25)',
        },
      })
    }

    if (!map.value.getLayer('superfund-site-labels')) {
      // add symbol labels for each superfund site
      map.value.addLayer({
        id: 'superfund-site-labels',
        type: 'symbol',
        source: {
          type: 'geojson',
          data: superfundData,
        },
        layout: {
          'text-field': ['get', 'Site Name'],
          'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
          'text-radial-offset': 0.8,
          'text-justify': 'auto',
          'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
          'text-size': 9,
        },
        paint: {
          //'text-color': 'rgba(255,0,0,0.5)',
          // interpolate text-color based on the zoom
          'text-color': [
            'interpolate',
            ['linear'],
            ['zoom'],
            4,
            'rgba(255,0,0,0)',
            10,
            'rgba(255,0,0,0.8)',
          ],
        },
      })
    }

    map.value.scrollZoom.disable()
  })
})
</script>

<style></style>
