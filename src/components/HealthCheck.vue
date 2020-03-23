<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-btn icon right v-on="on">
        <v-icon v-if="isConnected">mdi-cloud-check</v-icon>
        <v-icon v-else>mdi-cloud-alert</v-icon>
      </v-btn>
    </template>
    <span>Is tax service healthy?</span>
  </v-tooltip>
</template>

<script>
import api from "@/services/HealthCheckService";

export default {
  data: () => ({
    isConnected: false
  }),

  async created() {
    await this.setIsConnected();
    this.timer = setInterval(this.setIsConnected, 30000);
  },

  methods: {
    async setIsConnected() {
      this.isConnected = await api.doHealthCheck();
    }
  },

  beforeDestroy() {
    clearInterval(this.timer);
  }
};
</script>