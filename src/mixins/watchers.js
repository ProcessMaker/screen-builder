import { set } from 'lodash';

export default {
  methods: {
    queueWatcher(watcher) {
      return new Promise(complete => {
        window.axios.get('/api/data/user/1').then((aux) => {
          this.listenWatcher(watcher.uid, aux).then((response) => {
            complete(response);
          });
        });
      }).then((response) => {
        set(this, watcher.output_variable, response);
        return response;
      });
    },
    listenWatcher(uid, aux) {
      return new Promise(complete => {
        complete(aux);
      });
    },
  },
}