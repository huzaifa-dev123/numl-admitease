// // // OCR service that communicates with the Python backend

// // // Define the response type from the OCR service
// // export interface OcrData {
// //   full_name: string;
// //   cnic: string;
// //   dob: string;
// //   father_name: string;
// //   gender: string;
// //   address: string;
// //   nationality: string;
// //   phone: string;
// //   email: string;
// //   matric_percentage: string;
// //   fsc_percentage: string;
// //   domicile: string;
// // }

// // // Function to check if the backend server is available
// // export const checkBackendAvailability = async (): Promise<boolean> => {
// //   const controller = new AbortController();
// //   const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 seconds timeout

// //   try {
// //     const response = await fetch("http://127.0.0.1:5000/api/health", {
// //       method: "GET",
// //       signal: controller.signal,
// //     });
// //     clearTimeout(timeoutId);
// //     return response.ok;
// //   } catch (error) {
// //     console.error("Backend server check failed:", error);
// //     return false;
// //   }
// // };

// // // Function to process document with OCR using the Python backend
// // export const processDocumentWithOcr = async (
// //   file: File,
// //   documentType: string,
// //   onProgress: (progress: number) => void
// // ): Promise<OcrData> => {
// //   return new Promise(async (resolve, reject) => {
// //     try {
// //       // Check if backend is available first
// //       const isBackendAvailable = await checkBackendAvailability().catch(
// //         () => false
// //       );

// //       if (!isBackendAvailable) {
// //         throw new Error(
// //           "Cannot connect to OCR backend server. Please ensure the backend server is running on http://127.0.0.1:5000"
// //         );
// //       }

// //       // Create FormData object to send the file and document type
// //       const formData = new FormData();
// //       formData.append("file", file);
// //       formData.append("documentType", documentType);

// //       // 🔧 Fixed: Track progress manually instead of using onProgress[0]
// //       let currentProgress = 0;
// //       const progressInterval = setInterval(() => {
// //         const randomProgress = Math.floor(Math.random() * 10) + 1;
// //         currentProgress = Math.min(currentProgress + randomProgress, 90);
// //         onProgress(currentProgress);
// //       }, 300);

// //       console.log("Sending OCR request to backend:", {
// //         url: "http://127.0.0.1:5000/api/ocr",
// //         file: file.name,
// //         size: file.size,
// //         type: file.type,
// //         documentType,
// //       });

// //       // Make the actual API call to the Python backend with timeout
// //       const controller = new AbortController();
// //       const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

// //       fetch("http://127.0.0.1:5000/api/ocr", {
// //         method: "POST",
// //         body: formData,
// //         signal: controller.signal,
// //       })
// //         .then((response) => {
// //           clearInterval(progressInterval);
// //           clearTimeout(timeoutId);

// //           if (!response.ok) {
// //             throw new Error(`HTTP error! Status: ${response.status}`);
// //           }

// //           onProgress(100); // Set progress to 100% when complete
// //           return response.json();
// //         })
// //         .then((data) => {
// //           console.log("OCR Response:", data);

// //           // Simulate a slight delay to show completion
// //           setTimeout(() => {
// //             if (data.error) {
// //               reject(new Error(data.error));
// //             } else {
// //               resolve(data as OcrData);
// //             }
// //           }, 500);
// //         })
// //         .catch((error) => {
// //           clearInterval(progressInterval);
// //           clearTimeout(timeoutId);
// //           console.error("OCR Error:", error);

// //           // Provide more specific error message for connection issues
// //           if (
// //             error.message === "Failed to fetch" ||
// //             error.name === "AbortError"
// //           ) {
// //             console.error(
// //               "Backend connection failed. Make sure the Flask server is running on http://127.0.0.1:5000"
// //             );
// //             reject(
// //               new Error(
// //                 "Cannot connect to OCR backend server. Please ensure the backend server is running on http://127.0.0.1:5000 and Tesseract OCR is installed."
// //               )
// //             );
// //           } else {
// //             reject(error);
// //           }
// //         });
// //     } catch (error) {
// //       console.error("OCR processing setup error:", error);
// //       reject(error);
// //     }
// //   });
// // };

// // // Simplified method for backwards compatibility with existing code
// // export const sendOcrRequest = async (
// //   file: File,
// //   documentType: string = "idCard"
// // ): Promise<OcrData> => {
// //   return processDocumentWithOcr(file, documentType, () => {});
// // };

