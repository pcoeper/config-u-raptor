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
            <input class='input' type='text' v-model='filePath' readonly />
          </div>
          <div class='control'>
            <button class='button' v-show='filePath === ""' @click='openFilePath'>
              <v-icon name='folder-open' />
            </button>
            <button class='button is-danger' v-show='filePath !== ""' @click='filePath = ""'>
              <v-icon name='trash-alt' />
            </button>
          </div>
        </div>
      </div>
      <div class='column is-one-third'>
        <label class='label'>Dateiname</label>
        <input class='input' type='text' v-model='fileName' />
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
export default Vue.extend({
  data() {
    return {
      filePath: '' as string,
      fileName: '' as string
    };
  },

  components: {
    'v-icon': Icon
  },

  created() {
    ipcRenderer.on('replyFilePath', (_: any, filePath: string) => {
      this.filePath = filePath;
    });
  },

  destroyed() {
    // clear all listeners
    ipcRenderer.removeAllListeners('replyFilePath');
  },

  methods: {
    openFilePath() {
      ipcRenderer.send('openFilePath');
    },

    submit() {}
  }
});
</script>

<style lang='scss' scoped>
.settings {
  .actions {
    text-align: right;
  }
  .subtitle {
    text-align: left;
    font-size: 1.6rem;
    margin-bottom: 20px;
  }
}
</style>
