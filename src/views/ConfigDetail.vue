<template>
  <div class="config-detail" v-bind:class="{'isEditMode': isEditMode}">
    <div class="parameter.name">
      <b-field>
        <b-input type="text" v-model="parameter.name" :disabled="!isEditMode" expanded></b-input>
      </b-field>
    </div>

    <div class="parameter-type">
      <b-field>
        <b-select v-model="parameter.type" expanded :disabled="!isEditMode">
          <option value="string">String</option>
          <option value="number">Number</option>
          <option value="boolean">Boolean</option>
        </b-select>
      </b-field>
    </div>
    <div class="parameter-value">
      <b-field>
        <div v-if="parameter.type === 'string'">
          <b-input type="text" v-model.trim="value"></b-input>
        </div>
        <div v-else-if="parameter.type === 'number'">
          <b-numberinput v-model="value"></b-numberinput>
        </div>
        <div v-else-if="parameter.type === 'boolean'">
          <b-switch v-model="value">{{ value }}</b-switch>
        </div>
      </b-field>
    </div>
    <div v-if="isEditMode" class="actions">
      <b-button @click="deleteParameter" type="is-danger">
        <v-icon name="trash-alt"/>
      </b-button>
    </div>

    <div v-if="isEditMode" class="parameter-description">
      <b-field>
        <b-input type="textarea" v-model="parameter.description" expanded></b-input>
      </b-field>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { ConfigParameter } from "../db/entity/ConfigParameter";
import { Prop, Watch } from "vue-property-decorator";
import { ipcRenderer } from "electron";
import Icon from "vue-awesome/components/Icon.vue";
import "vue-awesome/icons/trash-alt";

@Component({ components: { "v-icon": Icon } })
export default class ConfigDetail extends Vue {
  @Prop()
  public parameter!: ConfigParameter;

  @Prop({ default: false })
  public editMode!: boolean;

  public value: any = "";

  private showDebug: boolean = false;

  public created() {
    this.convertValue();
  }

  get isEditMode(): boolean {
    return this.editMode;
  }

  @Watch("parameter.type")
  public onTypeChanged() {
    this.convertValue();
  }

  @Watch("value")
  public onValueChange() {
    this.parameter.defaultValue = this.value.toString();
    this.debugValueChange();
  }

  public debugValueChange() {
    if (this.showDebug) {
      // logging / debug
      console.log(
        "defaultvalue is: " +
          this.parameter.defaultValue +
          ' (' +
          typeof this.parameter.defaultValue +
          ')'
      );
      console.log('value is: ' + this.value + ' (' + typeof this.value + ')');
    }
  }

  public deleteParameter(): void {
    this.$emit('delete-parameter', this.parameter);
  }

  /**
   * Converts 'value' according to the defined parameter type
   */
  private convertValue(): void {
    if (this.parameter.type === 'string') {
      this.value = this.parameter.defaultValue;
    } else if (this.parameter.type === 'number') {
      const numberRep = Number(this.parameter.defaultValue);
      this.value = isNaN(numberRep) ? 0 : numberRep;
    } else if (this.parameter.type === 'boolean') {
      const booleanRep =
        this.parameter.defaultValue === 'true' ||
        this.parameter.defaultValue === 'false';
      this.value = this.parameter.defaultValue === 'true' ? true : false;
    }
    this.parameter.defaultValue = this.value.toString();
    this.debugValueChange();
  }
}
</script>

<style lang="scss">
.config-detail {
  display: grid;

  grid-template-columns: 5fr 1fr 2fr auto;
  grid-template-rows: 1fr;
  grid-template-areas: "name type value value";
  grid-column-gap: 2rem;

  padding: 20px 0;
  border-bottom: 1px solid black;

  &.isEditMode {
    grid-template-rows: 1fr auto;
    grid-row-gap: 1rem;
    grid-template-areas:
      "name type value action"
      "description description description description";
  }
  .parameter-name {
    grid-area: name;
    justify-self: start;
  }

  .parameter-type {
    grid-area: type;
  }

  .parameter-value {
    grid-area: value;
  }

  .actions {
    grid-area: action;
    justify-self: center;
  }

  .parameter-description {
    grid-area: description;
    // justify-self: start;
  }
}
</style>