// // OCR service that communicates with the Python backend

// // Define the response type from the OCR service
// export interface OcrData {
//   full_name: string;
//   cnic: string;
//   dob: string;
//   father_name: string;
//   gender: string;
//   address: string;
//   nationality: string;
//   phone: string;
//   email: string;
//   matric_percentage: string;
//   fsc_percentage: string;
//   domicile: string;
// }

// // Function to check if the backend server is available
// export const checkBackendAvailability = async (): Promise<boolean> => {
//   try {
//     console.log("Checking backend server availability...");
//     const response = await fetch("http://127.0.0.1:5000/api/health", {
//       method: "GET",
//       // Increased timeout to allow for slower startups
//       signal: AbortSignal.timeout(5000),
//     });

//     const data = await response.json();
//     console.log("Backend server status:", data);

//     return response.ok;
//   } catch (error) {
//     console.error("Backend server check failed:", error);

//     // Provide more specific error messages based on error type
//     if (error.name === "AbortError") {
//       console.log(
//         "Connection timed out. The backend server might be starting up or not running."
//       );
//     } else if (error.message === "Failed to fetch") {
//       console.log(
//         "Failed to connect to the backend server. Make sure it is running on http://127.0.0.1:5000"
//       );
//     }

//     return false;
//   }
// };

// // Try connecting to the backend with multiple attempts
// export const tryConnectBackend = async (maxAttempts = 3): Promise<boolean> => {
//   console.log(
//     `Attempting to connect to backend (max ${maxAttempts} attempts)...`
//   );

//   for (let attempt = 1; attempt <= maxAttempts; attempt++) {
//     console.log(`Connection attempt ${attempt}/${maxAttempts}...`);

//     const isAvailable = await checkBackendAvailability().catch(() => false);

//     if (isAvailable) {
//       console.log("Successfully connected to backend server");
//       return true;
//     }

//     if (attempt < maxAttempts) {
//       console.log(`Waiting before retry attempt ${attempt + 1}...`);
//       // Wait 1 second before trying again
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//     }
//   }

//   console.error(
//     `Failed to connect to backend server after ${maxAttempts} attempts`
//   );
//   return false;
// };

// // Function to process document with OCR using the Python backend
// export const processDocumentWithOcr = async (
//   file: File,
//   documentType: string,
//   onProgress: (progress: number) => void
// ): Promise<OcrData> => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       // Check if backend is available with multiple attempts
//       const isBackendAvailable = await tryConnectBackend(3);

//       if (!isBackendAvailable) {
//         throw new Error(
//           "Cannot connect to OCR backend server. Please ensure the backend server is running on http://127.0.0.1:5000"
//         );
//       }

//       // Create FormData object to send the file and document type
//       const formData = new FormData();
//       formData.append("file", file);
//       formData.append("documentType", documentType);

//       // Simulate progress updates since fetch doesn't have built-in progress
//       const progressInterval = setInterval(() => {
//         const randomProgress = Math.floor(Math.random() * 10) + 1;
//         onProgress(Math.min(randomProgress + (onProgress as any)[0] || 0, 90));
//       }, 300);

//       console.log("Sending OCR request to backend:", {
//         url: "http://127.0.0.1:5000/api/ocr",
//         file: file.name,
//         size: file.size,
//         type: file.type,
//         documentType,
//       });

//       // Make the actual API call to the Python backend with increased timeout
//       const controller = new AbortController();
//       const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout (increased from 30)

//       fetch("http://127.0.0.1:5000/api/ocr", {
//         method: "POST",
//         body: formData,
//         signal: controller.signal,
//       })
//         .then((response) => {
//           clearInterval(progressInterval);
//           clearTimeout(timeoutId);

//           if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//           }

//           onProgress(100); // Set progress to 100% when complete
//           return response.json();
//         })
//         .then((data) => {
//           console.log("OCR Response:", data);

//           // Simulate a slight delay to show completion
//           setTimeout(() => {
//             if (data.error) {
//               reject(new Error(data.error));
//             } else {
//               resolve(data as OcrData);
//             }
//           }, 500);
//         })
//         .catch((error) => {
//           clearInterval(progressInterval);
//           clearTimeout(timeoutId);
//           console.error("OCR Error:", error);

