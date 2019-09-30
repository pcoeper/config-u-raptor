<template>
  <div class="setups">
    <div class="actions">
      <div class="button action-btn" @click="navigateToDetail(0)">Hinzufügen</div>
    </div>

    <div class="setup-list">
      <div class="subtitle">Setups</div>
      <div class="search">
        <div class="control">
          <input class="input" type="text" placeholder="Suche" v-model="searchValue" />
        </div>
      </div>
      <div v-if="!setups.length">
        <span>Keine Setups vorhanden.</span>
      </div>
      <table>
        <tbody>
          <template v-for="setup in setups">
            <template v-if="matchesSearch(setup)">
              <tr :key="setup.id">
                <td class="item-name">{{setup.name}}</td>
                <td class="item-actions">
                  <div class="button action-btn" @click="navigateToDetail(setup.id)">Bearbeiten</div>
                  <div class="button action-btn" @click="downloadSetup(setup.id)">
                    <v-icon name="arrow-alt-circle-down"></v-icon>
                  </div>
                  <div class="button is-danger action-btn" @click="deleteSetup(setup.id)">
                    <v-icon name="trash-alt"></v-icon>
                  </div>
                </td>
              </tr>
            </template>
          </template>
        </tbody>
      </table>
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
      setups: [] as ConfigSetup[],
      searchValue: "" as string
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
    },

    matchesSearch(setup: ConfigSetup): boolean {
      return (
        this.searchValue === "" ||
        setup.name.toLowerCase().includes(this.searchValue.toLowerCase())
      );
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
    .subtitle {
      text-align: left;
      font-size: 1.6rem;
      margin-bottom: 20px;
    }

    .search {
      margin-bottom: 50px;
    }

    table {
      table-layout: fixed;
      width: 100%;

      border-collapse: separate;
      border-spacing: 0 10px;

      tr {
        .item-name {
          width: auto;
          font-weight: 600;
          padding: 0 10px;
          vertical-align: middle;
        }

        .item-actions {
          width: 200px;

          .action-btn:not(:last-child) {
            margin-right: 5px;
          }
        }
      }
    }
  }
}
</style>


