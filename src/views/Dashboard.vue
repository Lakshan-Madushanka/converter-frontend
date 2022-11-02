<template>
  <div>
    <div class="overflow-x-auto relative shadow-md sm:rounded-lg">
      <table class="w-full text-sm text-left text-blue-100 dark:text-blue-100">
        <thead
          class="text-xs text-white text-center uppercase bg-blue-600 dark:text-white"
        >
          <tr>
            <th scope="col" class="py-3 px-6">No</th>
            <th scope="col" class="py-3 px-6">Job Id</th>
            <th scope="col" class="py-3 px-6">Job Code</th>
            <th scope="col" class="py-3 px-6">Status</th>
            <th scope="col" class="py-3 px-6">No of Medias</th>
            <th scope="col" class="py-3 px-6">Download</th>
            <th scope="col" class="py-3 px-6">Created at</th>
          </tr>
        </thead>
        <tbody class="text-center" v-if="data">
          <tr
            class="bg-blue-500 border-b border-blue-400"
            v-for="(job, key) in data"
            :key="job.id"
          >
            <td class="py-4 px-6">{{ key + 1 }}</td>
            <td class="py-4 px-6">{{ job["id"] }}</td>
            <td class="py-4 px-6">{{ job["job_code"] }}</td>

            <td class="py-4 px-6">
              <span
                v-if="job['status'] === 'Success'"
                class="bg-green-800 text-white-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800"
              >
                {{ job["status"].toUpperCase() }}</span
              >
              <span
                v-else
                class="bg-red-800 text-white-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800"
              >
                {{ job["status"].toUpperCase() }}</span
              >
            </td>
            <td class="py-4 px-6">
              <p class="border-2 inline-block px-2 rounded-full">
                {{ job["no_of_medias"] }}
              </p>
            </td>
            <td
              class="py-4 px-6 cursor-pointer"
              @click="downloadFiles(job['id'], job['downloadable_file_name'])"
            >
              <span
                class="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800"
              >
                Download
              </span>
            </td>
            <td class="py-4 px-6">{{ job["created_at"] }}</td>
          </tr>
        </tbody>
      </table>
      <div v-if="!data">
        <half-circle-spinner
          class="mx-auto mt-8 mb-8"
          :animation-duration="1000"
          :size="60"
          color="#ff1d5e"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted } from "vue";
import useJob from "../composables/job";
import useConvert from "../composables/convert";

export default {
  setup() {
    const { getAllJobs, data } = useJob();
    const { downloadFiles } = useConvert();

    onMounted(() => {
      getAllJobs();
    });

    return {
      data,
      downloadFiles,
    };
  },
};
</script>

<style lang="scss" scoped></style>
