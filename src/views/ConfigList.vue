<template>
  <div class="config-list">
    <div class="actions">
      <div
        v-if="parameters.length"
        class="button is-danger action-btn"
        @click="deleteAll"
      >Alle Löschen</div>
      <div class="button action-btn" @click="openModal">Hinzufügen</div>
      <div class="button action-btn" @click="submit">Speichern</div>
    </div>
    <div class="show-description">
      <label class="checkbox">
        <input type="checkbox" v-model="showDescription" />
        <span class="checkbox-label">Beschreibung anzeigen</span>
      </label>
    </div>
    <div class="parameter-list" v-if="newParameters.length > 0">
      <div class="subtitle">Neue Parameter</div>
      <div v-for="parameter in newParameters" :key="parameter.id">
        <ConfigDetail
          v-bind:parameter="parameter"
          v-bind:editMode="true"
          v-bind:showDescription="showDescription"
          @delete-parameter="deleteParameter"
        ></ConfigDetail>
      </div>
    </div>

    <div class="parameter-list">
      <div class="subtitle">Parameter</div>
      <div class="search">
        <div class="control">
          <input class="input" type="text" placeholder="Suche" v-model="searchValue" />
        </div>
      </div>
      <div v-if="!parameters.length">Keine Konfigurationsparameter vorhanden.</div>
      <div v-for="parameter in parameters" :key="parameter.id">
        <ConfigDetail
          v-if="matchesSearch(parameter)"
          v-bind:parameter="parameter"
          v-bind:editMode="true"
          v-bind:showDescription="showDescription"
          @delete-parameter="deleteParameter"
        ></ConfigDetail>
      </div>
    </div>
    <ConfigParameterModal
      v-bind:show="showModal"
      v-bind:parameter="modalParameter"
      @closeModal="closeModal"
    ></ConfigParameterModal>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { ipcRenderer, Event } from "electron";
import { ConfigParameter } from "../db/entity/ConfigParameter";
import ConfigDetail from "./ConfigDetail.vue";
import ConfigParameterModal from "./ConfigParameterModal.vue";

export default Vue.extend({
  data() {
    return {
      parameters: [] as ConfigParameter[],
      newParameters: [] as ConfigParameter[],
      showDescription: true as boolean,
      searchValue: "" as string,
      showModal: false as boolean,
      modalParameter: {
        id: 0,
        name: "",
        type: "string",
        defaultValue: "",
        description: ""
      } as ConfigParameter
    };
  },

  components: {
    ConfigDetail,
    ConfigParameterModal
  },

  created() {
    ipcRenderer.send("getAllConfigParameter");
    ipcRenderer.on(
      "replyAllConfigParameter",
      (_: any, args: ConfigParameter[]) => {
        this.parameters = args;
      }
    );
  },

  destroyed() {
    // clear all listeners
    ipcRenderer.removeAllListeners("replyAllConfigParameter");
  },

  methods: {
    submit() {
      ipcRenderer.send(
        "saveAllConfigParameter",
        this.parameters.concat(this.newParameters)
      );
      this.newParameters = [];
    },

    openModal() {
      this.showModal = true;
    },

    closeModal() {
      this.showModal = false;
    },

    add() {
      const newParameter = new ConfigParameter();
      this.newParameters.push(newParameter);
    },

    deleteParameter(parameter: ConfigParameter) {
      if (parameter.id === undefined) {
        const parameterIndex = this.newParameters.findIndex(
          (param: ConfigParameter) => param === parameter
        );
        if (parameterIndex >= 0) {
          this.newParameters.splice(parameterIndex, 1);
        }
      } else {
        ipcRenderer.send("deleteConfigParameter", parameter.id);
      }
    },

    deleteAll() {
      ipcRenderer.send("deleteAllConfigParameter");
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
.config-list {
  .actions {
    text-align: right;

    .action-btn:not(:last-child) {
      margin-right: 5px;
    }
  }

  .show-description {
    text-align: right;
    margin-top: 10px;

    .checkbox-label {
      margin-left: 5px;
    }
  }

  .parameter-list {
    .search {
      margin-bottom: 50px;
    }

    .subtitle {
      text-align: left;
      font-size: 1.6rem;
      margin-bottom: 20px;
    }
  }
}
</style>

