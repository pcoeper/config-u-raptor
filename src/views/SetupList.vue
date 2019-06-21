<template>
  <div class="setups">
    <div class="actions">
      <router-link :to="{name: 'setup-detail', params: {id: 0}}">
        <b-button class="action-btn">Hinzufügen</b-button>
      </router-link>
    </div>

    <div class="setup-list">
      <h2 class="subtitle">Setups</h2>
      <div class="setup-item" v-for="setup in setups" :key="setup.id">
        <div class="item-name">{{setup.name}}</div>
        <div class="item-actions">
          <router-link :to="{name: 'setup-detail', params: {id: setup.id}}">
            <b-button class="action-btn">Bearbeiten</b-button>
          </router-link>
        </div>
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
      console.table(args);
      this.setups = args;
    });
  }

  public destroyed() {
    // clear all listeners
    ipcRenderer.removeAllListeners('replyAllConfigSetups');
  }
}
</script>

<style lang="scss" scoped>
.setups {
  .actions {
    text-align: right;

    .action-btn:not(:last-child) {
      margin-right: 5px;
    }
  }

  .setup-list {
    h2 {
      text-align: left;
    }

    .setup-item {
      border: 1px solid black;
      padding: 10px 20px;

      display: grid;
      grid-template-columns: 5fr auto;
      grid-template-rows: 1fr;
      grid-template-areas: "name actions";

      margin-bottom: 5px;

      &:last-child {
        margin-bottom: 0;
      }

      .item-name {
        grid-area: name;
        justify-self: start;
        align-self: center;
      }

      .item-actions {
        grid-area: actions;
      }
    }
  }
}
</style>


