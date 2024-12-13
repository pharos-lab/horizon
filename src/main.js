import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { horizon } from './horizon.js'

const options = {
    header: {
        background: 'bg-slate-200',
        text: 'text-slate-900',
        hover: 'hover:bg-slate-300',
        cellPadding: 'px-5 py-2',
        fontSize: 'text-xl'
    },
    row: {
        background: 'bg-slate-200',
        text: 'text-slate-900',
        hover: 'hover:bg-red-100',
        cellPadding: 'px-4 py-2'
    }
}
createApp(App).use(horizon).mount('#app')
