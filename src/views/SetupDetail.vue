<template>
  <div class="setup-detail">
    <div class="actions">
      <b-button class="action-btn" @click="navigateBack()">Zurück</b-button>
      <b-button class="action-btn" @click="submit">Speichern</b-button>
    </div>
    <div class="parameter-meta">
      <h2 class="subtitle">Meta Daten</h2>
      <b-field>
        <b-input type="text" placeholder="Name" v-model="setupName" expanded></b-input>
      </b-field>
    </div>
    <div class="parameter-list">
      <h2 class="subtitle">Parameter</h2>
      <div v-for="parameter in parameters" :key="parameter.id">
        <ConfigDetail v-bind:parameter="parameter"></ConfigDetail>
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
      setupName: "" as string
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

h2 {
  text-align: left;
  margin-bottom: 10px;
}

.parameter-meta {
  margin-bottom: 50px;
}
</style>

