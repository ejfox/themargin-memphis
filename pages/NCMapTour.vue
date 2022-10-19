<template>
  <section class="hero-map-container ba b--white bw2 bw3-l" ref="root">
    <div id="map" class="w-100 vh-100 z-1 top-0" ref="mapRoot"></div>

    <div id="navigation-buttons" class="absolute z-2 top-1 left-1">
      <button v-for="location in storyLocations.features" :key="location.properties.name"
        class="f6 sans-serif link dim br2 ph3 pv2 mb2 dib white bg-red ba b--white br2 mr3 b" @click="flyToLocation(location)">
        {{ location.properties.name }}
      </button>
    </div>
  </section>
</template>

<script>
// import * as d3 from 'd3'
// import { easeQuadIn } from 'd3'
// import turf
// import { along, length, distance, bearing } from '@turf/turf'
import * as mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
// import scrollama from 'scrollama'

export default {
  name: 'MemphisContextHeroMap',
  props: {},
  data: function () {
    return {
      map: null,
      focusedEl: null,
      containerScrollY: 0,
      focused: false,
      initialZoom: 7,
      focusedZoom: 9.5,
      zoomDuration: 5500,
      storyLocations: {
        "type": "FeatureCollection",
        "features": [
          {
            "type": "Feature",
            "properties": {
              "name": "Piney Woods, NC"
            },
            "geometry": {
              "type": "Point",
              "coordinates": [
                -76.8289865725403,
                35.8038145773008
              ]
            }
          },
          {
            "type": "Feature",
            "properties": {
              "name": "Kenansville, NC"
            },
            "geometry": {
              "type": "Point",
              "coordinates": [
                -77.961990,
                34.961781
              ]
            }
          },
          {
            "type": "Feature",
            "properties": {
              "name": "Snow Hill, NC"
            },
            "geometry": {
              "type": "Point",
              "coordinates": [
                -77.670578,
                35.455620
              ]
            }
          },
          {
            "type": "Feature",
            "properties": {
              "name": "Wallace, NC"
            },
            "geometry": {
              "type": "Point",
              "coordinates": [
                -77.9939869321555,
                34.7338485578574
              ]
            }
          }
        ]
      }
    }
  },
  computed: {
    isMobile: function () {
      const screenWidth = window.innerWidth
      return screenWidth < 768
    },
  },
  mounted: function () {
    this.setUpMapboxMap()

    // set up scroll listener
    window.addEventListener('scroll', this.onScroll)

  },
  watch: {
    focused: function (newVal, oldVal) {
      if (newVal) {
        this.onMapFocused()
      } else if (oldVal && !newVal) {
        this.onMapUnfocused()
      }
    },
  },
  methods: {
    flyToLocation(location) {
      this.map.flyTo({
        center: location.geometry.coordinates,
        zoom: this.focusedZoom * 1.2,
        duration: this.zoomDuration,
      })
    },
    setUpMapboxMap: function () {
      this.map = new mapboxgl.Map({
        container: this.$refs.mapRoot,
        // style: 'mapbox://styles/mapbox/streets-v11',
        // satellite style
        // style: 'mapbox://styles/mapbox/satellite-v9',
        // style: 'mapbox://styles/ejfox/cl7p0rxav000o15p0dnsl8jen',
        style: 'mapbox://styles/ejfox/cl9g3zado002c14pgqtgqxene',
        accessToken:
          'pk.eyJ1IjoiZWpmb3giLCJhIjoiY2lyZjd0bXltMDA4b2dma3JzNnA0ajh1bSJ9.iCmlE7gmJubz2RtL4RFzIw',
        // center: [-122.08473814464001, 48.51603801371454],
        center: [-77.5, 35.5],
        zoom: this.initialZoom,
        //pitch: 59,
        //pitch: 33,
        //bearing: 92,
        // center: start,

        // 'pk.eyJ1IjoiZWpmb3giLCJhIjoiY2lyZjd0bXltMDA4b2dma3JzNnA0ajh1bSJ9.iCmlE7gmJubz2RtL4RFzIw',

        // projection: 'globe',
        projection: 'mercator',
      })

      this.map.on('load', this.onMapLoaded)
      // Disable zoom scrolling
      this.map.scrollZoom.disable()

      // Disable panning
      if (this.isMobile) this.map.dragPan.disable()

      // Add zoom and rotation controls to the map.
      this.map.addControl(new mapboxgl.NavigationControl())
    },
    onMapLoaded: function () {
      // add mapboxgl controls
      // this.map.addControl(new mapboxgl.NavigationControl())

      // add DEM elevation layer
      this.map.addSource('dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
      })

      // add hillshade from mapbox.mapbox-terrain-v2
      this.map.addLayer({
        id: 'hillshade',
        source: 'dem',
        type: 'hillshade',
        // insert below waterway-river-canal-shadow;
        // where hillshading sits in the Mapbox Outdoors style
        before: 'waterway-river-canal-shadow',
        paint: {
          'hillshade-exaggeration': 0.25,
        },
      })

      // add the DEM source as a terrain layer with exaggerated height
      // this.map.setTerrain({ source: 'dem', exaggeration: 0.25 })
      this.map.setTerrain({ source: 'dem', exaggeration: 1 })

    },
  },
}

