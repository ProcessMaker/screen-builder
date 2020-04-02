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
                if (!this.value) {
                    return;
                }

                if (_.isEqual(this.configValue, this.value)) {
                    return;
                }
                
                this.basicValue = '';
                this.jsValue    = '';

                if (typeof this.value === 'string') {
                    this.mode = 'basic';
                    this.effectiveValue = this.value;
                } else {
                    this.mode = this.value.mode;
                    this.effectiveValue = this.value.value;
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
    mounted() {

    },
    created() {

    },
    computed: {
        effectiveValue: {
            get() {
                return this.mode === 'js' ? this.jsValue : this.basicValue;
            },
            set(value) {
                if (this.mode === 'js') {
                    this.jsValue = value;
                } else {
                    this.basicValue = value;
                }
            }
        },
        configValue() {
            return {
                mode: this.mode,
                value: this.effectiveValue,
            };
        }
    },
    methods: {
        emit() {
            this.$emit('input', this.configValue);
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