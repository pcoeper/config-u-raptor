<template>
  <div class="config-detail">
    <table>
      <tbody>
        <tr>
          <td class="parameter-name">
            <div class="control">
              <input
                class="input"
                type="text"
                placeholder="Name"
                v-model="parameter.name"
                :disabled="!isEditMode"
              />
            </div>
          </td>
          <td class="parameter-type" v-if="isEditMode">
            <div class="control">
              <div class="select">
                <select v-model="parameter.type" :disabled="!isEditMode">
                  <option value="string">Text</option>
                  <option value="number">Zahl</option>
                  <option value="boolean">Boolean</option>
                </select>
              </div>
            </div>
          </td>
          <td class="parameter-value">
            <div>
              <div v-if="parameter.type === 'string'">
                <div class="control">
                  <input class="input" type="text" placeholder="Wert" v-model.trim="value" />
                </div>
              </div>
              <div v-else-if="parameter.type === 'number'">
                <div class="control">
                  <input class="input" type="number" v-model="value" />
                </div>
              </div>
              <div v-else-if="parameter.type === 'boolean'">
                <div class="control">
                  <div class="select is-expanded">
                    <select v-model="value">
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </td>
          <td v-if="isEditMode" class="actions">
            <div class="button is-danger" @click="deleteParameter">
              <v-icon name="trash-alt" />
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="isShowDescription" class="parameter-description">
      <textarea class="textarea" placeholder="Beschreibung" v-model="parameter.description"></textarea>
    </div>

    <hr class="spacer" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { ConfigParameter } from "../db/entity/ConfigParameter";
import { ipcRenderer } from "electron";
import Icon from "vue-awesome/components/Icon.vue";
import "vue-awesome/icons/trash-alt";

export default Vue.extend({
  props: {
    parameter: {
      type: Object,
      required: true
    },
    editMode: {
      type: Boolean,
      default: false
    },
    showDescription: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      value: null as any
    };
  },

  components: {
    "v-icon": Icon
  },

  created() {
    this.convertValue();
  },

  computed: {
    isEditMode(): boolean {
      return this.editMode;
    },

    isShowDescription(): boolean {
      return this.showDescription;
    },

    parameterType(): string {
      return this.parameter.type;
    }
  },

  watch: {
    value() {
      this.parameter.defaultValue = this.value.toString();
    },

    parameterType() {
      this.convertValue();
    }
  },

  methods: {
    deleteParameter(): void {
      this.$emit("delete-parameter", this.parameter);
    },

    /**
     * Converts 'value' according to the defined parameter type
     */
    convertValue(): void {
      if (this.parameter.type === "string") {
        this.value = this.parameter.defaultValue;
      } else if (this.parameter.type === "number") {
        const numberRep = Number(this.parameter.defaultValue);
        this.value = isNaN(numberRep) ? 0 : numberRep;
      } else if (this.parameter.type === "boolean") {
        this.value = this.parameter.defaultValue === "true" ? "true" : "false";
      }
      this.parameter.defaultValue = this.value.toString();
    }
  }
});
</script>

<style lang="scss" scoped>
.config-detail {
  table {
    width: 100%;
    table-layout: fixed;

    margin-bottom: 10px;

    td:not(:last-child) {
      padding-right: 10px;
    }

    .parameter-name {
      width: auto;
    }

    .parameter-type {
      width: 120px;
    }

    .parameter-value {
      width: 35%;
      text-align: center;
      vertical-align: middle;

      .select {
        &.is-expanded {
          width: 100%;

          select {
            width: 100%;
          }
        }
      }
    }

    .actions {
      width: 40px;
    }
  }

  .parameter-description {
    margin-bottom: 10px;
  }

  .spacer {
    background-color: black;
    height: 1px;
  }
}
</style>



