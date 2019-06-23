<template>
  <div class="config-list">
    <div class="actions">
      <b-button class="action-btn" @click="add">Hinzufügen</b-button>
      <b-button class="action-btn" @click="submit">Speichern</b-button>
    </div>
    <div class="parameter-list" v-if="newParameters.length > 0">
      <h2 class="subtitle">Neue Parameter</h2>
      <div v-for="parameter in newParameters" :key="parameter.id">
        <ConfigDetail
          v-bind:parameter="parameter"
          v-bind:editMode="true"
          @delete-parameter="deleteParameter"
        ></ConfigDetail>
      </div>
    </div>

    <div class="parameter-list">
      <h2 class="subtitle">Parameter</h2>
      <div v-for="parameter in parameters" :key="parameter.id">
        <ConfigDetail
          v-bind:parameter="parameter"
          v-bind:editMode="true"
          @delete-parameter="deleteParameter"
        ></ConfigDetail>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { ipcRenderer, Event } from 'electron';
import { ConfigParameter } from '../db/entity/ConfigParameter';
import ConfigDetail from './ConfigDetail.vue';

export default Vue.extend({
  data() {
    return {
      parameters: [] as ConfigParameter[],
      newParameters: [] as ConfigParameter[]
    };
  },

  components: {
    ConfigDetail
  },

  created() {
    ipcRenderer.send('getAllConfigParameter');
    ipcRenderer.on(
      'replyAllConfigParameter',
      (_: any, args: ConfigParameter[]) => {
        this.parameters = args;
      }
    );
  },

  destroyed() {
    // clear all listeners
    ipcRenderer.removeAllListeners('replyAllConfigParameter');
  },

  methods: {
    submit() {
      ipcRenderer.send(
        'saveAllConfigParameter',
        this.parameters.concat(this.newParameters)
      );
      this.newParameters = [];
    },

    add() {
      const newParameter = new ConfigParameter();
      this.newParameters.push(newParameter);
    },

    deleteParameter(parameter: ConfigParameter) {
      if (parameter.id === undefined) {
        const parameterIndex = this.newParameters.findIndex(
          (param: ConfigParameter) => param === parameter
        );
        if (parameterIndex >= 0) {
          this.newParameters.splice(parameterIndex, 1);
        }
      } else {
        ipcRenderer.send('deleteConfigParameter', parameter.id);
      }
    }
  }
});
</script>

<style lang="scss" scoped>
.config-list {
  .actions {
    text-align: right;

    .action-btn:not(:last-child) {
      margin-right: 5px;
    }
  }

  .parameter-list {
    h2 {
      text-align: left;
    }
  }
}
</style>

