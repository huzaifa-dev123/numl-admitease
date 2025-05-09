export const firebaseConfig = {
  apiKey: "AIzaSyDy9iDk7ukbjXDHy9_JoS8MxhPBZrpiItQ", // Replace with your Firebase API key
  authDomain: "numl-admitease.firebaseapp.com", // Replace with your Firebase auth domain
  databaseURL: "https://numl-admitease-default-rtdb.firebaseio.com", // Replace with your Firebase database URL
  projectId: "numl-admitease", // Replace with your Firebase project ID
  storageBucket: "numl-admitease.appspot.com", // Replace with your Firebase storage bucket
  messagingSenderId: "123456789012", // Replace with your Firebase messaging sender ID
  appId: "1:123456789012:web:abc123def456ghi789", // Replace with your Firebase app ID
};

// Save data to Firebase using REST API
export const saveToFirebase = async (
  path: string,
  data: any
): Promise<string> => {
  try {
    const url = `${firebaseConfig.databaseURL}/${path}.json`;
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Firebase error: ${response.status} ${response.statusText}`
      );
    }

    const responseData = await response.json();
    return responseData.name; // Firebase returns the unique key in the "name" field
  } catch (error) {
    console.error("Error saving to Firebase:", error);
    throw error;
  }
};

// Fetch data from Firebase using REST API
export const fetchFromFirebase = async (path: string): Promise<any> => {
  try {
    const url = `${firebaseConfig.databaseURL}/${path}.json`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Firebase error: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching from Firebase:", error);
    throw error;
  }
};

// Update data in Firebase using REST API
export const updateInFirebase = async (
  path: string,
  data: any
): Promise<void> => {
  try {
    const url = `${firebaseConfig.databaseURL}/${path}.json`;
    const response = await fetch(url, {
      method: "PATCH", // PATCH to update only the fields provided
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Firebase error: ${response.status} ${response.statusText}`
      );
    }
  } catch (error) {
    console.error("Error updating in Firebase:", error);
    throw error;
  }
};

// Delete data from Firebase using REST API
export const deleteFromFirebase = async (path: string): Promise<void> => {
  try {
    const url = `${firebaseConfig.databaseURL}/${path}.json`;
    const response = await fetch(url, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(
        `Firebase error: ${response.status} ${response.statusText}`
      );
    }
  } catch (error) {
    console.error("Error deleting from Firebase:", error);
    throw error;
  }
};

// Test Firebase connection
export const testFirebaseConnection = async (): Promise<boolean> => {
  try {
    await fetchFromFirebase("");
    console.log("Firebase connection successful");
    return true;
  } catch (error) {
    console.error("Firebase connection test failed:", error);
    return false;
  }
};

// Initialize Firebase connection test when this module is imported
testFirebaseConnection();
