export interface Device {
  id: number;
  name: string;
  device_type_name: string;
}

export interface Connection {
  id: number;
  source_device_name: string;
  target_device_name: string;
}

export interface DeviceTypeOutput {
  id: number;
  device_type_name: string;
  output_device_type_name: string;
}

export enum DialogSaveMode {
  initial,
  alreadyExists,
  noErrors,
}
