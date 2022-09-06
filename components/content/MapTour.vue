"
<template>
  <section class="hero-map-container ba b--white bw2 bw3-l" ref="root">
    <!-- <h2 class="bg-red yellow ph2 sticky top-0 h1 f6 z-3">{{ scrollY }}</h2>
    <h2 class="bg-blue white ph2 sticky top-2 h1 f6 z-3">
      {{ containerScrollY }}
    </h2> -->
    <div id="map" class="w-100 vh-100 z-1 top-0" ref="mapRoot"></div>

    <!-- color legend for all locations -->

    <div class="location-legend relative z-999 w-100 center dn">
      <div
        v-for="(location, index) in locations"
        :key="index"
        @click="flyToLocation(location)"
        class="location-legend-item dib ma2 pointer"
      >
        <div
          class="location-legend-item-color pa2 b tc br3 f4 white"
          :style="{ backgroundColor: location.color }"
        >
          {{ location.name }}
        </div>
      </div>
    </div>

    <div ref="mapText" class="map-text relative z-999 ml5-l measure">
      <p class="c3" data-lat="35.08652" data-lng="-89.99542">
        <span class="c1"
          >But soon after her grandmother passed, Ms. Doris dug up the booklet
          again, suspecting a connection. It turned out the government was
          suggesting potential toxicity at the </span
        ><span class="c9 c1"
          ><a
            class="c0 ph1 br2 link underline"
            style="background-color: #e41a1c; color: white"
            href="https://www.google.com/url?q=https://cumulis.epa.gov/supercpad/cursites/csitinfo.cfm?id%3D0404159&amp;sa=D&amp;source=editors&amp;ust=1660589865515543&amp;usg=AOvVaw1Bfi5c06aPIaiJHVhMzmKe"
            >Memphis Defense Depot</a
          ></span
        ><span class="c2 c1"
          >&nbsp;&mdash; a sprawling site that the U.S. military had used since
          1942, as a distribution center for munitions, medical supplies and
          petroleum products &mdash; blocks away from the Bradshaws. It was
          vague. And only some neighbors had received it. But it seemed like
          something everyone should be talking about.</span
        >
      </p>

      <p class="c3">
        <span class="c2 c1"
          >So she drew up some flyers with a skull and crossbones pasted in the
          center, calling for a meeting at her children&rsquo;s school, Norris
          Elementary. She enlisted the help of friends and family to hit the
          streets and make sure residents on all sides of the Defense Depot got
          one.</span
        >
      </p>

      <p class="c3" data-lat="35.100182" data-lng="-90.017372">
        >
        <span class="c2 c1"
          >On the afternoon of the meeting, families packed the
          <span style="background-color: #984ea3; color: white"
            >school cafeteria </span
          >. Some had received the same booklet that Ms. Doris had, others had
          not. But just about everyone had a story about a family member, or a
          string of neighbors who&rsquo;d dealt with an odd combination of
          lethal conditions: kidney disease, brain cancer, fibroids the size of
          a cantaloupe.</span
        >
      </p>
      <p class="c3">
        <span class="c2 c1"
          >Besides the health conditions, there was one other thing everyone in
          the room had in common that day: they lived within walking distance of
          the Defense Depot. Though residents didn&rsquo;t know it at the time,
          the facility also included a 60-acre parcel of land north of the Depot
          proper that some residents looked out onto from their front stoops, or
          walked by en route to school, where leaking mustard bombs had been
          buried decades ago. Known as Dunn Field, some residents wondered why
          the oak-lined hills and valleys where this was all occurring
          hadn&rsquo;t just been turned into a park.</span
        >
      </p>
    </div>
  </section>
</template>

<script>
// import * as d3 from 'd3'
// import turf
import {
  centerOfMass,
  point,
  featureCollection,
  feature,
  bbox,
} from '@turf/turf'
import * as mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import scrollama from 'scrollama'

const memphisDepotGeojson = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        shape: 'Polygon',
        name: 'Unnamed Layer',
        category: 'default',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-90.009572, 35.091997],
            [-90.009915, 35.082112],
            [-89.988565, 35.081532],
            [-89.988543, 35.085027],
            [-89.987835, 35.084992],
            [-89.987792, 35.091453],
            [-90.009572, 35.091997],
          ],
        ],
      },
      id: '4a8795c6-4dd2-480e-a02e-a5bd2316aa9c',
    },
  ],
}

const focusAreaGeojson = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        shape: 'Rectangle',
        name: 'Focus Area',
        category: 'default',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-90.030295, 35.099617],
            [-90.030295, 35.077423],
            [-89.980798, 35.077423],
            [-89.980798, 35.099617],
            [-90.030295, 35.099617],
          ],
        ],
      },
      id: '9192e488-943b-490c-a04e-1656aa747e7e',
    },
  ],
}

