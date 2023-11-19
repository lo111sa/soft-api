export const visitsToObject = (results) => {
  // Format the data as an array of objects
  const formattedData = [];

  results.forEach((result) => {
    const doctorId = result.doctor_id;

    // Check if the doctor already exists in the formatted data
    const doctorIndex = formattedData.findIndex(
      (item) => item.doctor && item.doctor.id === doctorId
    );

    // If the doctor is not in the formatted data, add a new entry
    if (doctorIndex === -1) {
      formattedData.push({
        doctor: {
          id: doctorId,
          name: result.doctor_name,
        },
        visits: [],
      });

      // Set the index to the last added element
      const lastIndex = formattedData.length - 1;

      // Add visit information to the corresponding doctor's array
      formattedData[lastIndex].visits.push({
        patientId: result.patient_id,
        patientName: result.patient_name,
        time: result.visit_time,
      });
    } else {
      // Add visit information to the existing doctor's array
      formattedData[doctorIndex].visits.push({
        patientId: result.patient_id,
        patientName: result.patient_name,
        time: result.visit_time,
      });
    }
  });
  return formattedData;
};
