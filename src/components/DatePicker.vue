<script>
import DatePick from "vue-date-pick";

/*
Internal fork of the DatePick library by extending it and fixing the {close,remove} events to target the b-modal
(Bootstrap-Vue) modals to not "focus-in" automatically on the input text.
 */
export default {
  name: 'date-pick',
  extends: DatePick,
  methods: {
    addCloseEvents() {
      if (!this.closeEventListener) {
        this.closeEventListener = (e) => this.inspectCloseEvent(e);
        ["click", "keyup"].forEach((eventName) =>
          document.addEventListener(eventName, this.closeEventListener)
        );
      }
    },
    removeCloseEvents() {
      if (!this.closeEventListener) {
        this.closeEventListener = (e) => this.inspectCloseEvent(e);
        ["click", "keyup"].forEach((eventName) =>
          document.addEventListener(eventName, this.closeEventListener)
        );
      }
    }
  }
};
</script>