//           // Provide more specific error message for connection issues
//           if (
//             error.message === "Failed to fetch" ||
//             error.name === "AbortError"
//           ) {
//             console.error(
//               "Backend connection failed. Make sure the Flask server is running on http://127.0.0.1:5000"
//             );
//             reject(
//               new Error(
//                 "Cannot connect to OCR backend server. Please ensure the backend server is running on http://127.0.0.1:5000 and Tesseract OCR is installed."
//               )
//             );
//           } else {
//             reject(error);
//           }
//         });
//     } catch (error) {
//       console.error("OCR processing setup error:", error);
//       reject(error);
//     }
//   });
// };

// // Simplified method for backwards compatibility with existing code
// export const sendOcrRequest = async (
//   file: File,
//   documentType: string = "idCard"
// ): Promise<OcrData> => {
//   return processDocumentWithOcr(file, documentType, () => {});
// };

// OCR service that communicates with the Python backend

// Define the response type from the OCR service
// export interface OcrData {
//   full_name: string;
//   cnic: string;
//   dob: string;
//   father_name: string;
//   gender: string;
//   address: string;
//   nationality: string;
//   phone: string;
//   email: string;
//   matric_percentage: string;
//   fsc_percentage: string;
//   domicile: string;
// }

// // Function to check if the backend server is available
// export const checkBackendAvailability = async (): Promise<boolean> => {
//   try {
//     console.log("Checking backend server availability...");
//     const response = await fetch("http://127.0.0.1:5000/api/health", {
//       method: "GET",
//       // Increased timeout to allow for slower startups
//       signal: AbortSignal.timeout(5000),
//     });

//     const data = await response.json();
//     console.log("Backend server status:", data);

//     return response.ok;
//   } catch (error) {
//     console.error("Backend server check failed:", error);

//     // Provide more specific error messages based on error type
//     if (error.name === "AbortError") {
//       console.log(
//         "Connection timed out. The backend server might be starting up or not running."
//       );
//     } else if (error.message === "Failed to fetch") {
//       console.log(
//         "Failed to connect to the backend server. Make sure it is running on http://127.0.0.1:5000"
//       );
//     }

//     return false;
//   }
// };

// // Try connecting to the backend with multiple attempts
// export const tryConnectBackend = async (maxAttempts = 3): Promise<boolean> => {
//   console.log(
//     `Attempting to connect to backend (max ${maxAttempts} attempts)...`
//   );

//   for (let attempt = 1; attempt <= maxAttempts; attempt++) {
//     console.log(`Connection attempt ${attempt}/${maxAttempts}...`);

//     const isAvailable = await checkBackendAvailability().catch(() => false);

//     if (isAvailable) {
//       console.log("Successfully connected to backend server");
//       return true;
//     }

//     if (attempt < maxAttempts) {
//       console.log(`Waiting before retry attempt ${attempt + 1}...`);
//       // Wait 1 second before trying again
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//     }
//   }

//   console.error(
//     `Failed to connect to backend server after ${maxAttempts} attempts`
//   );
//   return false;
// };

// // Function to process document with OCR using the Python backend
// export const processDocumentWithOcr = async (
//   file: File,
//   documentType: string,
//   onProgress: (progress: number) => void
// ): Promise<OcrData> => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       // Check if backend is available with multiple attempts
//       const isBackendAvailable = await tryConnectBackend(3);

//       if (!isBackendAvailable) {
//         throw new Error(
//           "Cannot connect to OCR backend server. Please ensure the backend server is running on http://127.0.0.1:5000"
//         );
//       }

//       console.log(`Processing ${documentType} document:`, file.name);

//       const formData = new FormData();
//       formData.append("file", file);
//       formData.append("documentType", documentType);

//       // Progress simulation
//       const progressInterval = setInterval(() => {
//         const randomProgress = Math.floor(Math.random() * 10) + 1;
//         onProgress(Math.min(randomProgress + (onProgress as any)[0] || 0, 90));
//       }, 300);

//       // Make API call with increased timeout (120 seconds for complex documents)
//       const controller = new AbortController();
//       const timeoutId = setTimeout(() => controller.abort(), 120000);

//       try {
//         const response = await fetch("http://127.0.0.1:5000/api/ocr", {
//           method: "POST",
//           body: formData,
//           signal: controller.signal,
//         });

//         clearInterval(progressInterval);
//         clearTimeout(timeoutId);

