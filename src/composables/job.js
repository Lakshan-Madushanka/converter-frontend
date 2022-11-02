import { ref } from "vue";
import { retriveAllJobs } from "../api/calls/job";

export default () => {
  const data = ref(null);

  async function getAllJobs() {
    const response = await retriveAllJobs();
    data.value = response.data.data;
  }

  return { data, getAllJobs };
};
