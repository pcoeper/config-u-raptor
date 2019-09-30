<template>
  <div class="setup-detail">
    <div class="actions">
      <div class="button action-btn" @click="navigateBack()">Zurück</div>
      <div class="button action-btn" @click="submit">Speichern</div>
    </div>
    <div class="parameter-meta">
      <div class="subtitle">Meta Daten</div>
      <div class="control">
        <input class="input" type="text" placeholder="Name" v-model="setupName" />
      </div>
    </div>
    <div class="parameter-list">
      <div class="subtitle">Parameter</div>
      <div class="search">
        <div class="control">
          <input class="input" type="text" placeholder="Suche" v-model="searchValue" />
        </div>
      </div>
      <div v-for="parameter in parameters" :key="parameter.id">
        <ConfigDetail
          v-if="matchesSearch(parameter)"
          v-bind:parameter="parameter"
          v-bind:showDescription="false"
        ></ConfigDetail>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import Vue from "vue";
import { ipcRenderer } from "electron";
import { ConfigParameter } from "../db/entity/ConfigParameter";
import ConfigDetail from "./ConfigDetail.vue";
import router from "../router";

export default Vue.extend({
  data() {
    return {
      parameters: [] as ConfigParameter[],
      setupId: 0 as number,
      setupName: "" as string,
      searchValue: "" as string
    };
  },

  components: {
    ConfigDetail
  },

  created() {
    this.setupId = +this.$route.params.id;
    ipcRenderer.send("getSetup", this.setupId);
    ipcRenderer.on(
      "replySetup",
      (_: any, args: { name: string; parameters: ConfigParameter[] }) => {
        this.setupName = args.name;
        this.parameters = args.parameters;
      }
    );
    ipcRenderer.on("navigateBack", () => {
      this.navigateBack();
    });
  },

  destroyed() {
    // clear all listeners
    ipcRenderer.removeAllListeners("replySetup");
    ipcRenderer.removeAllListeners("navigateBack");
  },

  methods: {
    submit() {
      ipcRenderer.send("saveSetupParameter", {
        setupId: this.setupId,
        setupName: this.setupName,
        parameters: this.parameters
      });
    },

    navigateBack() {
      router.push({ name: "setup-list" });
    },

    matchesSearch(parameter: ConfigParameter): boolean {
      return (
        this.searchValue === "" ||
        parameter.name.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        parameter.defaultValue
          .toLowerCase()
          .includes(this.searchValue.toLowerCase())
      );
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

.subtitle {
  text-align: left;
  font-size: 1.6rem;
  margin-bottom: 20px;
}

.parameter-meta {
  margin-bottom: 50px;
}

.search {
  margin-bottom: 50px;
}
</style>

