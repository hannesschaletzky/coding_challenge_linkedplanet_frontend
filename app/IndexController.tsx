/* eslint-disable @typescript-eslint/no-explicit-any */
import { Connection, Device, DeviceTypeOutput } from "~/Interfaces";
import {
  fetchConnections,
  fetchDeviceTypeOutputs,
  fetchDevices,
} from "./BackendController";

export const DROPDOWN_INITAL_VALUE = "Choose...";

export function determineDeviceType(deviceName: string, devices: Device[]) {
  return devices.find((device) => device.name == deviceName)?.device_type_name;
}

export function determineTargetDevices(
  deviceType: string,
  deviceTypeOutputs: DeviceTypeOutput[],
  devices: Device[]
): Device[] {
  const allowedOutputTypes = deviceTypeOutputs
    .filter((output) => deviceType == output.device_type_name)
    .map((output) => output.output_device_type_name);

  return devices.filter((device) =>
    allowedOutputTypes.includes(device.device_type_name)
  );
}

export function filterUsedDevices(
  connections: Connection[],
  devices: Device[]
) {
  const devicesFromConnetions: string[] = connections.flatMap((connection) => [
    connection.source_device_name,
    connection.target_device_name,
  ]);
  const deviceNamesSet: Set<string> = new Set(devicesFromConnetions);
  const uniqueDeviceNames: string[] = Array.from(deviceNamesSet);
  const usedDevices: Device[] = uniqueDeviceNames.map(
    (deviceName) => devices.find((device) => device.name == deviceName)!
  );
  return usedDevices;
}

export function filterIdleDevices(usedDevices: Device[], devices: Device[]) {
  return devices.filter((device) => !usedDevices.includes(device));
}

export async function getDeviceTypeOutputs() {
  const raw_deviceTypeOutputs = await fetchDeviceTypeOutputs();
  return parseDeviceTypeOutputs(raw_deviceTypeOutputs);
}

export async function getConnections() {
  const raw_connections = await fetchConnections();
  return parseConnections(raw_connections);
}

export async function getDevices() {
  const raw_devices = await fetchDevices();
  return parseDevices(raw_devices);
}

function parseDeviceTypeOutputs(raw_deviceTypeOutputs: any) {
  const deviceTypeOutputs: DeviceTypeOutput[] = [];
  for (const raw_deviceTypeOutput of raw_deviceTypeOutputs) {
    const deviceTypeOutput: DeviceTypeOutput = {
      id: raw_deviceTypeOutput.id,
      device_type_name: raw_deviceTypeOutput.device_type_name,
      output_device_type_name: raw_deviceTypeOutput.output_device_type_name,
    };
    deviceTypeOutputs.push(deviceTypeOutput);
  }
  return deviceTypeOutputs;
}

function parseConnections(raw_connections: any) {
  const connections: Connection[] = [];
  for (const raw_connection of raw_connections) {
    const connection: Connection = {
      id: raw_connection.id,
      source_device_name: raw_connection.source_device_name,
      target_device_name: raw_connection.target_device_name,
    };
    connections.push(connection);
  }
  return connections;
}

function parseDevices(raw_devices: any) {
  const devices: Device[] = [];
  for (const raw_device of raw_devices) {
    const device: Device = {
      id: raw_device.id,
      name: raw_device.name,
      device_type_name: raw_device.device_type_name,
    };
    devices.push(device);
  }
  return devices;
}
