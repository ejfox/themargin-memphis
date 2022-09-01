<template>
  <section class="">
    <div
      id="superfund-map"
      ref="superfundMapRoot"
      class="ba b--white w-100 vh-100 z-1"
    ></div>
  </section>
</template>

<script>
import * as d3 from 'd3'
import * as mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

export default {
  name: 'SuperfundSiteExplorer',
  props: {},
  data: function () {
    return {
      map: null,
      initialZoom: 4,
    }
  },
  computed: {},
  mounted: function () {
    this.setUpMapboxMap()
  },
  methods: {
    setUpMapboxMap: function () {
      // use d3 to get geojson data from /superfund_sites.geojson
      // and show it on the mapbox map

      this.map = new mapboxgl.Map({
        container: 'superfund-map',
        // container: this.$refs.superfundMapRoot
        style: 'mapbox://styles/mapbox/light-v9',
        center: [-90.0362, 35.12587],
        zoom: this.initialZoom,
        accessToken:
          'pk.eyJ1IjoiZWpmb3giLCJhIjoiY2lyZjd0bXltMDA4b2dma3JzNnA0ajh1bSJ9.iCmlE7gmJubz2RtL4RFzIw',
      })

      this.map.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          // When active the map will receive updates to the device's location as it changes.
          trackUserLocation: true,
          // Draw an arrow next to the location dot to indicate which direction the device is heading.
          showUserHeading: true,
          fitBoundsOptions: {
            maxZoom: 11,
          },
        })
      )

      // use d3.json to load geojson and add it to mapbox map

      d3.json('/superfund_sites.geojson').then((data, err) => {
        if (err) {
          console.log(err)
        } else {
          console.log('data received', data)

          this.map.on('load', () => {
            this.map.addLayer({
              id: 'superfund-sites',
              type: 'circle',
              source: {
                type: 'geojson',
                data: data,
              },
              paint: {
                // 'circle-radius': {
                //   base: 1.75,
                //   stops: [
                //     [12, 2],
                //     [22, 180],
                //   ],
                // },
                'circle-radius': ['/', ['get', 'Site Score'], 6],
                // make all circles red
                'circle-color': 'rgba(255,0,0,0.25)',
              },
            })
          })

          // add symbol labels for each superfund site

          this.map.addLayer({
            id: 'superfund-site-labels',
            type: 'symbol',
            source: {
              type: 'geojson',
              data: data,
            },
            layout: {
              'text-field': ['get', 'Site Name'],
              'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
              'text-radial-offset': 0.8,
              'text-justify': 'auto',
              // make font size 10
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
      })

      //this.map.on('load', this.onMapLoaded)

      this.map.scrollZoom.disable()
    },
  },
}
</script>

<style></style>
