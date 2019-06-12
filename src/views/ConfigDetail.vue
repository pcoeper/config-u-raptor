<template>
  <div class="config-detail">
    <div class="parameter-name">{{parameter.name}}</div>
    <div class="parameter-type">
      <select v-model="parameter.type">
        <option value="string">String</option>
        <option value="number">Number</option>
        <option value="boolean">Boolean</option>
      </select>
    </div>
    <div class="parameter-value">
      <div v-if="parameter.type === 'string'">
        <input type="text" v-model.trim="value">
      </div>
      <div v-else-if="parameter.type === 'number'">
        <input type="number" v-model.number="value">
      </div>
      <div v-else-if="parameter.type === 'boolean'">
        <input type="checkbox" v-model="value">
      </div>
    </div>
    <div>{{value}}</div>
    <div>{{parameter.defaultValue}}</div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { ConfigParameter } from "../db/entity/ConfigParameter";
import { Prop, Watch } from "vue-property-decorator";

@Component
export default class ConfigDetail extends Vue {
  @Prop()
  public parameter!: ConfigParameter;

  public value: any = this.parameter.defaultValue;

  @Watch("parameter.type")
  public onTypeChanged(value: string, oldValue: string) {
    if (this.parameter.type === "string") {
      this.value = this.parameter.defaultValue;
    } else if (this.parameter.type === "number") {
      const numberRep = Number(this.parameter.defaultValue);
      this.value = isNaN(numberRep) ? 0 : numberRep;
    } else if (this.parameter.type === "boolean") {
      const booleanRep =
        this.parameter.defaultValue === "true" ||
        this.parameter.defaultValue === 'false';
      this.value = this.parameter.defaultValue === 'true' ? true : false;
    }
  }

  @Watch('value')
  public onValueChanged(value: any, oldValue: any) {
    this.parameter.defaultValue = value.toString();

    // logging / debug
    console.log(
      'defaultvalue is: ' +
        this.parameter.defaultValue +
        ' (' +
        typeof this.parameter.defaultValue +
        ')'
    );
    console.log('value is: ' + this.value + ' (' + typeof this.value + ')');
  }
}
</script>

<style lang="scss">
.config-detail {
  display: grid;
  grid-template-columns: 5fr 1fr 2fr;
  grid-template-rows: 1fr;
  grid-template-areas: "name type value";
  grid-column-gap: 2rem;

  border-bottom: 1px solid black;
  padding: 20px 0;

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
}
</style>



