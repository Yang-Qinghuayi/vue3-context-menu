<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import logo from "./assets/logo.png";
import { mdiAccountHeart , mdiArrowCollapseVertical, mdiAccountBox, mdiBriefcaseVariant, mdiBusClock, mdiCogs  } from "@mdi/js";
import { useContextMenu } from "../lib/main";
const contextMenu = useContextMenu();
const menus = [
    {
      label: '带图标菜单项',
      onClick: () => {
        alert('You click a menu item')
      },
      icon: mdiAccountHeart,
    },
    {
      label: '菜单项 2',
      disabled: true,
      onClick: () => {
        alert('You click a menu item')
      },
      icon: mdiArrowCollapseVertical,
    },
    {
      label: '带子菜单 很长 很长 很长 很长 很长',
      icon: mdiAccountBox,
      onClick: () => {
        alert('You click a menu item')
      },
      children: [
        {
          label: 'A submenu item 4',
          onClick: () => {
            alert('You click a submenu item')
          },
        },
        {
          label: 'A submenu item 5',
          onClick: () => {
            alert('You click a submenu item')
          },
        },
        {
          label: 'A submenu item 6',
          onClick: () => {
            alert('You click a submenu item')
          },
        },
      ],
    },
    {
      label: '带子菜单 4',
      icon: mdiBriefcaseVariant,
      onClick: () => {
        alert('You click a menu item')
      },
      children: [
        {
          label: 'A submenu item 1',
          onClick: () => {
            alert('You click a submenu item')
          },
        },
        {
          label: 'A submenu item 2',
          onClick: () => {
            alert('You click a submenu item')
          },
        },
        {
          label: 'A submenu item 3',
          onClick: () => {
            alert('You click a submenu item')
          },
        },
      ],
    },
    {
      divided: true,
    },
    {
      icon: mdiBusClock,
      label: 'Menu Item 5',
      children: [
        {
          label: 'A submenu item 1',
          onClick: () => {
            alert('You click a submenu item')
          },
        },
        {
          label: 'A submenu item 2',
          onClick: () => {
            alert('You click a submenu item')
          },
        },
        {
          label: 'A submenu item 3',
          onClick: () => {
            alert('You click a submenu item')
          },
        },
      ],
    },
    {
      icon: mdiCogs,
      label: 'Menu Item 5',
      children: [
        {
          label: 'A submenu item 1',
          onClick: () => {
            alert('You click a submenu item')
          },
        },
        {
          label: 'A submenu item 2',
          onClick: () => {
            alert('You click a submenu item')
          },
        },
        {
          label: 'A submenu item 3',
          onClick: () => {
            alert('You click a submenu item')
          },
        },
      ],
    },
  ];
function openMenu(e: MouseEvent) {
  console.log("🚀 ~ file: App.vue ~ line 87 ~ openMenu ~ performance.now()", performance.now())
  contextMenu({
    theme: 'RedSandDunesLight',
    x: e.x,
    y: e.y,
    items: menus,
  });
}
</script>

<template>
  <v-app>
    <v-app-bar>
      <v-img alt="Vue logo" :src="logo" width="46" />
    </v-app-bar>
    <v-main>
      <v-container class="d-flex justify-center flex-column align-center pa-4">
        <v-btn color="primary" class="mb-2">hello vuetify</v-btn>
        <v-card
          elevation="2"
          height="300"
          width="300"
          color="grey"
          @contextmenu.prevent="openMenu"
          v-ripple
          class="d-flex justify-center align-center"
        >
          右键这里
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<style>
</style>
