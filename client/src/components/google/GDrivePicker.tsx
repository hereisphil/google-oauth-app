import {
  DrivePicker,
  DrivePickerDocsView,
} from "@googleworkspace/drive-picker-react";

interface GDrivePickerProps {
  oauthToken: string;
  onCancel?: () => void;
  onPicked?: (data: unknown) => void;
}

const GDrivePicker = ({
  oauthToken,
  onCancel,
  onPicked,
}: GDrivePickerProps) => {
  const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
  const APP_ID = import.meta.env.VITE_APP_ID;

  return (
    <DrivePicker
      client-id={CLIENT_ID}
      app-id={APP_ID}
      oauth-token={oauthToken}
      onOauthResponse={(e) => {
        console.log("OAuth response:", e.detail);
      }}
      onPicked={(e) => {
        console.log("File picked:", e.detail);
        if (onPicked) {
          onPicked(e.detail);
        }
      }}
      onCanceled={(e) => {
        console.log("Picker canceled:", e.detail);
        // Call the onCancel callback to notify parent component
        if (onCancel) {
          onCancel();
        }
      }}
    >
      <DrivePickerDocsView
        owned-by-me="true"
        mime-types="application/vnd.google-apps.spreadsheet"
      />
    </DrivePicker>
  );
};

export default GDrivePicker;
