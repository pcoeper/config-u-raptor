<template>
  <div class='setup-detail'>
    <div class='actions'>
      <div class='button' @click='navigateBack()'>Zurück</div>
      <div class='button is-primary m-l-5' @click='submit'>Speichern</div>
    </div>
    <div class='parameter-meta'>
      <div class='subtitle'>Setup Name</div>
      <div class="columns">
          <div class="column is-full">
            <div class='control'>
                <input class='input' type='text' placeholder='Name' v-model='setup.name' />
            </div>
          </div>
        </div>
      <div class='columns'>
        <div class='column is-full'>
            <textarea class='textarea' placeholder='Beschreibung' v-model='setup.description'></textarea>
        </div>
      </div>
    </div>
    <div class='parameter-list'>
      <div class='subtitle'>Parameter</div>
      <SearchBar @update='searchValue=$event'></SearchBar>
      <table class='table is-fullwidth is-striped is-hoverable'>
        <thead>
          <tr>
            <th>Name</th>
            <th class='column-values'>Wert</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for='parameter in filteredParameterList' :key='parameter.id'>
            <td>{{parameter.name}}</td>
            <td class='column-values'>
              <div v-if='parameter.type === "string"'>
                <div class='control'>
                  <input
                    class='input'
                    type='text'
                    placeholder='Wert'
                    v-model.trim='parameter.defaultValue'
                  />
                </div>
              </div>
              <div v-else-if='parameter.type === "number"'>
                <div class='control'>
                  <input class='input' type='number' v-model='parameter.defaultValue' />
                </div>
              </div>
              <div v-else-if='parameter.type === "boolean"'>
                <div class='control'>
                  <div class='select is-expanded'>
                    <select v-model='parameter.defaultValue'>
                      <option value='true'>True</option>
                      <option value='false'>False</option>
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


<script lang='ts'>
import Vue from 'vue';
import { ipcRenderer } from 'electron';
import router from '../router';
import SearchBar from '../components/SearchBar.vue';
import { ConfigSetupModel } from '../models/ConfigSetup.model';
import { ConfigParameterModel } from '../models/ConfigParameter.model';

export default Vue.extend({
  data() {
    return {
      setup: new ConfigSetupModel() as ConfigSetupModel,
      searchValue: '' as string
    };
  },

  components: { SearchBar },

  computed: {
    filteredParameterList(): ConfigParameterModel[] {
      return this.setup.parameters.filter((parameter: ConfigParameterModel) =>
        this.matchesSearch(parameter)
      );
    }
  },

  created() {
    this.setup.id = +this.$route.params.id;
    ipcRenderer.send('getSetup', this.setup.id);
    ipcRenderer.on(
      'replySetup',
      (_: any, args: ConfigSetupModel) => {
        this.setup = args;
      }
    );
    ipcRenderer.on('navigateBack', () => {
      this.navigateBack();
    });
  },

  destroyed() {
    // clear all listeners
    ipcRenderer.removeAllListeners('replySetup');
    ipcRenderer.removeAllListeners('navigateBack');
  },

  methods: {
    submit() {
      ipcRenderer.send('saveSetupParameter', {
        setupId: this.setup.id,
        setupName: this.setup.name,
        setupDescription: this.setup.description,
        parameters: this.setup.parameters
      });
    },

    navigateBack() {
      router.push({ name: 'setup-list' });
    },

    matchesSearch(parameter: ConfigParameterModel): boolean {
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

table {
  table-layout: fixed;

  td {
    vertical-align: middle;
  }

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

