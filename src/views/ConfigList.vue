<template>
  <div class="config-list">
    <p>Config-List works!</p>
    <div v-for="parameter in parameters" :key="parameter.id">
      <p>{{parameter.name}}</p>
      <p>{{parameter.type}}</p>
      <p>{{parameter.defaultValue}}</p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { ipcRenderer, Event } from "electron";
import { ConfigParameter } from "../db/entity/ConfigParameter";

@Component({})
export default class ConfigList extends Vue {
  public message: string = "";
  public parameters: ConfigParameter[] = [];

  public created() {
    ipcRenderer.send("getAllConfigParameter");
    ipcRenderer.on(
      "replyAllConfigParameter",
      (_: any, arg: ConfigParameter[]) => {
        this.parameters = arg;
      }
    );
  }
}
</script>

