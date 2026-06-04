<!--
  Fichier  : src/App.vue
  Auteur   : Samuel (1.2), puis Timmy (4.2 — transition entre les pages)
  Rôle     : Composant racine : header + page courante + footer.
  Créé le  : 08.05.2026
  Modifié  : 04.06.2026
-->
<template>
  <!-- Conteneur global : prend toute la hauteur de l'écran et empile les enfants verticalement. -->
  <div class="min-h-screen flex flex-col">
    <AppHeader />

    <!-- Zone principale qui change selon la route ; flex-1 pousse le footer vers le bas. -->
    <main class="flex-1 w-full max-w-7xl mx-auto px-4 py-8 sm:px-6">
      <!-- Transition « fondu » entre les pages : le composant de la route passe par le slot du router-view. -->
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <AppFooter />
  </div>
</template>

<script>
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'

export default {
  name: 'App',
  components: { AppHeader, AppFooter }
}
</script>
