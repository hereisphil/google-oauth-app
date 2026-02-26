import { google } from "googleapis";

/* -------------------------------------------------------------------------- */
/*                            TS Types & Interfaces                           */
/* -------------------------------------------------------------------------- */

// Represents the raw data structure returned from Google Sheets API
// Each row is an array of strings representing cell values
export type SheetData = string[][];

// Result object returned when fetching sheet data
export interface SheetDataResult {
  success: boolean;
  data?: SheetData;
  error?: string;
}

/* -------------------------------------------------------------------------- */
/*                    Google Sheets API Utility Functions                     */
/* -------------------------------------------------------------------------- */

// The frontend will send the user's accessToken selected fileId (via the Google Drive Picker) to the backend
// This function will use that id and the access token to fetch the sheet data

export const getGoogleSheetData = async (
  fileId: string,
  accessToken: string,
): Promise<SheetDataResult> => {
  try {
    // Create an OAuth2 client and set the access token
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    // Initialize the Google Sheets API client
    const sheetsApiClient = google.sheets({
      version: "v4",
      auth: oauth2Client,
    });

    // Fetch the sheet data
    const response = await sheetsApiClient.spreadsheets.values.get({
      spreadsheetId: fileId,
      range: "A:Z", // Read all columns from A to Z
    });

    // Extract the values from the response
    const sheetValues = response.data.values;

    // Check if we got any data
    if (!sheetValues || sheetValues.length === 0) {
      return {
        success: false,
        error:
          "The selected sheet appears to be empty. Please select a sheet with data.",
      };
    }

    // Convert the values to our SheetData type (array of string arrays)
    const sheetData: SheetData = sheetValues as string[][];

    return {
      success: true,
      data: sheetData,
    };
  } catch (error) {
    // Provide user-friendly error messages based on the error type
    let errorMessage = "Failed to read the Google Sheet. ";

    if (error instanceof Error) {
      if (error.message.includes("PERMISSION_DENIED")) {
        errorMessage +=
          "Please make sure you have access to this sheet and try again.";
      } else if (error.message.includes("NOT_FOUND")) {
        errorMessage +=
          "The sheet could not be found. Please check the file ID.";
      } else {
        errorMessage += error.message;
      }
    } else {
      errorMessage += "An unknown error occurred.";
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
};
