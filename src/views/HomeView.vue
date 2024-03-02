<template>
    <div>
    <div class="psw-container">
      <router-link to="/pswconvert">
        <img src="../assets/psw.svg" class="logo psw" alt="psw logo" />
        <p class="psw">password</p>
      </router-link>

    </div>
    <div class="weather-container">
      <router-link to="/weatherapp">
        <img src="../assets/weather.svg" class="logo weather" alt="weather logo" />
        <p class="weather">weather</p>
      </router-link>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo.psw,
.psw {
  transition: filter 0.3s, color 0.3s;
}

.psw-container:hover .logo.psw,
.psw-container:hover .psw {
  filter: drop-shadow(0 0 2em #646cffaa);
  color: #646cffaa;
}

.logo.weather,
.weather {
  transition: filter 0.3s, color 0.3s;
}

.weather-container:hover .logo.weather,
.weather-container:hover .weather {
  filter: drop-shadow(0 0 2em #42b883aa);
  color: #42b883aa;
}
</style>
