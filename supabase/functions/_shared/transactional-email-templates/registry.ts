/// <reference types="npm:@types/react@18.3.1" />
import * as React from "npm:react@18.3.1";

export interface TemplateEntry {
  component: React.ComponentType<any>;
  subject: string | ((data: Record<string, any>) => string);
  to?: string;
  displayName?: string;
  previewData?: Record<string, any>;
}

import { template as subscriberWelcome } from "./subscriber-welcome.tsx";
import { template as brainWelcome } from "./brain-welcome.tsx";
import { template as purchaseConfirmation } from "./purchase-confirmation.tsx";
import { template as purchaseNotification } from "./purchase-notification.tsx";

export const TEMPLATES: Record<string, TemplateEntry> = {
  "subscriber-welcome": subscriberWelcome,
  "brain-welcome": brainWelcome,
  "purchase-confirmation": purchaseConfirmation,
  "purchase-notification": purchaseNotification,
};
