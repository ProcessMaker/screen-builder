<template>
  <div>
    <div class="row">
      <div class="col-lg-6">
        <dl class="row mb-0">
          <div class="col-sm-4 text-sm-right"><dt>Created:</dt> </div>
          <div class="col-sm-8 text-sm-left"><dd class="mb-1">{{ formatDate(token.created_at) }}</dd></div>
        </dl>
        <dl class="row mb-0">
          <div class="col-sm-4 text-sm-right"><dt>Completed:</dt> </div>
          <div class="col-sm-8 text-sm-left"><dd class="mb-1">{{ formatDate(token.completed) }}</dd> </div>
        </dl>
        <dl class="row mb-0">
          <div class="col-sm-4 text-sm-right"><dt>Completed by:</dt> </div>
          <div class="col-sm-8 text-sm-left">
            <dd class="mb-1">
              <i v-if="!token.user.avatar" class="fa fa-user rounded-user" />
              <img v-else v-bind:src="token.user.avatar" class="rounded-user"> {{ token.user.name }}
            </dd>
          </div>
        </dl>
      </div>
    </div>
    <vue-form-renderer
      v-model="data"
      v-bind:config="token.screen.config"
      v-bind:computed="token.screen.computed"
      v-bind:custom-css="token.screen.custom_css"
      v-bind:watchers="token.screen.watchers"
      @update="onUpdate"
    />
    <a class="btn btn-primary" :href="statusURL">Back</a>
  </div>
</template>

<script>
import moment from 'moment';
import Screens from '../e2e/fixtures/webentry.json';

export default {
  data() {
    return {
      data: {},
      statusURL: '/requests/1/status',
      token: {
        created_at: moment().toISOString(),
        completed_at: moment().toISOString(),
        user: {
          avatar: '',
          fullname: 'Foo Bar',
        },
        screen: Screens.screens[0],
      },
    };
  },
  methods: {
    onUpdate() {},
    formatDate(date) {
      return moment(date).format('YYYY-MM-DD HH:mm');
    },
  },
};
</script>

<style>

</style>