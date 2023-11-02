

function getCsvUploadingInstructions(type: "waypoints" | "aerodromes" | "runways"): string[] {

    const csvImportInstructions = {
        waypoints: [
            'Download the "VFR Waypoints" CSV File.',
            'Do not delete or edit the existing column headers in any way, or the file will be rejected.',
            "New columns can be added for your reference, but they won't be considered for updating the data.",
            'Update the data in the file by adding rows, or editing the existing ones.',
            "New waypoints will be added, and exiting ones updated, but waypoints that are not in the CSV File will not be deleted. To delete existing waypoints, use the Waypoints List.",
            'Enter all data in the correct colum to ensure data integrity.',
            'Make sure there are no typos or repeated entries.',
            'After uploading the updated CSV-File, download a new file to compare them and make sure the data has been updated correctly.',
          ],
        aerodromes: [
          'Download the "Official Aerodromes" CSV File.',
          'Do not delete or edit the existing column headers in any way, or the file will be rejected.',
          "New columns can be added for your reference, but they won't be considered for updating the data.",
          'Update the data in the file by adding rows, or editing the existing ones.',
          "New aerodromes will be added, and exiting ones updated, but aerodromes that are not in the CSV File will not be deleted. To delete existing aerodromes, use the aerodromes List.",
          'Enter all data in the correct colum to ensure data integrity.',
          'Make sure there are no typos or repeated entries.',
          'After uploading the updated CSV-File, download a new file to compare them and make sure the data has been updated correctly.',
        ],
        runways: [
          'Download the "Runways" CSV File.',
          'Do not delete or edit the existing column headers in any way, or the file will be rejected.',
          "New columns can be added for your reference, but they won't be considered for updating the data.",
          'Update the data in the file by adding or deleting rows, or editing the existing ones.',
          "All runways will be deleted for the aerodromes present in the list, and the new list of runways will be posted, so make sure to include all the runways for the  included aerodromes.",
          "The runways of the aerodromes that are not listed in the CSV File, will not be modified in any way.",
          'Enter all data in the correct colum to ensure data integrity.',
          'Make sure there are no typos or repeated entries.',
          'After uploading the updated CSV-File, download a new file to compare them and make sure the data has been updated correctly.',
        ],
      }

      return csvImportInstructions[type]

}

export default getCsvUploadingInstructions