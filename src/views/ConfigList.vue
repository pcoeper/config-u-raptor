<template>
  <div class="config-list">
    <div v-for="parameter in parameters" :key="parameter.id">
      <ConfigDetail v-bind:parameter="parameter"></ConfigDetail>
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

  public created() {
    ipcRenderer.send('getAllConfigParameter');
    ipcRenderer.on(
      'replyAllConfigParameter',
      (_: any, arg: ConfigParameter[]) => {
        this.parameters = arg;
      }
    );
  }
}
</script>

<style lang="scss">
    .config-list {
        padding: 80px 40px;
    }
</style>

