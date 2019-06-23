<template>
  <div class="setup-detail">
    <div class="actions">
      <b-button class="action-btn">
        <router-link to="/setup-list">Zurück</router-link>
      </b-button>
      <b-button class="action-btn" @click="submit">Speichern</b-button>
    </div>
    <div class="parameter-list">
      <h2 class="subtitle">Parameter</h2>
      <div v-for="parameter in parameters" :key="parameter.id">
        <ConfigDetail v-bind:parameter="parameter"></ConfigDetail>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import Vue from 'vue';
import { ipcRenderer } from 'electron';
import { ConfigParameter } from '../db/entity/ConfigParameter';
import ConfigDetail from './ConfigDetail.vue';

export default Vue.extend({
  data() {
    return {
      parameters: [] as ConfigParameter[],
      setupId: 0 as number
    };
  },

  components: {
    ConfigDetail
  },

  created() {
    this.setupId = +this.$route.params.id;
    ipcRenderer.send('getAllParameterOfSetup', this.setupId);
    ipcRenderer.on(
      'replyAllParametersOfSetup',
      (_: any, args: ConfigParameter[]) => {
        this.parameters = args;
      }
    );
  },

  destroyed() {
    // clear all listeners
    ipcRenderer.removeAllListeners('replyAllParametersOfSetup');
  },

  methods: {
    submit() {
      ipcRenderer.send('saveSetupParameter', {
        setupId: this.setupId,
        parameters: this.parameters
      });
    }
  }
});
</script>

<style lang="scss" scoped>
.actions {
  text-align: right;

  .action-btn:not(:last-child) {
    margin-right: 5px;
  }

  a {
    text-decoration: none;
    color: #2c3e50;
    cursor: pointer;
  }
}

.parameter-list {
  h2 {
    text-align: left;
  }
}
</style>

