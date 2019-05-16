// Import our components
import VueFormBuilder from './vue-form-builder'
import VueFormRenderer from './vue-form-renderer'
import MultiColumn from './editor/multi-column'
import OptionsList from './inspector/options-list'
import PageSelect from './inspector/page-select'
import FormButton from './renderer/form-button'
import FormMultiColumn from './renderer/form-multi-column'
import FormRecordList from './renderer/form-record-list'
import FormText from './renderer/form-text'
import ImageUpload from './inspector/image-upload.vue'
import FormBuilderControls from '../form-builder-controls'

let editor = {
    MultiColumn
}

let inspector = {
    OptionsList,
    PageSelect,
    ImageUpload
}

let renderer = {
    FormButton,
    FormMultiColumn,
    FormRecordList,
    FormText
}

// Export our named exports
export {
    VueFormBuilder,
    VueFormRenderer,
    editor,
    inspector,
    renderer,
    FormBuilderControls
}

// Export our Vue plugin as our default
export default {
    install: function (Vue) {
        // First check to see if we're already installed
        if (Vue._processMakerVueFormBuilderInstalled) {
            return
        }

        // Boolean flag to see if we're already installed
        Vue._processMakerVueFormBuilderInstalled = true

        // Register the builder and renderer
        Vue.component('vue-form-builder', VueFormBuilder)
        Vue.component('vue-form-renderer', VueFormRenderer)
    }
}
