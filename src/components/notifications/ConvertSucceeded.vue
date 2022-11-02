<template>
  <div class="mx-10">
    <h2 class="font-bold">Your file(s) has been converted successfully !</h2>
    <div class="flex justify-between mt-5">
      <p class="mr-6">click here to download</p>
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 mx-auto"
        @click="downloadFiles()"
      >
        Download
      </button>
    </div>
  </div>
</template>

<script>
export default {
  emits: ["downloadButtonClicked"],
  setup(props, { emit }) {
    function downloadFiles() {
      emit("downloadButtonClicked");
    }

    return {
      downloadFiles,
    };
  },
};
</script>
