<template>
    <main>
        <div>
            <input v-model="searchQuery" @input="getSearchResults" type="text" placeholder="搜尋地點" class="search-box">
            <ul v-if="mapboxSearchResults.length > 0">
                <li v-for="searchResult in mapboxSearchResults" @click="previewCity(searchResult)" :key="searchResult.id"
                    class="search-list">
                    {{ searchResult.place_name }}
                </li>
            </ul>
            <div v-if="showNoResultsMessage && mapboxSearchResults.length === 0" class="no-results-message">
                <p>沒有相關搜尋結果&nbsp;(╥﹏╥)</p>
            </div>
        </div>
    </main>
    <GoToHomePage />
</template>

  
<script setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import axios from 'axios';
import GoToHomePage from '@/components/GoToHomePage.vue';

const mapboxAPIKey = 'pk.eyJ1Ijoiam9obmtvbWFybmlja2kiLCJhIjoiY2t5NjFzODZvMHJkaDJ1bWx6OGVieGxreSJ9.IpojdT3U3NENknF6_WhR2Q';
const searchQuery = ref('');
const queryTimeout = ref(0);
const mapboxSearchResults = ref([]);
const showNoResultsMessage = ref(false);

const router = useRouter();


const previewCity = (searchResult) => {
    console.log(searchResult);
    const city = searchResult.place_name.split(',')[0];
    router.push({
        name: 'city',
        // %20
        params: { city: city.trim() },
        query: {
            lng: searchResult.geometry.coordinates[0],
            lat: searchResult.geometry.coordinates[1],
            preview: true
        }
    })
}

const getSearchResults = () => {
    clearTimeout(queryTimeout.value)
    queryTimeout.value = setTimeout(async () => {
        if (searchQuery.value !== '') {
            const result = await axios.get(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchQuery.value}.json?access_token=${mapboxAPIKey}&types=place`
            )
            mapboxSearchResults.value = result.data.features;
            // 檢查搜尋結果
            const resultsContainInput = mapboxSearchResults.value.some(result => result.place_name.includes(searchQuery.value));
            showNoResultsMessage.value = !resultsContainInput;

            return;
        }
        mapboxSearchResults.value = [];
        showNoResultsMessage.value = false;
    }, 300);
}

</script>

<style>
.search-box {
    width: 35%;
    padding: 10px;
    font-size: 18px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin: 10px auto;
    position: fixed;
    top: 100px;
    left: 0px;
    right: 0px;
    background-color: white;
    color: #000;
}

ul {
    list-style-type: none;
    padding: 0;
    margin-top: 50px;
}

.search-list {
    padding: 10px;
    cursor: pointer;
    background-color: #f9f9f9;
    border-radius: 5px;
    margin: 10px auto;
    color: #000;
    line-height: 2.5;
}

.no-results-message {
    padding: 10px;
    cursor: pointer;
    background-color: #f9f9f9;
    border-radius: 5px;
    margin: 10px auto;
    color: #000;
}

</style>