<template>
  <div class="setups">
    <div class="actions">
      <button class="button" @click="navigateToDetail(0)">
        <span class="icon">
          <v-icon name="plus" />
        </span>
        <span>Neues Setup</span>
      </button>
    </div>

    <div class="setup-list">
      <div class="subtitle">Setups</div>
      <SearchBar @update="searchValue=$event"></SearchBar>
      <table class="table is-fullwidth is-striped is-hoverable">
        <thead>
          <tr>
            <th>Name</th>
            <th class="column-statistics"></th>
            <th class="column-actions"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="setup in filteredSetupList" :key="setup.id">
            <td>{{setup.name}}</td>
            <td></td>
            <td>
              <button class="button" @click="navigateToDetail(setup.id)">
                <v-icon name="pencil-alt" />
              </button>
              <button class="button m-l-5" @click="downloadSetup(setup.id)">
                <v-icon name="download" />
              </button>
              <button class="button is-danger m-l-5" @click="deleteSetup(setup.id)">
                <v-icon name="trash-alt" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!setups.length">
        <span>Keine Setups vorhanden.</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { ipcRenderer } from "electron";
import { ConfigSetup } from "../db/entity/ConfigSetup";
import router from "../router";
import SearchBar from "../components/SearchBar.vue";
import Icon from "vue-awesome/components/Icon.vue";
import "vue-awesome/icons/download";
import "vue-awesome/icons/trash-alt";
import "vue-awesome/icons/plus";
import "vue-awesome/icons/pencil-alt";

export default Vue.extend({
  data() {
    return {
      setups: [] as ConfigSetup[],
      searchValue: "" as string
    };
  },

  components: {
    "v-icon": Icon,
    SearchBar
  },

  computed: {
    filteredSetupList(): ConfigSetup[] {
      return this.setups.filter((setup: ConfigSetup) =>
        this.matchesSearch(setup)
      );
    }
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
  }

  .setup-list {
    .subtitle {
      text-align: left;
      font-size: 1.6rem;
      margin-bottom: 20px;
    }

    table {
      table-layout: fixed;

      th {
        &.column-statistics {
          width: 30%;
        }

        &.column-actions {
          width: 160px;
        }
      }

      td {
        vertical-align: middle;
      }
    }
  }
}
</style>


