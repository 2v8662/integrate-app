<template>
    <button class="b2home-page" @click="goToHome">
        <p class="text">回首頁</p>
    </button>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goToHome = () => {
    router.push('/');
}

</script>

<style>
.b2home-page {
    background-color: blueviolet;
    color: yellow;
    cursor: pointer;
    position: fixed;
    width: 60px;
    height: 60px;
    border-radius: 0% 100% 100% 100%;
    transform: rotate(45deg);
    bottom: 7%;
    right: 10%;
}

.text {
    transform: rotate(-45deg);
    position: absolute;
    top: 7%;
    left: 15%;
    white-space: nowrap;
}
</style>