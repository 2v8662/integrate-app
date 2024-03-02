<template>
  <div>
    <div>
      <h1>{{ route.params.city }}</h1>
      <!-- current_time -->
      <p>
        {{
          new Date(weatherData.currentTime).toLocaleDateString(
            "zh-tw",
            {
              weekday: "short",
              day: "2-digit",
              month: "long",
            }
          )
        }}
        {{
          new Date(weatherData.currentTime).toLocaleTimeString(
            "zh-tw",
            {
              hour: "2-digit",
              minute: "2-digit"
            }
          )
        }}
      </p>
      <!-- temp -->
      <p>
        {{ Math.round(weatherData.current.temp) }}&#8451;
      </p>
      <!-- feels_like -->
      <p>
        體感溫度&nbsp;{{ Math.round(weatherData.current.feels_like) }}&#8451;
      </p>
      <!-- weather_description -->
      <p>
        {{ weatherData.current.weather[0].description }}
      </p>
      <!-- https://openweathermap.org/weather-conditions#Weather-Condition-Codes-2 -->
      <img :src="`http://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png`" />
    </div>
    <!-- weekly weather -->
    <div class="weekly-prediction">
      <h2>
        <ion-icon name="thermometer-outline"></ion-icon>
        近&nbsp;7&nbsp;天預測
      </h2>
      <div>
        <div>
        </div>
        <div v-for="day in weatherData.daily.slice(0, 7)" :key="day.dt">
          <p>
            {{
              new Date(day.dt * 1000).toLocaleDateString(
                "zh-tw",
                {
                  weekday: "short",
                }
              )
            }}
          </p>
          <img :src="`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`" />
          <div>
            <p>{{ Math.round(day.temp.min) }}</p>-
            <p>{{ Math.round(day.temp.max) }}</p>&#8451;
          </div>
        </div>
      </div>
    </div>
  </div>
  <GoToHomePage />
</template>

<script setup>
import axios from 'axios';
import { useRoute } from 'vue-router';
import GoToHomePage from './GoToHomePage.vue';

const openWeatherAPIKey = '7efa332cf48aeb9d2d391a51027f1a71'
const route = useRoute();
const getWeatherData = async () => {
  try {
    const weatherData = await axios.get(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${route.query.lat}&lon=${route.query.lng}&lang=zh_tw&appid=${openWeatherAPIKey}&units=metric`
    );

    // cal current date & time
    const localOffset = new Date().getTimezoneOffset() * 60000;
    const utc = weatherData.data.current.dt * 1000 + localOffset;
    weatherData.data.currentTime = utc + 1000 * weatherData.data.timezone_offset;

    // cal hourly weather offset
    weatherData.data.hourly.forEach((hour) => {
      const utc = hour.dt * 1000 + localOffset;
      hour.currentTime = utc + 1000 * weatherData.data.timezone_offset;
    });

    return weatherData.data;

  } catch (error) {
    console.log(error);
  }
};

const weatherData = await getWeatherData();
console.log(weatherData);

</script>

<style>
.weekly-prediction img {
  width: 50px;
  height: 50px;
  margin: auto;
}

.weekly-prediction div>div {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.weekly-prediction div>div>p {
  margin: 0 5px;
}
</style>
