<template>
  <div class="setups">
    <div class="actions">
      <router-link :to="{name: 'setup-detail', params: {id: 0}}">
        <b-button class="action-btn">Hinzufügen</b-button>
      </router-link>
    </div>

    <div class="setup-list">
      <h2 class="subtitle">Setups</h2>
      <div v-for="setup in setups" :key="setup.id">
        {{setup.name}}
        {{setup.id}}
        <router-link :to="{name: 'setup-detail', params: {id: setup.id}}">
          <b-button class="action-btn">Test</b-button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { ipcRenderer } from 'electron';
import { ConfigSetup } from '../db/entity/ConfigSetup';
import router from '../router';

@Component
export default class SetupList extends Vue {
  public setups: ConfigSetup[] = [];

  public created() {
    ipcRenderer.send('getAllConfigSetups');
    ipcRenderer.on('replyAllConfigSetups', (_: any, args: ConfigSetup[]) => {
      this.setups = args;
    });
  }

  public destroyed() {
    // clear all listeners
    ipcRenderer.removeAllListeners('replyAllConfigSetups');
  }
}
</script>

