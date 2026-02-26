import type { SheetData } from "./googleSheetsUtil.js";
import type { ValidationResult } from "./crmValidator.js";

/* -------------------------------------------------------------------------- */
/*                            TS Types & Interfaces                           */
/* -------------------------------------------------------------------------- */

// Represents a single contact/lead from the CRM sheet
export interface Contact {
  id: string; // Unique identifier (row number or generated)
  name: string;
  email: string;
  phone?: string | undefined;
  // Additional fields from the sheet (company, notes, etc.)
  additionalFields?: Record<string, string> | undefined;
}

export interface ParseContactsResult {
  success: boolean;
  contacts?: Contact[];
  error?: string;
}

/* -------------------------------------------------------------------------- */
/*                        Contact Parsing Functions                           */
/* -------------------------------------------------------------------------- */

const isValidEmailFormat = (emailAddress: string): boolean => {
  // Basic email format check: must contain @ and a dot after @
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(emailAddress.trim());
};

export const parseContactsFromSheet = (
  sheetData: SheetData,
  validationResult: ValidationResult,
): ParseContactsResult => {
  try {
    // Validate that we have the required column indices
    if (
      validationResult.nameColumnIndex === undefined ||
      validationResult.emailColumnIndex === undefined
    ) {
      return {
        success: false,
        error: "Cannot parse contacts: missing required column information.",
      };
    }

    const nameColumnIndex = validationResult.nameColumnIndex;
    const emailColumnIndex = validationResult.emailColumnIndex;
    const phoneColumnIndex = validationResult.phoneColumnIndex;
    const headerRowIndex = validationResult.headerRowIndex ?? 0;

    // Extract header row to get column names for additional fields
    const headerRow = sheetData[headerRowIndex];
    const contacts: Contact[] = [];

    // Start from row after headers (index 1 if header is at 0)
    const dataStartRowIndex = headerRowIndex + 1;

    // Loop through each data row and create a Contact object
    for (
      let rowIndex = dataStartRowIndex;
      rowIndex < sheetData.length;
      rowIndex++
    ) {
      const row = sheetData[rowIndex];

      // Skip completely empty rows
      if (!row || row.every((cell) => !cell || cell.trim() === "")) {
        continue;
      }

      // Extract required fields
      const nameValue = row[nameColumnIndex]?.trim() || "";
      const emailValue = row[emailColumnIndex]?.trim() || "";

      // Skip rows that are missing required data
      if (!nameValue || !emailValue) {
        continue;
      }

      // Validate email format
      if (!isValidEmailFormat(emailValue)) {
        continue;
      }

      // Extract optional phone field
      const phoneValue =
        phoneColumnIndex !== undefined
          ? row[phoneColumnIndex]?.trim() || undefined
          : undefined;

      // Collect additional fields (all columns except name, email, phone)
      const additionalFields: Record<string, string> = {};
      if (validationResult.additionalColumns) {
        for (const [
          columnName,
          columnIndex,
        ] of validationResult.additionalColumns) {
          const cellValue = row[columnIndex]?.trim();
          if (cellValue) {
            additionalFields[columnName] = cellValue;
          }
        }
      }

      // Create contact object with unique ID (using row number)
      const contact: Contact = {
        id: `contact-${rowIndex}`, // Simple ID based on row number
        name: nameValue,
        email: emailValue,
        phone: phoneValue,
        additionalFields:
          Object.keys(additionalFields).length > 0
            ? additionalFields
            : undefined,
      };

      contacts.push(contact);
    }

    // Check if we parsed any contacts
    if (contacts.length === 0) {
      console.warn("⚠️ parseContactsFromSheet: No valid contacts found");
      return {
        success: false,
        error:
          "No valid contacts found in the sheet. Please make sure your sheet has rows with Name and Email data.",
      };
    }

    console.log(
      `✅ parseContactsFromSheet: Successfully parsed ${contacts.length} contacts`,
    );

    return {
      success: true,
      contacts: contacts,
    };
  } catch (error) {
    console.error("❌ parseContactsFromSheet: Error occurred:");
    console.error(
      "Error type:",
      error instanceof Error ? error.constructor.name : typeof error,
    );
    console.error(
      "Error message:",
      error instanceof Error ? error.message : String(error),
    );

    return {
      success: false,
      error:
        "An error occurred while parsing the sheet. Please try again or select a different sheet.",
    };
  }
};
