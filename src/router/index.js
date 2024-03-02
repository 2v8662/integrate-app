import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ()=> import('../views/HomeView.vue')
    },
    {
      path: '/pswconvert',
      name: 'pswconvert',
      component: ()=> import('../views/PasswordConvertor.vue')
    },
    {
      path: '/weatherapp',
      name: 'weatherapp',
      component: ()=> import('../views/WeatherAppView.vue')
    },
    {
      path: '/weatherapp/:city',
      name: 'city',
      component: ()=> import('../views/WeatherCityView.vue')
    },
  ]
})

export default router
