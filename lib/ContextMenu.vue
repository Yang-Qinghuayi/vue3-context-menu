<script lang="ts">
import type { PropType } from "vue";
import { defineComponent, h } from "vue";
import type {
  ContextMenuGlobalData,
  ContextMenuPositionData,
  MenuItem,
  MenuOptions,
} from "./ContextMenuDefine";
import { MenuConstOptions } from "./ContextMenuDefine";
import ContextSubMenuConstructor from "./ContextSubMenu.vue";

export default defineComponent({
  name: "ContextMenu",
  props: {
    options: {
      type: Object as PropType<MenuOptions>,
      default: null,
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:show", "close"],
  data() {
    return {
      currentShowPos: {
        x: 0,
        y: 0,
      } as ContextMenuPositionData,
    };
  },
  watch: {
    show(v: boolean) {
      if (v) this.updateCurrentShowPos();
    },
  },
  mounted() {
    this.updateCurrentShowPos();
    setTimeout(() => {
      document.addEventListener("click", this.close);
      document.addEventListener("contextmenu", this.close);
    }, 100);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.close);
  },
  methods: {
    updateCurrentShowPos() {
      this.currentShowPos.x = this.options.x;
      this.currentShowPos.y = this.options.y;
    },
    close() {
      this.$emit("update:show", false);
      this.$emit("close");
    },
    onChildrenClose(byUserClick: boolean) {
      if (byUserClick) {
        this.$emit("close");
        this.$emit("update:show", false);
      }
    },
    onChildrenUpdatePos(newPos: ContextMenuPositionData) {
      this.currentShowPos.x = newPos.x;
      this.currentShowPos.y = newPos.y;
    },
    onHostMouseUp(e: MouseEvent) {
      if ((e.target as HTMLElement).className === "context-menu-overlay") {
        this.$emit("update:show", false);
        this.$emit("close");
      }
    },
  },
  render() {
    if (!this.show) return null;

    return h(
      "div",
      {
        class: "context-menu-overlay",
        style: {
          display: "flex",
          left: 0,
          position: "fixed",
          top: 0,
          bottom: 0,
          right: 0,
          pointerEvents: "none",
          zIndex: this.options.zIndex || MenuConstOptions.defaultStartZindex,
        },
        onMouseUp: this.onHostMouseUp,
      },
      [
        h(ContextSubMenuConstructor, {
          theme: this.options.theme,
          items: this.options.items,
          parentItem: {
            maxWidth: this.options.maxWidth || MenuConstOptions.defaultMaxWidth,
            minWidth: this.options.minWidth || MenuConstOptions.defaultMinWidth,
          } as MenuItem,
          options: this.options,
          zIndex:
            (this.options.zIndex || MenuConstOptions.defaultStartZindex) + 1,
          globalData: {
            parentPosition: {
              x: 0,
              y: 0,
            },
            screenSize: {
              w: window.innerWidth,
              h: window.innerHeight,
            },
          } as ContextMenuGlobalData,
          position: this.currentShowPos as ContextMenuPositionData,
          onClose: this.onChildrenClose,
          onPreUpdatePos: this.onChildrenUpdatePos,
        }),
      ]
    );
  },
});
</script>
