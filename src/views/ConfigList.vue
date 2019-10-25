<template>
  <div class='config-list'>
    <div class='actions'>
      <div v-if='parameters.length' class='button is-danger' @click='deleteAll'>Alle Löschen</div>
      <button class='button m-l-5' @click='addNewParameter'>
        <span class='icon'>
          <v-icon name='plus' />
        </span>
        <span>Neuer Parameter</span>
      </button>
    </div>

    <div class='parameter-list'>
      <div class='subtitle'>Parameter</div>
      <SearchBar @update='searchValue = $event'></SearchBar>
      <table class='table is-fullwidth is-striped is-hoverable'>
        <thead>
          <tr>
            <th>Name</th>
            <th class='column-values'>Standardwert</th>
            <th class='column-actions'></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for='parameter in filteredParameterList' :key='parameter.id'>
            <td>{{parameter.name}}</td>
            <td>{{parameter.defaultValue}}</td>
            <td>
              <button class='button is-primary' @click='editParameter(parameter)'>
                <v-icon name='arrow-circle-right' />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if='!parameters.length'>Keine Konfigurationsparameter vorhanden.</div>
    </div>

    <!-- config parameter modal -->
    <ConfigParameterModal
      v-if='showModal'
      v-bind:show='showModal'
      v-bind:parameter='modalParameter'
      @closeModal='closeModal'
      @saveParameter='saveParameter'
      @deleteParameter='deleteParameter'
    ></ConfigParameterModal>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue';
import { ipcRenderer, Event } from 'electron';
import { ConfigParameter } from '@/db/entity/ConfigParameter';
import ConfigParameterModal from '@/views/ConfigParameterModal.vue';
import SearchBar from '@/components/SearchBar.vue';
import Icon from 'vue-awesome/components/Icon.vue';
import 'vue-awesome/icons/plus';
import 'vue-awesome/icons/arrow-circle-right';

export default Vue.extend({
  data() {
    return {
      parameters: [] as ConfigParameter[],
      searchValue: '' as string,
      showModal: false as boolean,
      modalParameter: {} as ConfigParameter
    };
  },

  components: {
    'v-icon': Icon,
    ConfigParameterModal,
    SearchBar
  },

  computed: {
    filteredParameterList(): ConfigParameter[] {
      return this.parameters.filter((parameter: ConfigParameter) =>
        this.matchesSearch(parameter)
      );
    }
  },

  created() {
    ipcRenderer.send('getAllConfigParameter');
    ipcRenderer.on(
      'replyAllConfigParameter',
      (_: any, args: ConfigParameter[]) => {
        this.parameters = args;
      }
    );
  },

  destroyed() {
    // clear all listeners
    ipcRenderer.removeAllListeners('replyAllConfigParameter');
  },

  methods: {
    openModal() {
      this.showModal = true;
    },

    closeModal() {
      this.showModal = false;
    },

    addNewParameter() {
      this.modalParameter = new ConfigParameter();
      this.openModal();
    },

    saveParameter(parameter: ConfigParameter) {
      this.closeModal();
      ipcRenderer.send('saveConfigParameter', parameter);
    },

    editParameter(parameter: ConfigParameter) {
      this.modalParameter = parameter;
      this.openModal();
    },

    deleteParameter(parameter: ConfigParameter) {
      this.closeModal();
      ipcRenderer.send('deleteConfigParameter', parameter.id);
    },

    deleteAll() {
      ipcRenderer.send('deleteAllConfigParameter');
    },

    matchesSearch(parameter: ConfigParameter): boolean {
      return (
        this.searchValue === '' ||
        parameter.name.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        parameter.defaultValue
          .toLowerCase()
          .includes(this.searchValue.toLowerCase())
      );
    }
  }
});
</script>

<style lang='scss' scoped>
.config-list {
  .actions {
    text-align: right;
  }

  .parameter-list {
    .subtitle {
      text-align: left;
      font-size: 1.6rem;
      margin-bottom: 20px;
    }

    table {
      table-layout: fixed;

      th {
        &.column-values {
          width: 40%;
        }

        &.column-actions {
          width: 70px;
        }
      }

      td {
        vertical-align: middle;
      }
    }
  }
}
</style>

