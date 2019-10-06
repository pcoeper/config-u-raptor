<template>
  <div class='config-parameter-modal'>
    <div class='modal' v-bind:class='{"is-active": show}'>
      <div class='modal-background'></div>
      <div class='modal-card'>
        <header class='modal-card-head'>
          <p class='modal-card-title'>Config Parameter</p>
        </header>
        <section class='modal-card-body'>
          <div class='columns'>
            <div class='column is-one-third'>
              <div class='control'>
                <input class='input' type='text' placeholder='Name' v-model='parameter.name' />
              </div>
            </div>
            <div class='column is-one-third'>
              <div class='control'>
                <div class='select is-expanded'>
                  <select v-model='parameter.type'>
                    <option value='string'>Text</option>
                    <option value='number'>Zahl</option>
                    <option value='boolean'>Boolean</option>
                  </select>
                </div>
              </div>
            </div>
            <div class='column is-one-third'>
              <div v-if='parameter.type === "string"'>
                <div class='control'>
                  <input class='input' type='text' placeholder='Wert' v-model.trim='value' />
                </div>
              </div>
              <div v-else-if='parameter.type === "number"'>
                <div class='control'>
                  <input class='input' type='number' v-model='value' />
                </div>
              </div>
              <div v-else-if='parameter.type === "boolean"'>
                <div class='control'>
                  <div class='select is-expanded'>
                    <select v-model='value'>
                      <option value='true'>True</option>
                      <option value='false'>False</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class='columns'>
            <div class='column is-full'>
              <textarea class='textarea' placeholder='Beschreibung' v-model='parameter.description'></textarea>
            </div>
          </div>
        </section>
        <footer class='modal-card-foot'>
          <button class='button is-primary' @click='saveParameter'>Speichern</button>
          <button class='button' @click='closeModal'>Abbrechen</button>
          <button
            v-if='parameter.id>0'
            class='button is-danger delete-button'
            @click='deleteParameter'
          >
            <v-icon name='trash-alt' />
          </button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue';
import { ConfigParameter } from '@/db/entity/ConfigParameter';
import Icon from 'vue-awesome/components/Icon.vue';
import 'vue-awesome/icons/trash-alt';

export default Vue.extend({
  props: {
    show: {
      type: Boolean,
      default: false
    },
    parameter: {
      type: Object,
      required: true
    }
  },

  components: {
    'v-icon': Icon
  },

  data() {
    return {
      value: null as any
    };
  },

  created() {
    this.convertValue();
  },

  computed: {
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
    saveParameter() {
      this.$emit('saveParameter', this.parameter);
    },

    deleteParameter() {
      this.$emit('deleteParameter', this.parameter);
    },

    closeModal(): void {
      this.$emit('closeModal');
    },

    /**
     * Converts 'value' according to the defined parameter type
     */
    convertValue(): void {
      if (this.parameter.type === 'string') {
        this.value = this.parameter.defaultValue;
      } else if (this.parameter.type === 'number') {
        const numberRep = Number(this.parameter.defaultValue);
        this.value = isNaN(numberRep) ? 0 : numberRep;
      } else if (this.parameter.type === 'boolean') {
        this.value = this.parameter.defaultValue === 'true' ? 'true' : 'false';
      }
      this.parameter.defaultValue = this.value.toString();
    }
  }
});
</script>

<style lang='scss' scoped>
.config-parameter-modal {
  .modal-card-body {
    .select {
      &.is-expanded {
        width: 100%;

        select {
          width: 100%;
        }
      }
    }
  }

  .modal-card-foot {
    button.delete-button {
      position: absolute;
      right: 20px;
    }
  }
}
</style>
