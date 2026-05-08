<!--
  Fichier  : src/views/HomeView.vue
  Auteur   : Samuel
  Rôle     : Page d'accueil minimale (sera enrichie au commit 1.3 par Timmy).
  Créé le  : 08.05.2026
  Modifié  : 08.05.2026
-->
<template>
  <section class="text-center py-12">
    <h1 class="text-3xl font-bold mb-4">Découvrez des livres</h1>
    <p class="mb-6">Recherchez parmi des millions d'ouvrages grâce à OpenLibrary.</p>
    <router-link :to="{ name: 'search' }" class="bg-blue-700 text-white px-5 py-2.5 rounded-lg">
      Aller à la recherche
    </router-link>
  </section>
</template>

<script>
export default {
  name: 'HomeView'
}
</script>