//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         onProgress(100);
//         const data = await response.json();

//         if (data.error) {
//           throw new Error(data.error);
//         }

//         // Validate and clean the extracted data
//         const cleanedData = validateAndCleanData(data);
//         console.log("Cleaned OCR data:", cleanedData);

//         // Add slight delay to show completion
//         setTimeout(() => resolve(cleanedData), 500);
//       } catch (error) {
//         clearInterval(progressInterval);
//         clearTimeout(timeoutId);
//         console.error("OCR Error:", error);

//         if (error.name === "AbortError") {
//           reject(
//             new Error(
//               "OCR processing timed out. The document might be too complex or unclear."
//             )
//           );
//         } else if (error.message === "Failed to fetch") {
//           reject(
//             new Error(
//               "Cannot connect to OCR backend server. Please ensure the backend server is running on http://127.0.0.1:5000"
//             )
//           );
//         } else {
//           reject(error);
//         }
//       }
//     } catch (error) {
//       console.error("OCR processing setup error:", error);
//       reject(error);
//     }
//   });
// };

// // Helper function to validate and clean extracted data
// const validateAndCleanData = (data: any): OcrData => {
//   const cleanedData: OcrData = {
//     full_name: "",
//     cnic: "",
//     dob: "",
//     father_name: "",
//     gender: "",
//     address: "",
//     nationality: "Pakistani",
//     phone: "",
//     email: "",
//     matric_percentage: "",
//     fsc_percentage: "",
//     domicile: "",
//   };

//   // Clean and validate each field
//   for (const [key, value] of Object.entries(data)) {
//     if (key in cleanedData) {
//       let cleanedValue = String(value || "").trim();

//       // Apply field-specific cleaning/validation
//       switch (key) {
//         case "cnic":
//           // Ensure proper CNIC format (12345-1234567-1)
//           cleanedValue = cleanedValue.replace(/[^\d]/g, "");
//           if (cleanedValue.length === 13) {
//             cleanedValue = `${cleanedValue.slice(0, 5)}-${cleanedValue.slice(
//               5,
//               12
//             )}-${cleanedValue.slice(12)}`;
//           }
//           break;

//         case "dob":
//           // Ensure proper date format
//           if (cleanedValue) {
//             try {
//               const date = new Date(cleanedValue);
//               cleanedValue = date.toISOString().split("T")[0];
//             } catch (e) {
//               console.warn("Invalid date format:", cleanedValue);
//             }
//           }
//           break;

//         case "matric_percentage":
//         case "fsc_percentage":
//           // Ensure percentage is a valid number
//           cleanedValue = cleanedValue.replace(/[^\d.]/g, "");
//           const percentage = parseFloat(cleanedValue);
//           if (!isNaN(percentage) && percentage >= 0 && percentage <= 100) {
//             cleanedValue = percentage.toFixed(2);
//           } else {
//             cleanedValue = "";
//           }
//           break;
//       }

//       cleanedData[key as keyof OcrData] = cleanedValue;
//     }
//   }

//   return cleanedData;
// };

// // Simplified method for backwards compatibility with existing code
// export const sendOcrRequest = async (
//   file: File,
//   documentType: string = "idCard"
// ): Promise<OcrData> => {
//   return processDocumentWithOcr(file, documentType, () => {});
// };

// export interface OcrData {
//   full_name: string;
//   cnic: string;
//   dob: string;
//   father_name: string;
//   gender: string;
//   address: string;
//   nationality: string;
//   phone: string;
//   email: string;
//   matric_percentage: string;
//   fsc_percentage: string;
//   domicile: string;
// }

// // Function to check if the backend server is available
// export const checkBackendAvailability = async (): Promise<boolean> => {
//   try {
//     console.log("Checking backend server availability...");
//     const response = await fetch("http://127.0.0.1:5000/api/health", {
//       method: "GET",
//       // Increased timeout to allow for slower startups
//       signal: AbortSignal.timeout(5000),
//     });

//     const data = await response.json();
//     console.log("Backend server status:", data);

//     return response.ok;
//   } catch (error: any) {
//     console.error("Backend server check failed:", error);

