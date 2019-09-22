<template>
  <div class="setups">
    <div class="actions">
      <b-button class="action-btn" @click="navigateToDetail(0)">Hinzufügen</b-button>
    </div>

    <div class="setup-list">
      <h2 class="subtitle">Setups</h2>
      <div class="setup-item" v-for="setup in setups" :key="setup.id">
        <div class="item-name">{{setup.name}}</div>
        <div class="item-actions">
          <b-button class="action-btn" @click="navigateToDetail(setup.id)">Bearbeiten</b-button>
          <b-button class="action-btn" @click="downloadSetup(setup.id)">
            <v-icon name="arrow-alt-circle-down"></v-icon>
          </b-button>
          <b-button class="action-btn" type="is-danger" @click="deleteSetup(setup.id)">
            <v-icon name="trash-alt"></v-icon>
          </b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ipcRenderer } from "electron";
import { ConfigSetup } from "../db/entity/ConfigSetup";
import router from "../router";
import Icon from "vue-awesome/components/Icon.vue";
import "vue-awesome/icons/arrow-alt-circle-down";
import "vue-awesome/icons/trash-alt";
import Vue from "vue";
import { SetupController } from "../db/controller/SetupController";

export default Vue.extend({
  data() {
    return {
      setups: [] as ConfigSetup[]
    };
  },

  components: {
    "v-icon": Icon
  },

  created() {
    ipcRenderer.send("getAllConfigSetups");
    ipcRenderer.on("replyAllConfigSetups", (_: any, args: ConfigSetup[]) => {
      this.setups = args;
    });
  },

  destroyed() {
    // clear all listeners
    ipcRenderer.removeAllListeners("replyAllConfigSetups");
  },

  methods: {
    downloadSetup(setupId: number): void {
      ipcRenderer.send("downloadSetup", setupId);
    },

    navigateToDetail(setupId: number): void {
      router.push({ name: "setup-detail", params: { id: setupId.toString() } });
    },

    deleteSetup(setupId: number): void {
      ipcRenderer.send("deleteSetup", setupId);
    }
  }
});
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
      margin-bottom: 10px;
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

        .action-btn:not(:last-child) {
          margin-right: 5px;
        }
      }
    }
  }
}
</style>


