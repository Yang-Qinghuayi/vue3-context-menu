/* eslint-disable import/no-unresolved */
// Styles

import 'vuetify/lib/styles/main.sass'

// Vuetify
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/lib/components/index'
import * as directives from 'vuetify/lib/directives/index'
import { aliases, mdi } from 'vuetify/lib/iconsets/mdi-svg'
import themes from './theme'
export default createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
        mdi,
        },
    },
    theme: {
        defaultTheme: 'RedSandDunesLight',
        themes,
      },
})
