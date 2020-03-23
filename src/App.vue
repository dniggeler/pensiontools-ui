<template>
  <v-app>
    <v-app-bar app light>
      <v-toolbar flat>
        <v-app-bar-nav-icon @click="drawer=!drawer" />
        <v-toolbar-title class="pa-4">Swiss Tax and Pension Tools</v-toolbar-title>

        <v-toolbar-items>
          <v-btn text to="/">
            <v-icon left>mdi-home</v-icon>
            <span>Home</span>
          </v-btn>
          <v-btn text to="/tools">
            <v-icon left>mdi-hammer-screwdriver</v-icon>
            <span>Tools</span>
          </v-btn>

          <v-btn text to="/municipalities">
            <v-icon left>mdi-database</v-icon>
            <span>Data</span>
          </v-btn>
        </v-toolbar-items>

        <v-spacer />

        <v-btn icon right href="https://github.com/dniggeler/pensiontools-ui" target="_blank">
          <v-icon>mdi-github</v-icon>
        </v-btn>

        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
          <v-btn icon right v-on="on">
            <v-icon v-if="isConnected">mdi-cloud-check</v-icon>
            <v-icon v-else>mdi-cloud-alert</v-icon>
          </v-btn>
          </template>
          <span>Is tax service healthy?</span>
        </v-tooltip>
      </v-toolbar>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" app>
      <v-expansion-panels flat :multiple="true" class="pr-1">
        <v-expansion-panel
          focusable
          v-for="(link,i) in links"
          :key="i"
          :tile="true"
          router
          :to="link.route"
        >
          <v-expansion-panel-header :hide-actions="!link.sublinks">
            <div>
              <v-icon class="pr-1">{{ link.icon }}</v-icon>
              <span>{{link.text}}</span>
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content v-if="link.sublinks" class="pa-0">
            <v-list flat dense class="pa-0">
              <v-list-item v-for="(sublink,i) in link.sublinks" :key="i">
                <v-btn text tile small :to="sublink.route">
                  <v-icon small>{{ sublink.icon }}</v-icon>
                  <span>{{sublink.text}}</span>
                </v-btn>
              </v-list-item>
            </v-list>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-navigation-drawer>

    <router-view />
    <v-footer></v-footer>
  </v-app>
</template>

<script>
import api from "@/services/HealthCheckService";

export default {
  name: "App",

  data: () => ({
    drawer: false,
    isConnected: false,
    multiple: true,
    links: [
      { key: "home", text: "Home", icon: "mdi-home", route: "/" },
      {
        key: "tools",
        text: "Tools",
        icon: "mdi-hammer-screwdriver",
        sublinks: [
          {
            key: "IncomeTax",
            text: "Income Tax",
            icon: "mdi-calculator",
            route: "tools"
          },
          {
            key: "BenefitTax",
            text: "Benefit Tax",
            icon: "mdi-calculator",
            route: "/"
          }
        ],
        route: "/tools"
      },
      {
        key: "tools",
        text: "Data",
        icon: "mdi-database",
        route: "/municipalities"
      }
    ]
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
