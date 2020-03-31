<template>
    <div>
        <label>Default Value</label>
        <div class="float-right buttons">
            <b-button variant="light" size="sm" :class="{ active: mode === 'basic'}" @click="mode = 'basic'"><i class="fas fa-i-cursor"/></b-button>
            <b-button variant="light" size="sm" :class="{ active: mode === 'js'}" @click="mode = 'js'"><i class="fab fa-js-square"/></b-button>
        </div>
        <div v-if="mode === 'basic'">
            <b-form-input v-model="basicValue"></b-form-input>
        </div>
        <div v-if="mode === 'js'">
            <MonacoEditor
                v-model="jsValue"
                :options="monacoOptions"
                class="editor"
                language="javascript"
            ></MonacoEditor>
        </div>
    </div>
</template>

<script>
import MonacoEditor from 'vue-monaco';
export default {
    props: ['value'],
    components: {
        MonacoEditor,
    },    
    data() {
        return {
            mode: 'basic',
            jsValue: '',
            basicValue: '',
            monacoOptions: {
                lineNumbers: 'off',
                glyphMargin: false,
                folding: false,
                lineDecorationsWidth: 0,
                lineNumbersMinChars: 0,
                minimap: { enabled: false },
                fixedOverflowWidgets: true,
                automaticLayout: true,
            }
        }
    },
    watch: {
        value: {
            handler() {
            console.log("Value chacnged", this.value)
            if (typeof this.value === 'string') {
                this.mode       = 'basic';
                this.basicValue = this.value;
                this.jsValue    = '';
            } else {
                this.mode       = this.value.mode;
                this.basicValue = this.mode === 'basic' ? this.value.value : '';
                this.jsValue    = this.mode === 'js' ? this.value.value : '';
            }
            },
            immediate: true,
        },
        mode() {
            this.emit();
        },
        jsValue() {
            this.emit();
        },
        basicValue() {
            this.emit();
        },
    },
    methods: {
        emit() {
            const value = {
                mode: this.mode,
                value: this.mode === 'js' ? this.jsValue : this.basicValue
            };
            console.log("Emitting", value);
            this.$emit('input', value);
        }
    }
}
</script>

<style scoped>
.buttons button {
    min-width: 2.2em;
    margin-left: 0.5em;
    margin-bottom: 0.5em;
}

.editor {
    width: 100%;
    height: 10em;
}
</style>