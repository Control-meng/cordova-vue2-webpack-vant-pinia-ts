import {defineStore} from 'pinia';
import {ref} from 'vue-demi';

export const useRouterStore = defineStore('app-router-store', () => {
    const transitionName = ref('');
    const setName = (transition: string) => {
        transitionName.value = transition;
    };
    return {
        transitionName,
        setName,
    };
});