const wholeMemphisGeojson = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        shape: 'Rectangle',
        name: 'Whole Memphis',
        category: 'default',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-90.074572, 35.062039],
            [-89.853525, 35.062039],
            [-89.853525, 35.208319],
            [-90.074572, 35.208319],
            [-90.074572, 35.062039],
          ],
        ],
      },
      id: 'f20ddac7-c258-4cb9-9a28-ac398b911528',
    },
  ],
}

export default {
  name: 'MemphisContextHeroMap',
  props: {
    scrollY: {
      type: Number,
      default: 0,
    },
  },
  data: function () {
    return {
      map: null,
      focusedEl: null,
      containerScrollY: 0,
      focused: false,
      initialZoom: 5,
      focusedZoom: 14,
      locations: [
        // {
        //   name: 'Memphis Depot',
        //   lat: 35.08652,
        //   lng: -89.99542,
        //   color: '#e41a1c',
        // },
        {
          name: 'Frank Sr. former home',
          lat: 35.12587,
          lng: -90.0362,
          color: '#377eb8',
        },
        {
          name: 'Family home impacted by Dunn Field contents',
          lat: 35.09519,
          lng: -90.00734,
          color: '#4daf4a',
        },
        {
          name: 'Hamilton High School',
          lat: 35.100182,
          lng: -90.017372,
          color: '#984ea3',
        },
        {
          name: 'Ms. Doris home',
          lat: 35.08566,
          lng: -90.01443,
          color: '#ff7f00',
        },
        // {
        //   name: 'Dunn Field',
        //   lat: 35.09519,
        //   lng: -90.00734,
        //   color: '#00ffff',
        // },
      ],
    }
  },
  computed: {},
  mounted: function () {
    this.setUpMapboxMap()

    const scroller = scrollama()
    scroller
      .setup({
        step: '.map-text p',
        // debug: true,
        // offset: 0.75,
        offset: 0.6,
      })
      .onStepEnter(this.onStepEnter)

    // set up scroll listener
    window.addEventListener('scroll', this.onScroll)
  },
  watch: {
    focused: function (newVal, oldVal) {
      if (newVal) {
        this.onMapFocused()
      }
    },
  },
  methods: {
    onStepEnter(step) {
      // console.log('step', step)
      const el = step.element
      const lat = el.getAttribute('data-lat')
      const lng = el.getAttribute('data-lng')
      if (!lng || !lat) return
      // const location = this.locations.find((l) => l.lat == lat && l.lng == lng)
      this.focusedEl = el
      this.focused = true

      const zoomDuration = step.index === 0 ? 6000 : 3000

      if (step.index === 0) {
        this.map.fitBounds(bbox(focusAreaGeojson), {
          duration: zoomDuration,
          padding: {
            // left: 300,
            // use window width to make padding left a percentage
            left: window.innerWidth ? window.innerWidth * 0.35 : 300,
            right: 20,
            top: 20,
            bottom: 20,
          },
        })
        // wait the zoom duration, and then easeTo with a pitch
        setTimeout(() => {
          this.map.easeTo({
            pitch: 45,
            duration: zoomDuration,
          })
        }, zoomDuration)
      } else {
        this.map.flyTo({
          center: [lng, lat],
          zoom: this.focusedZoom,
          duration: zoomDuration,
        })
      }
    },
    flyToLocation(location) {
      this.map.flyTo({
        center: [location.lng, location.lat],
        zoom: this.focusedZoom * 1.3,
        duration: zoomDuration,
      })
    },
    calcCenterOfMass: function () {
      // use turf.point to turn locations into array of points
      const points = this.locations.map(function (location) {
        return point([location.lat, location.lng])
      })
      // turn points into a feature collection
      const pointFeatureCollection = featureCollection(points)
      const center = centerOfMass(pointFeatureCollection)
      return center
    },
    onMapFocused: function () {
      const zoomDuration = 8000

      // fit to bounds of whole Memphis
      this.map.fitBounds(bbox(wholeMemphisGeojson), {
        duration: zoomDuration,
        padding: {
          left: 20,
          right: 20,
          top: 20,
          bottom: 20,
        },
      })

      // this.map.easeTo({
      //   zoom: this.focusedZoom,
      //   pitch: 55,
      //   bearing: -32,
      //   duration: zoomDuration,
      // })

      // // after 8 seconds do this.map.setStyle to this style: 'mapbox://styles/mapbox/satellite-v9',
      // setTimeout(
      //   function () {
      //     this.map.setStyle('mapbox://styles/mapbox/satellite-v9')
      //   }.bind(this),
      //   zoomDuration + 25
      // )
    },
    onMapLoaded: function () {
      // create markers for all locations in this.locations
      this.locations.forEach(
        function (location) {
          const popup = new mapboxgl.Popup({ offset: 25 }).setText(
            location.name
          )
          const el = document.createElement('div')

          const marker = new mapboxgl.Marker({
            color: location.color,
          })
            .setLngLat([location.lng, location.lat])
            .setPopup(popup)
            .addTo(this.map)
        }.bind(this)
      )

      // add labels for all locations in this.locations as geojson
      // first create an array of points for each location
      const points = this.locations.map(function (location) {
        return point([location.lng, location.lat], {
          name: location.name,
          color: location.color,
        })
      })
      // then create a feature collection from the points
      const pointFeatureCollection = featureCollection(points)
      // then add the feature collection to the map
      this.map.addSource('points', {
        type: 'geojson',
        data: pointFeatureCollection,
      })
      // then add the labels to the map
      this.map.addLayer({
        id: 'labels',
        type: 'symbol',
        source: 'points',
        layout: {
          'text-field': ['get', 'name'],
          'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
          'text-offset': [0, 0.6],
          // 'text-transform': 'uppercase',
          'text-anchor': 'top',
        },
        paint: {
          'text-color': ['get', 'color'],
          'text-halo-color': '#fff',
          'text-halo-width': 1,
        },
      })

      // add memphis depot as geojson, with orange fill
      this.map.addSource('memphis-depot', {
        type: 'geojson',
        data: memphisDepotGeojson,
      })
      // this.map.addLayer({
      //   id: 'memphis-depot-label',
      //   type: 'symbol',
      //   source: 'memphis-depot',
      //   layout: {
      //     'text-field': 'Memphis Depot',
      //     'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
      //     'text-offset': [0, 0.6],
      //     'text-anchor': 'top',
      //     'text-allow-overlap': false,
      //   },
      // })

      this.map.addLayer({
        id: 'memphis-depot-fill',
        type: 'fill',
        source: 'memphis-depot',
        paint: {
          'fill-color': '#ff7f00',
          'fill-opacity': 0.5,
        },
      })
    },
    onScroll: function (e) {
      this.containerScrollY = this.calcContainerScrollY(e)
      if (!this.$refs.root) return

      const containerHeight = this.$refs.root.offsetHeight
      // if containerScrollY is negative, not in focus for the height of the element
      if (this.containerScrollY < 0) {
        this.focused = false
      } else if (this.containerScrollY > containerHeight) {
        this.focused = false
      } else {
        this.focused = true
      }

      // detect which element is in focus
      this.focusedEl = this.detectFocusedEl()
    },
    detectFocusedEl() {},
    calcContainerScrollY: function (e) {
      const containerEl = this.$refs.root
      if (!containerEl) return false
      /* figure out how many pixels have been scrolled in container */
      let containerScrollY = containerEl.getBoundingClientRect().top
      // invert the number from negative to positive
      containerScrollY = -containerScrollY
      return containerScrollY
    },
    setUpMapboxMap: function () {
      this.map = new mapboxgl.Map({
        container: this.$refs.mapRoot,
        // style: 'mapbox://styles/mapbox/streets-v11',
        // satellite style
        // style: 'mapbox://styles/mapbox/satellite-v9',
        style: 'mapbox://styles/ejfox/cl7p0rxav000o15p0dnsl8jen',
        accessToken:
          'pk.eyJ1IjoiZWpmb3giLCJhIjoiY2lyZjd0bXltMDA4b2dma3JzNnA0ajh1bSJ9.iCmlE7gmJubz2RtL4RFzIw',
        center: [-89.99542, 35.08652],
        // make center centerOfMass of all locations
        // center: this.calcCenterOfMass(),
        zoom: this.initialZoom,

        // 'pk.eyJ1IjoiZWpmb3giLCJhIjoiY2lyZjd0bXltMDA4b2dma3JzNnA0ajh1bSJ9.iCmlE7gmJubz2RtL4RFzIw',

        // projection: 'globe',
      })

      this.map.on('load', this.onMapLoaded)

      this.map.scrollZoom.disable()
    },
  },
}
</script>

<style scoped>
#map {
  position: sticky;
}

.vh-80 {
  height: 80vh;
}

.hero-map-container {
  /* position: sticky;
  top: 1rem; */
}

p {
  margin-bottom: 40vh;
  padding: 2em 1.2em;
  margin-left: 2vw;
  margin-right: 2vw;
  line-height: 1.3em;
  background-color: white;
  border-radius: 0.25rem;
  box-shadow: 0 0 3.3rem rgba(0, 0, 0, 0.15);
  border: 1px solid white;
}

.sticky {
  position: sticky;
}
</style>
"
