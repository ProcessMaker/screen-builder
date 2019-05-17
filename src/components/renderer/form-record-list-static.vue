<template>
    <div class="record-list">
        <h4>{{ $t(label) }}</h4>
        <table>
            <thead>
                <tr>
                    <th v-for="(field, index) in fields" :key="index">
                        {{ field.content }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(val, index) in value" :key="index">
                    <td v-for="(field, index) in fields" :key="index">
                        {{ val[field.value] }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>


<script>
// import bModal from "bootstrap-vue/es/components/modal/modal";
// import VueFormRenderer from "../vue-form-renderer";

export default {
  name: "FormRecordListStatic",
  props: ["label", "fields", "value", "editable", "_config", "form"],
  components: {
  },
  mounted() {
  },
  data() {
    return {
    };
  },
};
</script>
