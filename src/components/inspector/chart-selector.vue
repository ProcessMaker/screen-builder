<template>
  <div>
    <label class="typo__label">Select Chart Type</label>
    <multiselect
      v-model="selectedOption"
      :options="options"
      placeholder="Select an option"
      label="title"
      @input="selectOption"
    ></multiselect>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedOption: null,
      options: [
        { title: "My Tasks" },
        { title: "My Requests" },
        { title: "Start a new Request" }
      ]
    };
  }
};
</script>