//     // Provide more specific error messages based on error type
//     if ((error as any).name === "AbortError") {
//       console.log(
//         "Connection timed out. The backend server might be starting up or not running."
//       );
//     } else if ((error as any).message === "Failed to fetch") {
//       console.log(
//         "Failed to connect to the backend server. Make sure it is running on http://127.0.0.1:5000"
//       );
//     }

//     return false;
//   }
// };

// // Try connecting to the backend with multiple attempts
// export const tryConnectBackend = async (maxAttempts = 3): Promise<boolean> => {
//   console.log(
//     `Attempting to connect to backend (max ${maxAttempts} attempts)...`
//   );

//   for (let attempt = 1; attempt <= maxAttempts; attempt++) {
//     console.log(`Connection attempt ${attempt}/${maxAttempts}...`);

//     const isAvailable = await checkBackendAvailability().catch(() => false);

//     if (isAvailable) {
//       console.log("Successfully connected to backend server");
//       return true;
//     }

//     if (attempt < maxAttempts) {
//       console.log(`Waiting before retry attempt ${attempt + 1}...`);
//       // Wait 1 second before trying again
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//     }
//   }

//   console.error(
//     `Failed to connect to backend server after ${maxAttempts} attempts`
//   );
//   return false;
// };

// // Function to process document with OCR using the Python backend
// export const processDocumentWithOcr = async (
//   file: File,
//   documentType: string,
//   onProgress: (progress: number) => void
// ): Promise<OcrData> => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       // Check if backend is available with multiple attempts
//       const isBackendAvailable = await tryConnectBackend(3);

//       if (!isBackendAvailable) {
//         throw new Error(
//           "Cannot connect to OCR backend server. Please ensure the backend server is running on http://127.0.0.1:5000"
//         );
//       }

//       console.log(`Processing ${documentType} document:`, file.name);

//       const formData = new FormData();
//       formData.append("file", file);
//       formData.append("documentType", documentType);

//       // Progress simulation
//       const progressInterval = setInterval(() => {
//         const randomProgress = Math.floor(Math.random() * 10) + 1;
//         onProgress(Math.min(randomProgress + (onProgress as any)[0] || 0, 90));
//       }, 300);

//       // Make API call with increased timeout (120 seconds for complex documents)
//       const controller = new AbortController();
//       const timeoutId = setTimeout(() => controller.abort(), 120000);

//       try {
//         const response = await fetch("http://127.0.0.1:5000/api/ocr", {
//           method: "POST",
//           body: formData,
//           signal: controller.signal,
//         });

//         clearInterval(progressInterval);
//         clearTimeout(timeoutId);

//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         onProgress(100);
//         const data = await response.json();

//         if (data.error) {
//           throw new Error(data.error);
//         }

//         // Validate and clean the extracted data
//         const cleanedData = validateAndCleanData(data);
//         console.log("Cleaned OCR data:", cleanedData);

//         // Add slight delay to show completion
//         setTimeout(() => resolve(cleanedData), 500);
//       } catch (error: any) {
//         clearInterval(progressInterval);
//         clearTimeout(timeoutId);
//         console.error("OCR Error:", error);

//         if ((error as any).name === "AbortError") {
//           reject(
//             new Error(
//               "OCR processing timed out. The document might be too complex or unclear."
//             )
//           );
//         } else if ((error as any).message === "Failed to fetch") {
//           reject(
//             new Error(
//               "Cannot connect to OCR backend server. Please ensure the backend server is running on http://127.0.0.1:5000"
//             )
//           );
//         } else {
//           reject(error);
//         }
//       }
//     } catch (error: any) {
//       console.error("OCR processing setup error:", error);
//       reject(error);
//     }
//   });
// };

// // Helper function to validate and clean extracted data
// const validateAndCleanData = (data: any): OcrData => {
//   const cleanedData: OcrData = {
//     full_name: "",
//     cnic: "",
//     dob: "",
//     father_name: "",
//     gender: "",
//     address: "",
//     nationality: "Pakistani",
//     phone: "",
//     email: "",
//     matric_percentage: "",
//     fsc_percentage: "",
//     domicile: "",
//   };

//   // Clean and validate each field
//   for (const [key, value] of Object.entries(data)) {
//     if (key in cleanedData) {
//       let cleanedValue = String(value || "").trim();

