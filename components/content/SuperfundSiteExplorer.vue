<template>
  <section class="">
    <!-- <h1 v-if="pending" class="bg-black white tc pa5">Loading superfundData</h1> -->
    <div
      id="superfund-map"
      ref="superfundMapRoot"
      class="ba b--white w-100 vh-100 z-1"
    ></div>
  </section>
</template>

<script setup>
import * as mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import * as superfundData from '~/assets/superfund_sites.json'

const map = ref(null)
const initialZoom = 4

onMounted(() => {
  console.log('superfundData', superfundData)

  map.value = new mapboxgl.Map({
    container: 'superfund-map',
    // container: this.$refs.superfundMapRoot
    style: 'mapbox://styles/mapbox/light-v9',
    center: [-90.0362, 35.12587],
    zoom: initialZoom,
    accessToken:
      'pk.eyJ1IjoiZWpmb3giLCJhIjoiY2lyZjd0bXltMDA4b2dma3JzNnA0ajh1bSJ9.iCmlE7gmJubz2RtL4RFzIw',
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
