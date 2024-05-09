import { StatusIndicatorProps } from "@cloudscape-design/components";

export interface NavigationPanelState {
  collapsed?: boolean;
  collapsedSections?: Record<number, boolean>;
}

export interface Memo {
  //itemId: string;
  SK: string;
  name: string;
  type: string;
  status: StatusIndicatorProps.Type;
  details: number;
}
