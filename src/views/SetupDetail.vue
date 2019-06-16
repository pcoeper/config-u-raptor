<template>
  <div class="setup-detail">
    <p>SetupDetail works</p>
    <p>{{$route.params.id}}</p>
    <div class="parameter-list">
      <h2 class="subtitle">Parameter</h2>
      <div v-for="parameter in parameters" :key="parameter.id">
        <ConfigDetail class="config-detail" v-bind:parameter="parameter"></ConfigDetail>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { ipcRenderer } from "electron";
import { ConfigParameter } from "../db/entity/ConfigParameter";
import ConfigDetail from "./ConfigDetail.vue";

@Component({ components: { ConfigDetail } })
export default class SetupDetail extends Vue {
  public parameters: ConfigParameter[] = [];

  public created() {
    const setupId = this.$route.params.id;
    ipcRenderer.send("getAllParameterOfSetup", setupId);
    ipcRenderer.on(
      "replyAllParametersOfSetup",
      (_: any, args: ConfigParameter[]) => {
        this.parameters = args;
      }
    );
  }

  public destroyed() {
    // clear all listeners
    ipcRenderer.removeAllListeners("replyAllParametersOfSetup");
  }
}
</script>