//       // Apply field-specific cleaning/validation
//       switch (key) {
//         case "cnic":
//           // Ensure proper CNIC format (12345-1234567-1)
//           cleanedValue = cleanedValue.replace(/[^\d]/g, "");
//           if (cleanedValue.length === 13) {
//             cleanedValue = `${cleanedValue.slice(0, 5)}-${cleanedValue.slice(
//               5,
//               12
//             )}-${cleanedValue.slice(12)}`;
//           }
//           break;

//         case "dob":
//           // Ensure proper date format
//           if (cleanedValue) {
//             try {
//               const date = new Date(cleanedValue);
//               cleanedValue = date.toISOString().split("T")[0];
//             } catch (e) {
//               console.warn("Invalid date format:", cleanedValue);
//             }
//           }
//           break;

//         case "matric_percentage":
//         case "fsc_percentage":
//           // Ensure percentage is a valid number
//           cleanedValue = cleanedValue.replace(/[^\d.]/g, "");
//           const percentage = parseFloat(cleanedValue);
//           if (!isNaN(percentage) && percentage >= 0 && percentage <= 100) {
//             cleanedValue = percentage.toFixed(2);
//           } else {
//             cleanedValue = "";
//           }
//           break;
//       }

//       cleanedData[key as keyof OcrData] = cleanedValue;
//     }
//   }

//   return cleanedData;
// };

// // Simplified method for backwards compatibility with existing code
// export const sendOcrRequest = async (
//   file: File,
//   documentType: string = "idCard"
// ): Promise<OcrData> => {
//   return processDocumentWithOcr(file, documentType, () => {});
// };

export interface OcrData {
  full_name: string;
  cnic: string;
  dob: string;
  father_name: string;
  mother_name: string;
  gender: string;
  address: string;
  nationality: string;
  phone: string;
  email: string;
  matric_percentage: string;
  fsc_percentage: string;
  domicile: string;
  religion: string;
  city: string;
  marital_status: string;
  matric_board?: string;
  matric_passing_year?: string;
  matric_roll_number?: string;
  fsc_board?: string;
  fsc_passing_year?: string;
  fsc_roll_number?: string;
}

// Function to check if the backend server is available
export const checkBackendAvailability = async (): Promise<boolean> => {
  try {
    console.log("Checking backend server availability...");
    const response = await fetch("http://127.0.0.1:5000/api/health", {
      method: "GET",
      // Increased timeout to allow for slower startups
      signal: AbortSignal.timeout(5000),
    });

    const data = await response.json();
    console.log("Backend server status:", data);

    return response.ok;
  } catch (error: any) {
    console.error("Backend server check failed:", error);

    // Provide more specific error messages based on error type
    if (error.name === "AbortError") {
      console.log(
        "Connection timed out. The backend server might be starting up or not running."
      );
    } else if (error.message === "Failed to fetch") {
      console.log(
        "Failed to connect to the backend server. Make sure it is running on http://127.0.0.1:5000"
      );
    }

    return false;
  }
};

