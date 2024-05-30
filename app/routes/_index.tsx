import { json, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { fetchDevices } from "~/BackendController";

interface Device {
  id: number;
  name: string;
  device_type_name: string;
}

export const meta: MetaFunction = () => {
  return [
    { title: "Device Signal Chain" },
    {
      name: "An overview of your event broadcasting",
      content: "Welcome to the app!",
    },
  ];
};

export async function loader() {
  const raw_devices = await fetchDevices();

  const devices: Device[] = [];
  for (const raw_device of raw_devices) {
    const device: Device = {
      id: raw_device.id,
      name: raw_device.name,
      device_type_name: raw_device.device_type_name,
    };
    devices.push(device);
  }

  return json({
    devices: devices,
  });
}

export default function Index() {
  const loaderData = useLoaderData<typeof loader>();
  return (
    <>
      {loaderData.devices.map((device) => (
        <div key={device.id}>
          {device.id} - {device.device_type_name}
        </div>
      ))}
    </>
  );
}
