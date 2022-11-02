<template>
  <div class="home mt-36">
    <h1 class="text-4xl tracking-widest font-bold">
      Welcome to file converter
    </h1>
    <h2 class="text-xl tracking-widest text-blue-600 m-8 font-bold">
      You can convert any file here !!
    </h2>
    <button class="">
      <router-link
        :to="{ name: 'Convert' }"
        class="block px-6 py-2 tracking-widest text-white text-sm transition-colors duration-300 bg-blue-800 rounded-full shadow-xl hover:bg-blue-600 shadow-blue-400"
        aria-current="page"
        >Let us start</router-link
      >
    </button>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Home",
  components: {},
};
</script>
