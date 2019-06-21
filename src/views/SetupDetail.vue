<template>
  <div class="setup-detail">
    <p>SetupDetail works</p>
    <p>{{$route.params.id}}</p>
    <div class="actions">
      <b-button class="action-btn" @click="submit">Speichern</b-button>
    </div>
    <div class="parameter-list">
      <h2 class="subtitle">Parameter</h2>
      <div v-for="parameter in parameters" :key="parameter.id">
        <ConfigDetail class="config-detail" v-bind:parameter="parameter"></ConfigDetail>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { ipcRenderer } from 'electron';
import { ConfigParameter } from '../db/entity/ConfigParameter';
import ConfigDetail from './ConfigDetail.vue';

@Component({ components: { ConfigDetail } })
export default class SetupDetail extends Vue {
  public parameters: ConfigParameter[] = [];

  private setupId: number = 0;

  public created() {
    this.setupId = +this.$route.params.id;
    ipcRenderer.send('getAllParameterOfSetup', this.setupId);
    ipcRenderer.on(
      'replyAllParametersOfSetup',
      (_: any, args: ConfigParameter[]) => {
        this.parameters = args;
      }
    );
  }

  public destroyed() {
    // clear all listeners
    ipcRenderer.removeAllListeners('replyAllParametersOfSetup');
  }

  public submit() {
    ipcRenderer.send('saveSetupParameter', {
      setupId: this.setupId,
      parameters: this.parameters
    });
  }
}
</script>
