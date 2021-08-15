<template>
  <div class="wrapper">
    <div class="form">
      <div class="form__group">
        <codemirror v-model="inputRaw" :options="inputOptions"></codemirror>

        <pre>
{
  "41239": "Mönchengladbach",
  "10777": "Berlin",
  "40210": "Düsseldorf",
  "42103": "Wuppertal"
}</pre
        >
      </div>

      <div class="form__group">
        <codemirror v-model="output" :options="outputOptions"></codemirror>

        <pre>
// zipcode, city, latitude, longitude, created_at, updated_at
('42103','Wuppertal','51.255920','7.144284', NOW(), NOW()),
('10777','Berlin','52.497555','13.344000', NOW(), NOW()),
('40210','Düsseldorf','51.238454','6.814350', NOW(), NOW()),
('41239','Mönchengladbach','51.162708','6.423544', NOW(), NOW()),
</pre
        >
      </div>
    </div>
    <button @click="convert">Convert</button>

    <loader :loading="loading"></loader>
  </div>
</template>

<script>
import axios from "axios";

import { codemirror } from "vue-codemirror";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/sql/sql.js";

import "codemirror/lib/codemirror.css";
import "codemirror/theme/base16-dark.css";
import Loader from "./Loader/Loader";

export default {
  name: "Converter",
  components: {
    codemirror,
    Loader,
  },
  data() {
    return {
      apiKey: "",
      loading: false,
      input: "",
      inputRaw: "",
      output: "",
      outputRaw: [],
      inputOptions: {
        tabSize: 4,
        mode: {
          name: "javascript",
          json: true,
        },
        theme: "base16-dark",
        lineNumbers: false,
      },
      outputOptions: {
        tabSize: 4,
        mode: {
          name: "sql",
        },
        theme: "base16-dark",
        lineNumbers: false,
      },
    };
  },
  watch: {
    inputRaw: function (newValue) {
      this.input = newValue.replace(/\s+/g, "");
    },
  },
  methods: {
    convert() {
      this.loading = true;

      let requests = Object.entries(JSON.parse(this.input)).map((entry) => {
        const zipcode = entry[0];
        const city = entry[1];

        return axios({
          method: "GET",
          url: "https://api.opencagedata.com/geocode/v1/json",
          params: {
            q: `${zipcode},${city},Germany`,
            key: this.apiKey,
            language: "de",
            pretty: 1,
          },
        }).then((response) => {
          const bounds = response.data["results"][0].bounds;
          const { lat, lng } = this.calculateCoordinates(bounds);

          return `('${zipcode}','${city}','${lat}','${lng}', NOW(), NOW()),`;
        });
      });

      Promise.all(requests).then((rows) => {
        let lines = "";

        rows.forEach((row) => {
          lines += row;
          lines += "\n";
        });

        this.output = lines;
        this.loading = false;
      });
    },
    calculateCoordinates(bounds) {
      let lat = bounds.northeast.lat + bounds.southwest.lat;
      lat = lat / 2;
      lat = lat.toFixed(6);

      let lng = bounds.northeast.lng + bounds.southwest.lng;
      lng = lng / 2;
      lng = lng.toFixed(6);

      return { lat, lng };
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="postcss" scoped>
.wrapper {
  @apply max-w-screen-xl w-full;
}

.form {
  @apply w-full flex flex-col gap-4;

  &__group {
    @apply grid grid-cols-8 gap-4;

    .vue-codemirror {
      @apply col-span-8 lg:col-span-4 xl:col-span-5;
    }

    pre {
      @apply col-span-8 lg:col-span-4  xl:col-span-3 m-0 overflow-auto;
    }
  }
}

input[type="text"] {
  @apply bg-gray-900 text-white p-2 text-base border-none rounded;
}

button {
  @apply bg-primary-500 py-2.5 px-5 border-none rounded text-white text-lg mt-4 transition duration-150 ease-in-out;

  &:hover {
    @apply cursor-pointer bg-primary-600;
  }
}

pre {
  @apply p-2 bg-gray-100 rounded;
}
</style>

<style lang="postcss">
.CodeMirror {
  @apply text-base border-none rounded;
  @apply rounded box-border;
}

.CodeMirror-scroll {
  @apply w-full p-2 bg-gray-900;
}
</style>
