<template>
  <v-sheet
    v-if="items"
    :theme="theme"
    ref="menu"
    :elevation="2"
    class="mx-context-menu py-0"
    :class="{
      'menu-overflow': menuOverflow,
      ready: menuReady,
      [options.customClass]: options.customClass,
    }"
    :style="{
      maxWidth:
        parentItem && parentItem.maxWidth
          ? `${parentItem.maxWidth}px`
          : `${constOptions.defaultMaxWidth}px`,
      minWidth:
        parentItem && parentItem.minWidth
          ? `${parentItem.minWidth}px`
          : `${constOptions.defaultMinWidth}px`,
      zIndex,
      left: `${position.x}px`,
      top: `${position.y}px`,
      '--height': `${menuHeight}px`,
      // '--width': `${menuWidth}px`,
    }"
    @mouseenter="onMenuMouseEnter"
    @mouseleave="onMenuMouseLeave($event)"
  >
    <div
      v-show="menuOverflow"
      class="mx-context-menu-updown up"
      @click="onScroll(false)"
    >
      <v-icon size="x-small" :icon="icon.mdiMenuUp"></v-icon>
    </div>
    <div
      v-show="menuOverflow"
      class="mx-context-menu-updown down"
      @click="onScroll(true)"
    >
      <v-icon size="x-small" :icon="icon.mdiMenuDown"></v-icon>
    </div>
    <v-list
      density="comfortable"
      class="mx-context-menu-items"
      :style="{
        maxHeight: maxHeight > 0 ? `${maxHeight}px` : '',
      }"
    >
      <template v-for="(item, i) in items">
        <v-divider
          v-if="item.divided"
          :key="`divider-${i}`"
          class="my-2"
        ></v-divider>
        <v-list-item
          v-else
          :key="`item-${i}`"
          class="mx-context-menu-item justify-start"
          :disabled="item.disabled"
          @mouseenter="showChildItem($event, item)"
          @mouseleave="hideChildItem()"
          @focus="showChildItem($event, item)"
          @blur="hideChildItem()"
          @click="onMouseClick(item)"
        >
          <template #prepend>
            <v-icon
                v-if="item.icon"
                :icon="item.icon"
                size="20"
                class="text-onSurfaceVariant mr-2"
            ></v-icon>
          </template>

          <v-list-item-title
            class="text-onSurface"
            :class="listTitleMargin(item)"
          >
            {{ item.label }}
          </v-list-item-title>
          <template #append>
            <v-icon
                v-if="item.children && item.children.length > 0"
                size="20"
                class="text-onSurfaceVariant"
                :icon="icon.mdiMenuRight"
            ></v-icon>
          </template>

        </v-list-item>
      </template>
    </v-list>
    <ContextSubMenu
      v-if="activeItem && activeItem.children"
      ref="childMenu"
      :z-index="zIndex + 1"
      :level="level + 1"
      :items="activeItem.children"
      :parent-item="activeItem"
      :options="options"
      :theme="theme"
      :global-data="childGlobalData"
      :position="childPosition"
      @close="onChildrenClose"
      @keepOpen="onChildrenKeepOpen"
      @preUpdatePos="onChildrenUpdatePos"
    ></ContextSubMenu>
  </v-sheet>
</template>

<script lang="ts">
import {mdiMenuDown, mdiMenuRight, mdiMenuUp} from "@mdi/js";
import {
  ComponentPublicInstance,
  computed,
  defineComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  PropType,
  ref,
  toRefs,
  watch
} from "vue";

import {useElementBounding} from "@vueuse/core";
import type {ContextMenuGlobalData, ContextMenuPositionData, MenuItem, MenuOptions,} from "./ContextMenuDefine";
import {MenuConstOptions} from "./ContextMenuDefine";

