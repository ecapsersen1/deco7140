//Constants
const studentNumber = "s4904022";
const uqcloudZoneId = "90b3c1b7";

//Headers
const headers = new Headers();
headers.append("student_number", studentNumber);
headers.append("uqcloud_zone_id", uqcloudZoneId);

function logPageLoadmessage() {
  console.log("Page loaded");
}

function uploadRecipeForm(formData, headers, handleSuccess, handleError) {
  fetch(
    "https://damp-castle-86239-1b70ee448fbd.herokuapp.com/decoapi/genericproduct/",
    {
      method: "POST",
      headers: headers,
      body: formData,
    }
  )
    .then((response) => {
      if (!response.ok) {
        return response.json().then((err) => {
          console.error("Server error response: ", err);
          throw new Error(err.detail || "Something went wrong");
        });
      }
      return response.json();
    })
    .then((result) => {
      handleSuccess(result);
    })
    .catch((error) => {
      console.error("Error", error.message);
      handleError(error);
    });
}

function fetchRecipes(
  studentNumber,
  uqcloudZoneId,
  displayRecipes,
  handleGETError
) {
  const requestOptions = {
    method: "GET",
    headers: headers,
    redirect: "follow",
  };
  fetch(
    "https://damp-castle-86239-1b70ee448fbd.herokuapp.com/decoapi/genericproduct/",
    requestOptions
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      displayRecipes(data);
    })
    .catch((error) => {
      handleGETError(error);
    });
}

function deleteRecipe(
  studentNumber,
  uqcloudZoneId,
  recipeId,
  handleError,
  handleSuccess
) {
  const requestOptions = {
    method: "DELETE",
    headers: headers,
  };

  fetch(
    "https://damp-castle-86239-1b70ee448fbd.herokuapp.com/decoapi/genericproduct/",
    requestOptions
  )
    .then((response) => {
      if (!response.ok) {
        return response.json().then((err) => {
          console.error("Server error response", err);
          throw new Error(err.detail || "Something went wrong");
        });
      }
      handleSuccess();
      loadRecipes();
    })
    .catch((error) => {
      console.error("Error deleting recipe", error.message);
      handleError(error);
    });
}

export {
  logPageLoadmessage,
  uploadRecipeForm,
  studentNumber,
  uqcloudZoneId,
  headers,
  fetchRecipes,
  deleteRecipe,
};
