export function getCancelledJobs() {
  if (!localStorage.getItem("cancelledJobs") || localStorage.getItem("cancelledJobs") === "null") {
    return [];
  } else {
    return JSON.parse(localStorage.getItem("cancelledJobs"));
  }
}