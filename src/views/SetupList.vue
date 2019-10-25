<template>
  <div class='setups'>
    <div class='actions'>
      <button class='button' @click='navigateToDetail(0)'>
        <span class='icon'>
          <v-icon name='plus' />
        </span>
        <span>Neues Setup</span>
      </button>
    </div>

    <div class='setup-list'>
      <div class='subtitle'>Setups</div>
      <SearchBar @update='searchValue=$event'></SearchBar>
      <table class='table is-fullwidth is-striped is-hoverable'>
        <thead>
          <tr>
            <th class='column-name'>Name</th>
            <th class='column-descriptions'>Beschreibung</th>
            <th class='column-modifications'>Modifikationen</th>
            <th class='column-actions'></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for='setup in filteredSetupList' :key='setup.id'>
            <td>{{setup.name}}</td>
            <td>{{setup.description}}</td>
            <td>{{setup.modificationCount}}</td>
            <td>
              <button class='button' @click='navigateToDetail(setup.id)'>
                <v-icon name='pencil-alt' />
              </button>
              <button class='button m-l-5' @click='downloadSetup(setup.id)'>
                <v-icon name='download' />
              </button>
              <button class='button is-danger m-l-5' @click='deleteSetup(setup.id)'>
                <v-icon name='trash-alt' />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if='!setups.length'>
        <span>Keine Setups vorhanden.</span>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue';
import { ipcRenderer } from 'electron';
import router from '@/router';
import SearchBar from '@/components/SearchBar.vue';
import Icon from 'vue-awesome/components/Icon.vue';
import 'vue-awesome/icons/download';
import 'vue-awesome/icons/trash-alt';
import 'vue-awesome/icons/plus';
import 'vue-awesome/icons/pencil-alt';
import { ConfigSetupModel } from '@/models/ConfigSetup.model';
import { ConfigParameterModel } from '../models/ConfigParameter.model';

export default Vue.extend({
  data() {
    return {
      setups: [] as ConfigSetupModel[],
      searchValue: '' as string
    };
  },

  components: {
    'v-icon': Icon,
    SearchBar
  },

  computed: {
    filteredSetupList(): ConfigSetupModel[] {
      return this.setups.filter((setup: ConfigSetupModel) =>
        this.matchesSearch(setup)
      );
    }
  },

  created() {
    ipcRenderer.send('getAllConfigSetups');
    ipcRenderer.on('replyAllConfigSetups', (_: any, args: ConfigSetupModel[]) => {
      this.setups = args;
    });
    ipcRenderer.on('replyDownload', (_: any, status: boolean) => {
        if (status === true) {
            console.log('was saved');
        }
    });
  },

  destroyed() {
    // clear all listeners
    ipcRenderer.removeAllListeners('replyAllConfigSetups');
    ipcRenderer.removeAllListeners('replyDownload');
  },

  methods: {
    downloadSetup(setupId: number): void {
      ipcRenderer.send('downloadSetup', setupId);
    },

    navigateToDetail(setupId: number): void {
      router.push({ name: 'setup-detail', params: { id: setupId.toString() } });
    },

    deleteSetup(setupId: number): void {
      ipcRenderer.send('deleteSetup', setupId);
    },

    matchesSearch(setup: ConfigSetupModel): boolean {
      return (
        this.searchValue === '' ||
        setup.name.toLowerCase().includes(this.searchValue.toLowerCase())
      );
    }
  }
});
</script>

<style lang='scss' scoped>
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
          &.column-name {
              width: 150px;
          }

        &.column-modifications {
            width: 10%;
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


