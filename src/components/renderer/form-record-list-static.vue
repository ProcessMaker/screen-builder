<template>
    <div>
        <h4>{{label}}</h4>
        <table style="width:100%; text-align:left; padding:0.3em; border-collapse: collapse;">
            <thead style="border-bottom:1px solid black; background-color:lightgrey; font-weight:bold;">
                <tr>
                    <th v-for="field in fields" style="padding:0.3em; margin:0;">
                        {{ field.content }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="val in value" style="border-bottom: 1px solid lightgrey;">
                    <td v-for="field in fields" style="padding:0.3em; margin:0">
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