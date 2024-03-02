<template>
    <div>
        <Suspense>
            <AsyncCityView />
            <template #fallback>
                <p>載入中．．．</p>
            </template>
        </Suspense>
    </div>
</template>
  
<script setup>
import AsyncCityView from '@/components/AsyncCityView.vue';

</script>
