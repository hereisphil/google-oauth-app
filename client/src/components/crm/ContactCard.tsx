import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, Phone, User } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                            TS Types & Interfaces                           */
/* -------------------------------------------------------------------------- */

// Represents a single contact/lead from the CRM sheet
export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  additionalFields?: Record<string, string>;
}

interface ContactCardProps {
  contact: Contact;
}

/* -------------------------------------------------------------------------- */
/*                            ContactCard Component                            */
/* -------------------------------------------------------------------------- */

export function ContactCard({ contact }: ContactCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-lg">{contact.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Email */}
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <CardDescription className="text-sm break-all">
            {contact.email}
          </CardDescription>
        </div>

        {/* Phone (if available) */}
        {contact.phone && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <CardDescription className="text-sm">
              {contact.phone}
            </CardDescription>
          </div>
        )}

        {/* Additional fields (if any) */}
        {contact.additionalFields &&
          Object.keys(contact.additionalFields).length > 0 && (
            <div className="pt-2 border-t space-y-1">
              {Object.entries(contact.additionalFields).map(
                ([fieldName, fieldValue]) => (
                  <div
                    key={fieldName}
                    className="text-xs text-muted-foreground"
                  >
                    <span className="font-medium capitalize">
                      {fieldName.replace(/([A-Z])/g, " $1").trim()}:
                    </span>{" "}
                    {fieldValue}
                  </div>
                ),
              )}
            </div>
          )}
      </CardContent>
    </Card>
  );
}