const scrollBtnHeight = 4
export default defineComponent({
  name: "ContextSubMenu",
  props: {
    items: {
      type: Object as PropType<Array<MenuItem>>,
      default: null,
    },
    parentItem: {
      type: Object as PropType<MenuItem>,
      default: null,
    },
    options: {
      type: Object as PropType<MenuOptions>,
      default: null,
    },
    zIndex: {
      type: Number,
      default: 9999,
    },
    globalData: {
      type: Object as PropType<ContextMenuGlobalData>,
      default: null,
    },
    position: {
      type: Object as PropType<ContextMenuPositionData>,
      default: null,
    },
    theme: {
      type: String,
      default: "light",
    },
    level: {
      type: Number,
      default: 0,
    }
  },
  emits: ["close", "keepOpen", "preUpdatePos"],
  setup(prop, context) {
    const { globalData, position, options, parentItem } = toRefs(prop);

    const menu = ref<ComponentPublicInstance>();
    const childMenu = ref();
    const menuReady = ref(false);
    const menuOverflow = ref(false);
    let nextShouldHideItem = null as MenuItem | null;
    const maxHeight = ref(0);
    const activeItem = ref<MenuItem | null>(null);
    const childGlobalData = ref({
      parentPosition: { x: 0, y: 0 },
      screenSize: globalData.value.screenSize,
    } as ContextMenuGlobalData);
    const childPosition = ref<ContextMenuPositionData>({
      x: 0,
      y: 0,
    });
    const menuHeight = ref(0);

    const hasIcon = computed(() => {
      return prop.items.some((i) => !!i.icon);
    });
    const hasSubMenu = computed(() => {
      return prop.items.some((i) => i.children?.length);
    });
    //显示和隐藏子菜单
    async function showChildItem(e: Event, item: MenuItem) {

      if (item.disabled || !item.children || item.children.length == 0) return;
      if (activeItem.value === item) return;

      //同步父菜单的位置
      // await deley(250)
      activeItem.value = item;
      childGlobalData.value.parentPosition.x =
        globalData.value.parentPosition.x + position.value.x;
      childGlobalData.value.parentPosition.y =
        globalData.value.parentPosition.y + position.value.y;

      const { width } = useElementBounding(menu);
      //计算子菜单的位置
      if (menu.value)
        childPosition.value.x = width.value + (options.value.xOffset || 0);
      const currentItemEle = e.target as HTMLElement;

      if (currentItemEle)
        childPosition.value.y =
          currentItemEle.offsetTop + (options.value.yOffset || 0);
    }
    function hideChildItem() {
      nextShouldHideItem = activeItem.value;
      setTimeout(() => {
        if (nextShouldHideItem === activeItem.value) activeItem.value = null;
      }, 300);
    }

    watch(activeItem, (newV: MenuItem | null, oldV: MenuItem | null) => {
      if (newV && oldV) {
        setTimeout(() => {
          if (childMenu.value) childMenu.value.doCheckPos();
        }, 50);
      }
    });

    //子菜单事件
    function onChildrenClose(byUserClick: boolean) {
      hideChildItem();
      if (byUserClick) context.emit("close", true);
    }
    function onChildrenKeepOpen(item: MenuItem) {
      if (nextShouldHideItem === item) nextShouldHideItem = null;
      context.emit("keepOpen", parentItem.value);
    }
    function onChildrenUpdatePos(newPos: ContextMenuPositionData) {
      childPosition.value.x = newPos.x;
      childPosition.value.y = newPos.y;
    }
    //鼠标事件
    function onMouseClick(item: MenuItem) {
      if (!item.disabled) {
        if (typeof item.onClick === "function") {
          item.onClick(item);
          context.emit("close", true);
        } else if (!item.children || item.children.length === 0) {
          context.emit("close", true);
        }
      }
    }
    function onMenuMouseEnter() {
      context.emit("keepOpen", parentItem.value);
    }
    function onMenuMouseLeave(e: MouseEvent) {
      if (e.relatedTarget != null) context.emit("close", false);
    }

    //滚动
    function onScroll(down: boolean) {
      if (menu.value) {
        menu.value.$el.scrollTop += down ? 8 : -8;
      }
    }

    let solveOverflowTimeOut = 0;

    //检查菜单是否超出屏幕
    function doCheckPos() {
      const _menu = menu.value;
      const _globalData = globalData.value;
      if (_menu) {
        const newPos = {
          x: position.value.x,
          y: position.value.y,
        } as ContextMenuPositionData;

        //如果X绝对位置超出屏幕， pin到左侧
        const absRight =
          _globalData.parentPosition.x +
          position.value.x +
          _menu.$el.offsetWidth;
        if (absRight > _globalData.screenSize.w) {
          if (prop.level  === 0) {
            newPos.x = position.value.x - _menu.$el.offsetWidth
          } else {
            const parentMenu = _menu.$parent?.$parent?.$el
            newPos.x = position.value.x - _menu.$el.offsetWidth - parentMenu.offsetWidth - 2
          }
          // newPos.x -= absRight - _globalData.screenSize.w;
        }

        //如果高度超出屏幕，那么限制最高高度
        if (_menu.$el.scrollHeight > _globalData.screenSize.h - scrollBtnHeight * 2) {
          maxHeight.value = _globalData.screenSize.h - 8;
          //  强制限制Y坐标为0
          newPos.y = -_globalData.parentPosition.y;
          menuOverflow.value = true;
        } else {
          menuOverflow.value = false;
          maxHeight.value = 0;
          //如果Y绝对位置超出屏幕，那么减去超出的高度
          const absTop =
            _globalData.parentPosition.y +
            position.value.y +
            _menu.$el.scrollHeight;
          const offset = options.value.offsetFooter ?? 0
          if (absTop > _globalData.screenSize.h) {
            newPos.y -= absTop - _globalData.screenSize.h + offset + scrollBtnHeight * 2;
          }
        }

        context.emit("preUpdatePos", newPos);
        menuReady.value = true;
      }
    }

    onMounted(() => {
      nextTick().then(() => {
        doCheckPos()
        // solveOverflowTimeOut = window.setTimeout(() => , 0);
        startAnimation();
      })

    });
    onBeforeUnmount(() => {
      if (solveOverflowTimeOut > 0) {
        clearTimeout(solveOverflowTimeOut);
        solveOverflowTimeOut = 0;
      }
    });
    async function startAnimation() {
      await nextTick();
      const el = menu.value?.$el;
      menuHeight.value = el.scrollHeight ?? 0;
      el.style.animation = "menuAnimation 150ms ease-in-out 0s both";
    }
    function listTitleMargin(item: MenuItem) {
      return {
        "ml-8": !item.icon && hasIcon.value,
        "mr-5": !(item.children && item.children.length) && hasSubMenu.value,
      };
    }
    return {
      menu,
      menuOverflow,
      childMenu,
      menuReady,
      maxHeight,
      showChildItem,
      hideChildItem,
      onChildrenClose,
      onChildrenKeepOpen,
      onChildrenUpdatePos,
      onMenuMouseLeave,
      onMenuMouseEnter,
      onMouseClick,
      onScroll,
      doCheckPos,
      activeItem,
      childGlobalData,
      childPosition,
      constOptions: MenuConstOptions,
      icon: {
        mdiMenuRight,
        mdiMenuDown,
        mdiMenuUp,
      },
      menuHeight,
      listTitleMargin,
      // menuWidth,
    };
  },
});
</script>
<style lang="scss">
.mx-context-menu {
  pointer-events: auto;
  //overflow: initial;
  position: absolute !important;
  // animation: menuAnimation 4s 0s both;
  transform-origin: top left;
  //height: 0;
  .mx-context-menu-items {
    position: relative;
    overflow: hidden;
    overflow-y: scroll;
    border-radius: inherit;
    background: inherit;
    &.menu-overflow {
      padding: 16px 0;
    }
    &::-webkit-scrollbar {
      display: none;
    }
    .mx-context-menu-item {
      user-select: none;
      padding-inline-start: 12px !important;
      padding-inline-end: 12px !important;
      display: flex;
      align-items: center;
      .v-list-item-title {
        font-size: 0.875rem;
        font-weight: 500;
        max-width: 280px;
      }
      .v-list-item__append {
        margin-left: auto;
      }
      &.v-list-item--disabled {
        filter: opacity(0.38);
      }
    }
  }
  .mx-context-menu-updown {
    display: flex;
    justify-content: center;
    position: absolute;
    left: 0;
    right: 0;
    height: 10px;
    border-radius: 10px;
    user-select: none;
    cursor: pointer;
    z-index: 1;
  }

  .mx-context-menu-updown.up {
    top: 0;
  }
  .mx-context-menu-updown.down {
    bottom: 0;
  }
}

@keyframes menuAnimation {
  0% {
    opacity: 0;
    transform: scale(0.95);;
  }

  100% {
    //height: var(--height);
    opacity: 1;
    transform: scale(1);
    border-radius: 4px;
  }
}

</style>