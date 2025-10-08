export interface PropData {
  name: string;
  type: { name: string };
  defaultValue?: { value: string };
  required: boolean;
  description?: string;
}

export interface ComponentData {
  displayName: string;
  description?: string;
  props?: Record<string, PropData>;
}

export interface ExportInfo {
  exists: boolean;
  isComponent: boolean;
  isCompoundComponent: boolean;
  componentTypes?: string[];
}
