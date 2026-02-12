import {
    DrivePicker,
    DrivePickerDocsView,
} from "@googleworkspace/drive-picker-react";
import React from "react";

const GDrivePicker = ({ oauthToken }: { oauthToken: string }) => {
    const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
    const APP_ID = import.meta.env.VITE_APP_ID;

    const [events, setEvents] = React.useState<unknown[]>([]);

    return (
        <>
            <DrivePicker
                client-id={CLIENT_ID}
                app-id={APP_ID}
                oauth-token={oauthToken}
                onOauthResponse={(e) => setEvents([...events, e.detail])}
                onPicked={(e) => setEvents([...events, e.detail])}
                onCanceled={(e) => setEvents([...events, e.detail])}
            >
                <DrivePickerDocsView
                    owned-by-me="true"
                    mime-types="application/vnd.google-apps.spreadsheet"
                />
            </DrivePicker>
            {events.map((event, index) => (
                <pre className="event" key={index}>
                    {JSON.stringify(event, null, 2)}
                </pre>
            ))}
        </>
    );
};

export default GDrivePicker;
