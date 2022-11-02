<template>
  <div
    v-if="conversionData.status == STATUS.CONVERTED && files.length > 0"
    class="mb-4 text-lg text-green-600"
  >
    <p>Following {{ files.length }} has been converted successfully !,</p>
    <p>
      Job Id [{{ conversionData.data.jobId }}] (refere this id in dashboard)
    </p>
  </div>

  <div
    v-if="conversionData.status == STATUS.ERROR_OCCURED && files.length > 0"
    class="mb-4 text-lg text-red-600"
  >
    <p>Error occured while converting followng files please try again later,</p>
    <p>
      Job Id [{{ conversionData.data.jobId }}] (refere this id in dashboard)
    </p>
  </div>

  <template
    v-if="
      conversionData.status == STATUS.UPLOADING ||
      conversionData.status == STATUS.CONVERTING ||
      conversionData.status == STATUS.DOWNLOADING
    "
  >
    <scaling-squares-spinner
      class="mx-auto"
      loading="loading"
      color="color"
      :size="70"
    >
    </scaling-squares-spinner>
    <p class="mt-6">
      Your files are being &nbsp;
      <span class="text-blue-800 font-bold text-xl">{{
        conversionData.status.toLocaleUpperCase()
      }}</span>
      ...
    </p>
    <div v-if="conversionData.data.jobId" class="mt-4">
      <p class="italic">
        Job id: &nbsp;
        <span
          class="inline-block border-2 bg-green-500 text-white border-green-800 px-2 rounded-full"
          >{{ conversionData.data.jobId }}</span
        >
      </p>
    </div>
  </template>

  <template v-else>
    <div class="flex justify-center">
      <div class="mb-3 w-96">
        <label
          for="formFile"
          class="form-label inline-block mb-4 text-xl text-gray-700 font-bold tracking-widest"
          >UPLOAD YOUR FILES</label
        >
        <input
          class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
          type="file"
          id="formFile"
          multiple
          @change="handleUploadedFiles"
        />
      </div>
    </div>

    <div v-if="files.length > 0">
      <p>
        <span
          class="inline-block border-2 bg-green-500 text-white border-green-800 px-2 rounded-full"
          >{{ files.length }}
        </span>
        &nbsp; file(s) has been uploaded.
      </p>
    </div>

    <div v-if="showFileSizeExceededError">
      <p class="text-red-600">
        Some files coudn't add to the list as exceeded maximum allowed file size
        is 10MB
      </p>
    </div>
    <div v-if="showUploadedFileNotSupportError">
      <p class="text-red-600">
        Some files coudn't add to the list as it is not supported
      </p>
    </div>

    <template v-if="Object.keys(errors).length > 0">
      <div class="mb-4" v-for="(error, key) in errors" :key="key">
        <p class="text-red-600">File No: {{ error.fileNo }}</p>
        <p class="text-red-600">Error: {{ error.message }}</p>
      </div>
    </template>

    <!-- Server side errors -->
    <template v-if="Object.keys(conversionData.errors).length > 0">
      <template class="mb-4" v-for="ssErrors in conversionData.errors">
        <div v-for="(error, key) in ssErrors" :key="key">
          <p class="text-red-600">File No: {{ key + 1 }}</p>
          <p class="text-red-600">
            Error: {{ error.replace(`files.${key}`, "") }}
          </p>
        </div>
      </template>
    </template>

    <fulfilling-square-spinner
      class="mx-auto"
      loading="loading"
      color="color"
      :size="70"
      v-if="isProcessingFiles"
    >
    </fulfilling-square-spinner>

    <div class="flex justify-center mt-4">
      <ul
        class="bg-white rounded-lg border border-gray-200 w-3/5 h-80 overflow-scroll text-gray-900"
        v-if="files.length > 0 && !isProcessingFiles"
      >
        <li
          class="px-6 py-2 border-b flex justify-between border-gray-200 items-center w-full rounded-t-lg"
          v-for="(file, key) in files.list"
          :key="key"
        >
          <p class="w-2/3 truncate text-left">
            {{ key + 1 }}. &nbsp;{{ file.conversion_file.name }}
          </p>

          <div class="flex justify-end items-center">
            <div>
              <select
                class="w-24 form-select appearance-none block px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                aria-label="Default select example"
                v-model="files.list[key]['convert_to_type']"
                @change="validateFiles"
              >
                <option value="null" selected>'''</option>
                <option
                  v-for="(format, key) in file['supportedFormats']"
                  :key="key"
                >
                  {{ format }}
                </option>
              </select>
            </div>
            <div class="ml-4 cursor-pointer" @click="removeItem(key)">
              <img class="h-8 w-8" src="../../public/images/remove.svg" />
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div
      class="flex justify-between w-1/2 mx-auto"
      v-if="!isProcessingFiles && files.length > 0"
    >
      <button
        class="bg-blue-500 hover:bg-blue-700 my-4 text-white font-bold py-2 px-4 rounded-full"
        @click="clearFileList"
      >
        Clear List
      </button>
      <button
        class="bg-blue-500 hover:bg-blue-700 my-4 text-white font-bold py-2 px-4 rounded-full"
        @click="convert"
      >
        Convert
      </button>
    </div>
  </template>
</template>

<script>
import { reactive, ref } from "vue";
import useConvert from "../composables/convert";
import { STATUS } from "../composables/convert";

export default {
  setup() {
    const files = reactive({ list: [], length: 0 });

    const inputElm = ref(null);

    const supportedFileTypes = {};
    const maxFileSize = 100; // in megabytes

    const errors = ref({});
    const showFileSizeExceededError = ref(false);
    const showUploadedFileNotSupportError = ref(false);

    const isProcessingFiles = ref(false);

    const { getSupportedFileFormats, convertFiles, conversionData } =
      useConvert();

    async function handleUploadedFiles(event) {
      inputElm.value = event;
      isProcessingFiles.value = true;
      showUploadedFileNotSupportError.value = false;
      showFileSizeExceededError.value = false;
      conversionData.status = STATUS.IDLE;

      let fileList = event.target.files;

      const length = event.target.files.length;

      for (let i = 0; i < length; i++) {
        let tempObj = { conversion_file: fileList[i], convert_to_type: "" };

        let fileType = getFileType(fileList[i].type);

        if (fileType === "") {
          continue;
        }

        if (!validateFileSize(fileList[i].size)) {
          continue;
        }
        if (
          !Object.prototype.hasOwnProperty.call(supportedFileTypes, fileType)
        ) {
          const supportedFormats = await getSupportedFileFormats(fileType);

          supportedFileTypes[fileType] = supportedFormats;
        }
        tempObj["supportedFormats"] = supportedFileTypes[fileType];
        files["list"].push(tempObj);

        files.length++;
      }

      isProcessingFiles.value = false;
      inputElm.value.target.value = "";
    }

    function getFileType(mimeType) {
      if (mimeType === "") {
        showUploadedFileNotSupportError.value = true;
        return "";
      }
      return mimeType.split("/")[1].toString();
    }

    function validateFileSize(fileSize) {
      if (fileSize / Math.pow(10, 6) > maxFileSize) {
        showFileSizeExceededError.value = true;

        return false;
      }
      return true;
    }

    async function test() {
      inputElm.value.target.value = "";
    }

    function convert() {
      validateFiles();

      if (Object.keys(errors.value).length > 0) {
        return;
      }

      let payload = files.list.map((item) => {
        return {
          conversion_file: item["conversion_file"],
          convert_to_type: item["convert_to_type"],
        };
      });

      showUploadedFileNotSupportError.value = false;
      showFileSizeExceededError.value = false;
      convertFiles(payload);
    }

    function validateFiles() {
      files.list.forEach((file, index) => {
        const convertToFormat = file["convert_to_type"];

        const selectedFormat = file["supportedFormats"].find(function (value) {
          return value === convertToFormat;
        });

        if (!selectedFormat) {
          errors.value[index] = {
            fileNo: index + 1,
            message: "Invalid conversion format",
          };
        } else {
          delete errors.value[index];
        }
      });
    }

    function removeItem(index) {
      files.list.splice(index, 1);
      inputElm.value.target.value = "";
      files.length--;
      conversionData.status = STATUS.IDLE;
    }

    function clearFileList() {
      files.list = [];
      errors.value = [];
      files.length = 0;
      showFileSizeExceededError.value = false;
      showFileSizeExceededError.value = false;
      inputElm.value.target.value = "";
      conversionData.status = STATUS.IDLE;
    }

    return {
      handleUploadedFiles,
      clearFileList,
      isProcessingFiles,
      showFileSizeExceededError,
      validateFiles,
      test,
      files,
      convert,
      inputElm,
      errors,
      conversionData,
      STATUS,
      showUploadedFileNotSupportError,
      removeItem,
    };
  },
};
</script>
