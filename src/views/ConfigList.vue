<template>
  <div class="config-list">
    <div class="actions">
      <b-button @click="add">Hinzufügen</b-button>
      <b-button @click="submit">Speichern</b-button>
    </div>
    <div class="new-parameter-list" v-if="newParameters.length > 0">
      <h2>Neue Parameter</h2>
      <div v-for="parameter in newParameters" :key="parameter.id">
        <ConfigDetail v-bind:parameter="parameter"></ConfigDetail>
      </div>
    </div>

    <div class="parameter-list">
      <h2>Parameter</h2>
      <div v-for="parameter in parameters" :key="parameter.id">
        <ConfigDetail v-bind:parameter="parameter"></ConfigDetail>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { ipcRenderer, Event } from 'electron';
import { ConfigParameter } from '../db/entity/ConfigParameter';
import ConfigDetail from './ConfigDetail.vue';

@Component({ components: { ConfigDetail } })
export default class ConfigList extends Vue {
  public parameters: ConfigParameter[] = [];

  public newParameters: ConfigParameter[] = [];

  public created() {
    ipcRenderer.send('getAllConfigParameter');
    ipcRenderer.on(
      'replyAllConfigParameter',
      (_: any, arg: ConfigParameter[]) => {
        this.parameters = arg;
      }
    );
  }

  public destroyed() {
    // clear all listeners
    ipcRenderer.removeAllListeners('replyAllConfigParameter');
  }

  public submit() {
    ipcRenderer.send(
      'saveAllConfigParameter',
      this.parameters.concat(this.newParameters)
    );
    this.newParameters = [];
  }

  public add() {
    const newParameter = new ConfigParameter();
    this.newParameters.push(newParameter);
  }
}
</script>

<style lang="scss">
.config-list {
  padding: 80px 40px;
}
</style>

