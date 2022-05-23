<template>
    <div v-if="!isNestedScreen && $store">
        <div v-if="isRecordList && $store.getters['recordListErrorsModule/isValidScreen'] === false" class="alert alert-danger mt-3">
            <i class="fas fa-exclamation-circle"/>
            {{ $store.getters['recordListErrorsModule/getErrorMessage'] }}
            <button type="button" class="close" aria-label="Close" @click="$store.dispatch('recordListErrorsModule/close')">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div v-if="!isRecordList && $store.getters['globalErrorsModule/isValidScreen'] === false" class="alert alert-danger mt-3">
            <i class="fas fa-exclamation-circle"/>
            {{ $store.getters['globalErrorsModule/getErrorMessage'] }}
            <button type="button" class="close" aria-label="Close" @click="$store.dispatch('globalErrorsModule/close')">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    </div>
</template>

<script>
import globalErrorsModule from './../store/modules/global-errors';
import recordListErrorsModule from './../store/modules/global-errors';

export default {
    props:['isRecordList', 'isNestedScreen', 'isLoop'],
    created() {
        this.registerStoreModule('globalErrorsModule', globalErrorsModule);
        this.registerStoreModule('recordListErrorsModule', recordListErrorsModule);
    },
    methods: {
        registerStoreModule(moduleName, storeModule) {
            const store = this.$store;

            if (store && store.state && !store.state[moduleName]) {
                store.registerModule(moduleName, storeModule);
            }
        },
    }
}
</script>