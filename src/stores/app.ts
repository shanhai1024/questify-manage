
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useAppStore = defineStore('app', ()=>{
  const primary = ref('#646cff')
  function setPrimary(c:string){
    primary.value=c
    document.documentElement.style.setProperty('--el-color-primary', c)
  }
  // load
  const cache = localStorage.getItem('app_primary')
  if(cache){ setPrimary(cache) }
  watch(primary,(v)=>localStorage.setItem('app_primary',v))
  return { primary, setPrimary }
})
