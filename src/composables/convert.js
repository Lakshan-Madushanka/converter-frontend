import { reactive } from "vue";
import { useToast } from "vue-toastification";
import { POSITION } from "vue-toastification";

import { getAllowedFileFormats, convert } from "../api/calls/convert";
import ConvertSucceeded from "../components/notifications/ConvertSucceeded.vue";
import { downloadConvertedFiles } from "../api/calls/convert";

export const STATUS = {
  IDLE: "idle",
  UPLOADING: "Uploading",
  UPLOADED: "Uploaded",
  CONVERTING: "Converting",
  CONVERTED: "Converted",
  DOWNLOADING: "Downloading",
  DOWNLOADED: "Downloaded",
  ERROR_OCCURED: "Error Occured",
};

export default () => {
  const toast = useToast();

  const conversionData = reactive({
    status: STATUS.IDLE,
    data: { jobId: "" },
    errors: {},
  });

  let conversionFinishedToastId;

  async function getSupportedFileFormats(fileType) {
    const response = await getAllowedFileFormats(fileType);

    return response["data"];
  }

  async function convertFiles(files) {
    conversionData.status = STATUS.UPLOADING;

    const formData = prepareData(files);

    try {
      const response = await convert(formData);

      conversionData.status = STATUS.CONVERTING;

      const responseData = response.data;

      conversionData.data.jobId = responseData["job_id"];

      initWebScoketListeners(responseData["job_id"]);
    } catch (error) {
      conversionData.errors = error.response.data.errors;
      toast.error("Error occured while uploading, pleade try again later");
      conversionData.status = STATUS.ERROR_OCCURED;
    }
  }

  function prepareData(files) {
    const formData = new FormData();

    const convertToType = {};

    files.forEach((file) => {
      const tmpFile = file["conversion_file"];

      convertToType[tmpFile["name"]] = file["convert_to_type"];

      formData.append("files[]", tmpFile);
    });

    formData.append("convert_to_types", JSON.stringify(convertToType));

    return formData;
  }

  function initWebScoketListeners(jobId) {
    window.Echo.private("conversion-failed." + jobId).listen(
      "ConversionJobFailed",
      (event) => {
        conversionData.status = STATUS.ERROR_OCCURED;
        showConvertErrorNotification(event);
      }
    );

    window.Echo.private("conversion-succeeded." + jobId).listen(
      "ConversionJobSucceeded",
      (event) => {
        conversionData.status = STATUS.CONVERTED;
        showConvertFinishedNotification(event);
      }
    );
  }

  function showConvertFinishedNotification(e) {
    const content = {
      component: ConvertSucceeded,
      listeners: {
        downloadButtonClicked: () => {
          downloadFiles(e["jobId"], e["downloadFileName"]);
        },
      },
    };
    conversionFinishedToastId = toast(content, {
      timeout: false,
      position: POSITION.TOP_CENTER,
      closeOnClick: false,
      type: "success",
    });
  }

  function showConvertErrorNotification(e) {
    toast.error(
      `Error ocuured while converting your files, please try again later, \n (job id ${e["jobId"]}) refer this id in dashboard`,
      {
        timeout: false,
        position: POSITION.TOP_CENTER,
        closeOnClick: false,
        type: "success",
      }
    );
  }
  async function downloadFiles(jobId, fileName) {
    toast.dismiss(conversionFinishedToastId);
    const toastId = toast.info("Your Files are being downloading", {
      timeout: false,
    });
    conversionData.status = STATUS.DOWNLOADING;
    try {
      await downloadConvertedFiles(jobId, fileName);
      toast.dismiss(toastId);
      conversionData.status = STATUS.DOWNLOADED;
      toast.success("Downloading succeeded for the job id" + jobId);
    } catch (error) {
      toast.dismiss(toastId);
      toast.error(
        "Error ocuured downloading, please try again later",
        +`(job id ${jobId})`
      );

      conversionData.status = STATUS.ERROR_OCCURED;
    }
  }

  return {
    getSupportedFileFormats,
    downloadFiles,
    convertFiles,
    conversionData,
  };
};