// Try connecting to the backend with multiple attempts
export const tryConnectBackend = async (maxAttempts = 3): Promise<boolean> => {
  console.log(
    `Attempting to connect to backend (max ${maxAttempts} attempts)...`
  );

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    console.log(`Connection attempt ${attempt}/${maxAttempts}...`);

    const isAvailable = await checkBackendAvailability().catch(() => false);

    if (isAvailable) {
      console.log("Successfully connected to backend server");
      return true;
    }

    if (attempt < maxAttempts) {
      console.log(`Waiting before retry attempt ${attempt + 1}...`);
      // Wait 1 second before trying again
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  console.error(
    `Failed to connect to backend server after ${maxAttempts} attempts`
  );
  return false;
};

// Function to process document with OCR using the Python backend
export const processDocumentWithOcr = async (
  file: File,
  documentType: string,
  onProgress: (progress: number) => void
): Promise<OcrData> => {
  return new Promise(async (resolve, reject) => {
    try {
      // Check if backend is available with multiple attempts
      const isBackendAvailable = await tryConnectBackend(3);

      if (!isBackendAvailable) {
        throw new Error(
          "Cannot connect to OCR backend server. Please ensure the backend server is running on http://127.0.0.1:5000"
        );
      }

      console.log(`Processing ${documentType} document:`, file.name);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("documentType", documentType);

      // Progress simulation - make it more realistic
      let progress = 0;
      const progressInterval = setInterval(() => {
        if (progress < 30) {
          // Initial preprocessing phase
          progress += Math.floor(Math.random() * 5) + 1;
        } else if (progress < 60) {
          // OCR processing phase (slower)
          progress += Math.floor(Math.random() * 3) + 1;
        } else if (progress < 85) {
          // Data extraction phase
          progress += Math.floor(Math.random() * 2) + 1;
        }

        onProgress(Math.min(progress, 90));
      }, 300);

      // Make API call with increased timeout (120 seconds for complex documents)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000);

      try {
        const response = await fetch("http://127.0.0.1:5000/api/ocr", {
          method: "POST",
          body: formData,
          signal: controller.signal,
        });

        clearInterval(progressInterval);
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        onProgress(95); // Almost done
        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        // Validate and clean the extracted data
        const cleanedData = validateAndCleanData(data, documentType);
        console.log("Cleaned OCR data:", cleanedData);

        onProgress(100); // Done

        // Add slight delay to show completion
        setTimeout(() => resolve(cleanedData), 500);
      } catch (error: any) {
        clearInterval(progressInterval);
        clearTimeout(timeoutId);
        console.error("OCR Error:", error);

        if (error.name === "AbortError") {
          reject(
            new Error(
              "OCR processing timed out. The document might be too complex or unclear."
            )
          );
        } else if (error.message === "Failed to fetch") {
          reject(
            new Error(
              "Cannot connect to OCR backend server. Please ensure the backend server is running on http://127.0.0.1:5000"
            )
          );
        } else {
          reject(error);
        }
      }
    } catch (error: any) {
      console.error("OCR processing setup error:", error);
      reject(error);
    }
  });
};

// Helper function to validate and clean extracted data based on document type
const validateAndCleanData = (data: any, documentType: string): OcrData => {
  const cleanedData: OcrData = {
    full_name: "",
    cnic: "",
    dob: "",
    father_name: "",
    mother_name: "",
    gender: "",
    address: "",
    nationality: "Pakistani",
    phone: "",
    email: "",
    matric_percentage: "",
    fsc_percentage: "",
    domicile: "",
    religion: "",
    city: "",
    marital_status: "",
  };

  // Clean and validate each field
  for (const [key, value] of Object.entries(data)) {
    if (key in cleanedData) {
      let cleanedValue = String(value || "").trim();

      // Apply field-specific cleaning/validation
      switch (key) {
        case "cnic":
          // Ensure proper CNIC format (12345-1234567-1)
          cleanedValue = cleanedValue.replace(/[^\d]/g, "");
          if (cleanedValue.length === 13) {
            cleanedValue = `${cleanedValue.slice(0, 5)}-${cleanedValue.slice(
              5,
              12
            )}-${cleanedValue.slice(12)}`;
          }
          break;

        case "dob":
          // Ensure proper date format
          if (cleanedValue) {
            try {
              const date = new Date(cleanedValue);
              cleanedValue = date.toISOString().split("T")[0];
            } catch (e) {
              console.warn("Invalid date format:", cleanedValue);
            }
          }
          break;

        case "gender":
          // Standardize gender values
          cleanedValue = cleanedValue.toLowerCase();
          if (cleanedValue === "m") cleanedValue = "Male";
          if (cleanedValue === "f") cleanedValue = "Female";
          break;

        case "matric_percentage":
        case "fsc_percentage":
          // Ensure percentage is a valid number
          cleanedValue = cleanedValue.replace(/[^\d.]/g, "");
          const percentage = parseFloat(cleanedValue);
          if (!isNaN(percentage) && percentage > 0) {
            // If percentage seems to be out of 1100 or other total, convert to percentage
            if (percentage > 100) {
              const normalizedPercentage = (percentage / 1100) * 100; // Assuming total marks are around 1100
              cleanedValue = normalizedPercentage.toFixed(2);
            } else {
              cleanedValue = percentage.toFixed(2);
            }
          } else {
            cleanedValue = "";
          }
          break;

        case "phone":
          // Format phone numbers consistently
          cleanedValue = cleanedValue.replace(/[^\d+]/g, "");
          if (cleanedValue.length >= 10) {
            // If it starts with Pakistan code
            if (cleanedValue.startsWith("92")) {
              cleanedValue = "+" + cleanedValue;
            }
            // If it's a 10-digit number without country code
            else if (cleanedValue.length === 10) {
              cleanedValue = "+92" + cleanedValue.substring(1);
            }
          }
          break;
      }

      cleanedData[key as keyof OcrData] = cleanedValue;
    }
  }

  // Set additional fields based on document type
  if (documentType === "idCard" || documentType === "bForm") {
    if (!cleanedData.nationality) cleanedData.nationality = "Pakistani";

    // Extract city from address if not found
    if (!cleanedData.city && cleanedData.address) {
      const commonCities = [
        "Karachi",
        "Lahore",
        "Islamabad",
        "Rawalpindi",
        "Peshawar",
        "Quetta",
        "Multan",
        "Faisalabad",
        "Hyderabad",
        "Sialkot",
        "Gujranwala",
      ];
      for (const city of commonCities) {
        if (cleanedData.address.includes(city)) {
          cleanedData.city = city;
          break;
        }
      }
    }
  }

  if (documentType === "matricResult") {
    // Extract additional fields
    if (data.matric_board)
      cleanedData.matric_board = String(data.matric_board || "").trim();
    if (data.matric_passing_year)
      cleanedData.matric_passing_year = String(
        data.matric_passing_year || ""
      ).trim();
    if (data.matric_roll_number)
      cleanedData.matric_roll_number = String(
        data.matric_roll_number || ""
      ).trim();
  }

  if (documentType === "fscResult") {
    // Extract additional fields
    if (data.fsc_board)
      cleanedData.fsc_board = String(data.fsc_board || "").trim();
    if (data.fsc_passing_year)
      cleanedData.fsc_passing_year = String(data.fsc_passing_year || "").trim();
    if (data.fsc_roll_number)
      cleanedData.fsc_roll_number = String(data.fsc_roll_number || "").trim();
  }

  // Make educated guesses for missing fields based on available data
  if (!cleanedData.gender && cleanedData.full_name) {
    // Attempt to guess gender based on common Pakistani names
    const maleNames = [
      "Ahmad",
      "Muhammad",
      "Ali",
      "Hassan",
      "Hussain",
      "Shahid",
      "Tariq",
      "Usman",
    ];
    const femaleNames = [
      "Fatima",
      "Ayesha",
      "Maryam",
      "Sana",
      "Sara",
      "Zainab",
      "Amina",
    ];

    const name = cleanedData.full_name.toLowerCase();

    let isMale = maleNames.some((maleName) =>
      name.includes(maleName.toLowerCase())
    );
    let isFemale = femaleNames.some((femaleName) =>
      name.includes(femaleName.toLowerCase())
    );

    if (isMale && !isFemale) cleanedData.gender = "Male";
    else if (isFemale && !isMale) cleanedData.gender = "Female";
  }

  return cleanedData;
};

// Simplified method for backwards compatibility with existing code
export const sendOcrRequest = async (
  file: File,
  documentType: string = "idCard"
): Promise<OcrData> => {
  return processDocumentWithOcr(file, documentType, () => {});
};

// Save extracted student data to Firebase
export const saveStudentDataToFirebase = async (
  studentData: Record<string, any>
): Promise<string> => {
  try {
    const timestamp = new Date().toISOString();
    const studentId = `student_${Date.now()}`;

    // Prepare data for Firebase
    const dataToSave = {
      ...studentData,
      id: studentId,
      created_at: timestamp,
      updated_at: timestamp,
    };

    // Create a unique identifier for the student
    const response = await fetch(
      "https://numl-admitease-default-rtdb.firebaseio.com/students.json",
      {
        method: "POST",
        body: JSON.stringify(dataToSave),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Student data saved to Firebase:", data);

    return data.name; // Firebase returns the unique key
  } catch (error) {
    console.error("Error saving to Firebase:", error);
    throw error;
  }
};

// Function to initialize Firebase - called when the app starts
export const initFirebase = async (): Promise<void> => {
  console.log("Initializing Firebase connection...");

  // For Firebase Web SDK v9, this would be the initialization code
  // We're using the REST API approach for simplicity without needing to add the Firebase SDK

  try {
    // Test the connection to Firebase
    const response = await fetch(
      "https://numl-admitease-default-rtdb.firebaseio.com/.json",
      {
        method: "GET",
      }
    );

    if (response.ok) {
      console.log("Firebase connection successful");
    } else {
      console.error("Could not connect to Firebase:", response.statusText);
    }
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
};

// Call initFirebase when this module is imported
initFirebase();
