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
