<template>
  <div class="settings">
    <div class="subtitle">Einstellungen</div>
    <div class="columns">
      <div class="column is-two-third">
        <label class="label">Speicherpfad</label>
        <div class="field has-addons">
          <div class="control is-expanded">
            <input class="input" type="text" v-model="filePath" />
          </div>
          <div class="control">
            <button class="button" v-show="filePath === ''">
              <v-icon name="folder-open" />
            </button>
            <button class="button is-danger" v-show="filePath !== ''">
              <v-icon name="trash-alt" />
            </button>
          </div>
        </div>
      </div>
      <div class="column is-one-third">
        <label class="label">Dateiname</label>
        <input class="input" type="text" v-model="fileName" />
      </div>
      <div>{{filePath}}</div>
      <div>{{fileName}}</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Icon from "vue-awesome/components/Icon.vue";
import "vue-awesome/icons/folder-open";
import "vue-awesome/icons/trash-alt";
export default Vue.extend({
  data() {
    return {
      filePath: "" as string,
      fileName: "" as string
    };
  },

  components: {
    "v-icon": Icon
  }
});
</script>

<style lang="scss" scoped>
.settings {
  .subtitle {
    text-align: left;
    font-size: 1.6rem;
    margin-bottom: 20px;
  }
}
</style>