const skagitRiverTourGeojson = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        shape: 'Line',
        name: 'Unnamed Layer',
        category: 'default',
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-122.540976, 48.360469],
          [-122.515747, 48.36697],
          [-122.491206, 48.368681],
          [-122.462888, 48.359443],
          [-122.441608, 48.35853],
          [-122.423073, 48.360926],
          [-122.385488, 48.364689],
          [-122.37725, 48.370506],
          [-122.361804, 48.400602],
          [-122.347903, 48.414163],
          [-122.339665, 48.428973],
          [-122.319414, 48.455392],
          [-122.285262, 48.476222],
          [-122.257287, 48.48066],
          [-122.234634, 48.488055],
          [-122.198078, 48.489307],
          [-122.165471, 48.488169],
          [-122.156203, 48.495905],
          [-122.112955, 48.512624],
          [-122.006722, 48.518196],
          [-121.921598, 48.512738],
          [-121.848014, 48.52786],
          [-121.8221, 48.536272],
          [-121.774046, 48.535704],
          [-121.76066, 48.530475],
          [-121.723418, 48.527406],
          [-121.692355, 48.513079],
          [-121.631601, 48.480432],
          [-121.601568, 48.476222],
          [-121.572564, 48.480204],
          [-121.554544, 48.490558],
          [-121.531718, 48.497384],
          [-121.491902, 48.501706],
          [-121.465644, 48.510691],
          [-121.437327, 48.523426],
          [-121.420337, 48.548092],
          [-121.399571, 48.58274],
          [-121.373484, 48.596138],
          [-121.337444, 48.626101],
          [-121.255753, 48.671013],
          [-121.210617, 48.696513],
          [-121.184049, 48.702574],
          [-121.099806, 48.710051],
          [-121.068821, 48.731229],
        ],
      },
      id: '43c4e120-89f2-446d-98f9-87ce41d44ea0',
    },
    {
      type: 'Feature',
      properties: {
        shape: 'Line',
        name: 'Unnamed Layer',
        category: 'default',
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-121.210617, 48.696513],
          [-121.181613, 48.704103],
          [-121.161705, 48.712939],
          [-121.134417, 48.713279],
        ],
      },
      id: 'c2f382ff-fd04-4a2e-bf15-002f2708ed69',
    },
  ],
}

const gorgeDamLabel = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        shape: 'Marker',
        name: 'Unnamed Layer',
        category: 'default',
      },
      geometry: {
        type: 'Point',
        coordinates: [-121.208425, 48.697943],
      },
      id: 'cd554554-84a9-4380-b96f-98d432e951c4',
    },
  ],
}

const diabloDamLabel = {
  type: 'Feature',
  properties: {
    shape: 'Marker',
    name: 'Unnamed Layer',
    category: 'default',
  },
  geometry: {
    type: 'Point',
    coordinates: [-121.132021, 48.713817],
  },
  id: 'fc7be170-5d3e-4156-83b6-5a22c7dd6fb2',
}

const rossDamLabel = {
  type: 'Feature',
  properties: {
    shape: 'Marker',
    name: 'Unnamed Layer',
    category: 'default',
  },
  geometry: {
    type: 'Point',
    coordinates: [-121.068093, 48.731851],
  },
  id: '630c6d96-355f-4352-a01a-4476e0822f54',
}

const skagitRiverLabel = {
  type: 'Feature',
  properties: {
    shape: 'Marker',
    name: 'Unnamed Layer',
    category: 'default',
  },
  geometry: {
    type: 'Point',
    coordinates: [-122.37039, 48.383846],
  },
  id: 'd7194808-c284-43c7-92f6-c67f94674b3a',
}
</script>

<style scoped>

.bg-red {
  background-color: #C60101;
}
</style>
