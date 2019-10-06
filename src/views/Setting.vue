<template>
  <div class='settings'>
    <div class='actions'>
      <button class='button is-primary' @click='submit'>Speichern</button>
    </div>
    <div class='subtitle'>Einstellungen</div>
    <div class='columns'>
      <div class='column is-two-third'>
        <label class='label'>Speicherpfad</label>
        <div class='field has-addons'>
          <div class='control is-expanded'>
            <input class='input' type='text' v-model='setting.filePath' readonly />
          </div>
          <div class='control'>
            <button class='button' v-show='emptyFilePath' @click='openFilePath'>
              <v-icon name='folder-open' />
            </button>
            <button class='button is-danger' v-show='!emptyFilePath' @click='clearFilePath'>
              <v-icon name='trash-alt' />
            </button>
          </div>
        </div>
      </div>
      <div class='column is-one-third'>
        <label class='label'>Dateiname</label>
        <div class='field has-addons'>
            <div class='control is-expanded'>
                <input class='input' type='text' v-model='setting.fileName' />
            </div>
            <div class='control'>
                <div class='select is-expanded'>
                  <select v-model='setting.fileExtension'>
                    <option value='.properties'>.properties</option>
                    <option value='.txt'>.txt</option>
                  </select>
                </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue';
import Icon from 'vue-awesome/components/Icon.vue';
import 'vue-awesome/icons/folder-open';
import 'vue-awesome/icons/trash-alt';
import { ipcRenderer } from 'electron';
import { SettingModel } from '@/models/Setting.model';
export default Vue.extend({
  data() {
    return {
      setting: new SettingModel() as SettingModel
    };
  },

  components: {
    'v-icon': Icon
  },

  computed: {
    emptyFilePath(): boolean {
      return this.setting.filePath === '';
    }
  },

  created() {
    ipcRenderer.send('getSetting');
    ipcRenderer.on('replySetting', (_: any, setting: SettingModel) => {
      this.setting = setting;
    });
    ipcRenderer.on('replyFilePath', (_: any, filePath: string) => {
      this.setting.filePath = filePath;
    });
  },

  destroyed() {
    // clear all listeners
    ipcRenderer.removeAllListeners('replySetting');
    ipcRenderer.removeAllListeners('replyFilePath');
  },

  methods: {
    openFilePath() {
      ipcRenderer.send('openFilePath');
    },

    clearFilePath() {
      this.setting.filePath = '';
    },

    submit() {
      ipcRenderer.send('saveSetting', this.setting);
    }
  }
});
</script>

<style lang='scss' scoped>
.settings {
  .actions {
    text-align: right;
  }

  label {
      text-align: left;
  }

  .subtitle {
    text-align: left;
    font-size: 1.6rem;
    margin-bottom: 20px;
  }
}
</style>
