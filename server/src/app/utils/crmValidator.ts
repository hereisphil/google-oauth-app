import type { SheetData } from "./googleSheetsUtil.js";

/* -------------------------------------------------------------------------- */
/*                            TS Types & Interfaces                           */
/* -------------------------------------------------------------------------- */

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
  headerRowIndex?: number;
  nameColumnIndex?: number;
  emailColumnIndex?: number;
  phoneColumnIndex?: number;
  additionalColumns?: Map<string, number>; // Column name -> index mapping
}

/* -------------------------------------------------------------------------- */
/*                      CRM Validation Helper Functions                       */
/* -------------------------------------------------------------------------- */

const normalizeColumnName = (columnName: string): string => {
  return columnName.toLowerCase().trim();
};

const isNameColumn = (normalizedColumnName: string): boolean => {
  const nameVariations = [
    "name",
    "full name",
    "first name",
    "last name",
    "firstname",
    "lastname",
    "fullname",
    "contact name",
    "customer name",
    "client name",
  ];

  return nameVariations.some((variation) =>
    normalizedColumnName.includes(variation),
  );
};

const isEmailColumn = (normalizedColumnName: string): boolean => {
  const emailVariations = [
    "email",
    "e-mail",
    "email address",
    "e-mail address",
    "emailaddress",
  ];

  return emailVariations.some((variation) =>
    normalizedColumnName.includes(variation),
  );
};

const isPhoneColumn = (normalizedColumnName: string): boolean => {
  const phoneVariations = [
    "phone",
    "telephone",
    "phone number",
    "telephone number",
    "mobile",
    "cell",
    "cell phone",
    "phonenumber",
  ];

  return phoneVariations.some((variation) =>
    normalizedColumnName.includes(variation),
  );
};

/* -------------------------------------------------------------------------- */
/*                              Begin Validation                              */
/* -------------------------------------------------------------------------- */

export const validateSheetForCRM = (sheetData: SheetData): ValidationResult => {
  // Check if sheet has any data
  if (!sheetData || sheetData.length === 0) {
    return {
      isValid: false,
      errorMessage:
        "The sheet is empty. Please select a sheet that contains contact data.",
    };
  }

  // Check if sheet has at least a header row
  if (sheetData.length < 1) {
    return {
      isValid: false,
      errorMessage: "The sheet must have at least one row with column headers.",
    };
  }

  // Assume the first row contains headers
  const headerRow = sheetData[0];
  if (!headerRow) {
    return {
      isValid: false,
      errorMessage: "The sheet must have at least one row with column headers.",
    };
  }
  const headerRowIndex = 0;

  // Find required columns by checking each header
  let nameColumnIndex: number | undefined = undefined;
  let emailColumnIndex: number | undefined = undefined;
  let phoneColumnIndex: number | undefined = undefined;
  const additionalColumns = new Map<string, number>();

  // Loop through each column header to find required fields
  for (let columnIndex = 0; columnIndex < headerRow.length; columnIndex++) {
    const columnHeader = headerRow[columnIndex];
    if (!columnHeader) {
      continue;
    }

    const normalizedHeader = normalizeColumnName(columnHeader);

    // Check if this is a name column
    if (isNameColumn(normalizedHeader) && nameColumnIndex === undefined) {
      nameColumnIndex = columnIndex;
    }
    // Check if this is an email column
    else if (
      isEmailColumn(normalizedHeader) &&
      emailColumnIndex === undefined
    ) {
      emailColumnIndex = columnIndex;
    }
    // Check if this is a phone column
    else if (
      isPhoneColumn(normalizedHeader) &&
      phoneColumnIndex === undefined
    ) {
      phoneColumnIndex = columnIndex;
    }
    // Store other columns for potential use
    else if (normalizedHeader) {
      additionalColumns.set(columnHeader, columnIndex);
    }
  }

  // Validate that we found required columns
  const missingColumns: string[] = [];

  if (nameColumnIndex === undefined) {
    missingColumns.push("Name");
  }

  if (emailColumnIndex === undefined) {
    missingColumns.push("Email");
  }

  // Name and Email are required; Phone is optional but recommended
  if (missingColumns.length > 0) {
    const errorMessage =
      `The sheet is missing required columns: ${missingColumns.join(", ")}. ` +
      `Please make sure your sheet has columns for Name and Email at minimum. ` +
      `Common column names: "Name" or "Full Name" for names, "Email" or "Email Address" for emails.`;

    return {
      isValid: false,
      errorMessage: errorMessage,
    };
  }

  // Check if there's actual data (not just headers)
  if (sheetData.length < 2) {
    return {
      isValid: false,
      errorMessage:
        "The sheet only contains headers but no contact data. Please add at least one contact row.",
    };
  }

  return {
    isValid: true,
    headerRowIndex: headerRowIndex,
    nameColumnIndex: nameColumnIndex ?? 0,
    emailColumnIndex: emailColumnIndex ?? 0,
    phoneColumnIndex: phoneColumnIndex ?? 0,
    additionalColumns: additionalColumns,
  };
};
