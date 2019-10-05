<template>
  <div class="search">
    <div class="control has-icons-left has-icons-right">
      <input
        class="input"
        type="text"
        placeholder="Suche"
        v-model="searchValue"
        @keyup="$emit('update', searchValue)"
      />
      <span class="icon is-left">
        <v-icon name="search" />
      </span>
      <span class="icon is-right">
        <button v-show="searchValue !== ''" class="delete" @click="clearSearch"></button>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Icon from "vue-awesome/components/Icon.vue";
import "vue-awesome/icons/search";
export default Vue.extend({
  data() {
    return {
      searchValue: "" as string
    };
  },

  components: {
    "v-icon": Icon
  },

  methods: {
    clearSearch() {
      this.searchValue = "";
      this.$emit("update", this.searchValue);
    }
  }
});
</script>

<style lang="scss" scoped>
.search {
  margin-bottom: 20px;
}
</style>