import type { App } from 'vue'
import ContextMenu from './ContextMenu.vue'
import ContextSubMenuVue from './ContextSubMenu.vue'
import $contextmenu, { useContextMenu, mixinAppContext } from './ContextMenuInstance'

export * from './ContextMenuDefine'

export function createContextMenu() {
    const install = (app: App<Element>): void => {
        app.config.globalProperties.$contextmenu = $contextmenu
        app.component('ContextMenu', ContextMenu)
        app.component('ContextSubMenu', ContextSubMenuVue)
        mixinAppContext(app._context)
    }
    return {
        install,
    }
}
export {
    useContextMenu
}

