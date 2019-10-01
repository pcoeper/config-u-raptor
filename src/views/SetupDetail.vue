<template>
  <div class="setup-detail">
    <div class="actions">
      <div class="button" @click="navigateBack()">Zurück</div>
      <div class="button is-primary m-l-5" @click="submit">Speichern</div>
    </div>
    <div class="parameter-meta">
      <div class="subtitle">Setup Name</div>
      <div class="control">
        <input class="input" type="text" placeholder="Name" v-model="setupName" />
      </div>
    </div>
    <div class="parameter-list">
      <div class="subtitle">Parameter</div>
      <div class="search">
        <div class="control has-icons-left">
          <input class="input" type="text" placeholder="Suche" v-model="searchValue" />
          <span class="icon is-left">
            <v-icon name="search" />
          </span>
        </div>
      </div>
      <table class="table is-fullwidth is-striped is-hoverable">
        <thead>
          <tr>
            <th>Name</th>
            <th class="column-values">Wert</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="parameter in filteredParameterList" :key="parameter.id">
            <td>{{parameter.name}}</td>
            <td class="column-values">
              <div v-if="parameter.type === 'string'">
                <div class="control">
                  <input
                    class="input"
                    type="text"
                    placeholder="Wert"
                    v-model.trim="parameter.defaultValue"
                  />
                </div>
              </div>
              <div v-else-if="parameter.type === 'number'">
                <div class="control">
                  <input class="input" type="number" v-model="parameter.defaultValue" />
                </div>
              </div>
              <div v-else-if="parameter.type === 'boolean'">
                <div class="control">
                  <div class="select is-expanded">
                    <select v-model="parameter.defaultValue">
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>


<script lang="ts">
import Vue from "vue";
import { ipcRenderer } from "electron";
import { ConfigParameter } from "../db/entity/ConfigParameter";
import router from "../router";
import Icon from "vue-awesome/components/Icon.vue";
import "vue-awesome/icons/search";

export default Vue.extend({
  data() {
    return {
      parameters: [] as ConfigParameter[],
      setupId: 0 as number,
      setupName: "" as string,
      searchValue: "" as string
    };
  },

  components: { "v-icon": Icon },

  computed: {
    filteredParameterList(): ConfigParameter[] {
      return this.parameters.filter((parameter: ConfigParameter) =>
        this.matchesSearch(parameter)
      );
    }
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

table {
  table-layout: fixed;

  .column-values {
    width: 30%;

    .select {
      &.is-expanded {
        width: 100%;

        select {
          width: 100%;
        }
      }
    }
  }
}
</style>

