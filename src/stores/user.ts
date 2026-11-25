import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as auth from '@/api/modules/auth'
export const useUserStore = defineStore('user', () => {
 const user=ref<auth.CurrentUser|null>(null), initialized=ref(false); let inflight:Promise<void>|null=null
 async function initialize(){ if(initialized.value)return; if(inflight)return inflight; inflight=(async()=>{try{user.value=(await auth.getCurrentUser()).data}catch{user.value=null}finally{initialized.value=true;inflight=null}})();return inflight }
 async function signIn(username:string,password:string){ await auth.getCsrfToken(); user.value=(await auth.login(username,password)).data; initialized.value=true }
 async function signOut(){ try{await auth.getCsrfToken();await auth.logout()}finally{user.value=null;initialized.value=true} }
 function clear(){user.value=null;initialized.value=true}
 return {user,initialized,initialize,signIn,signOut,clear}
})
