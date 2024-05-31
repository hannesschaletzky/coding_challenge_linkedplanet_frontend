import { json, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Network } from "vis-network";
import { fetchConnections, fetchDevices } from "~/BackendController";
import { Device, Connection } from "~/Interfaces";
import Dialog from "~/components/Dialog";

export const meta: MetaFunction = () => {
  return [
    { title: "Device Signal Chain" },
    {
      name: "An overview of your event broadcast",
      content: "🏐",
    },
  ];
};

export async function loader() {
  const raw_devices = await fetchDevices();
  const raw_connections = await fetchConnections();

  // parse devices
  const devices: Device[] = [];
  for (const raw_device of raw_devices) {
    const device: Device = {
      id: raw_device.id,
      name: raw_device.name,
      device_type_name: raw_device.device_type_name,
    };
    devices.push(device);
  }

  // parse connections
  const connections: Connection[] = [];
  for (const raw_connection of raw_connections) {
    const connection: Connection = {
      id: raw_connection.id,
      source_device_name: raw_connection.source_device_name,
      target_device_name: raw_connection.target_device_name,
    };
    connections.push(connection);
  }

  // used devices
  const devicesFromConnetions: string[] = connections.flatMap((connection) => [
    connection.source_device_name,
    connection.target_device_name,
  ]);
  const deviceNamesSet: Set<string> = new Set(devicesFromConnetions);
  const uniqueDeviceNames: string[] = Array.from(deviceNamesSet);
  const usedDevices: Device[] = uniqueDeviceNames.map(
    (deviceName) => devices.find((device) => device.name == deviceName)!
  );

  // idle devices
  const idleDevices = devices.filter((device) => !usedDevices.includes(device));

  // network data
  const nodes = usedDevices.map((device) => {
    return { id: device.name, label: device.name };
  });
  const edges = connections.map((con) => {
    return { from: con.source_device_name, to: con.target_device_name };
  });
  const networkData = {
    nodes: nodes,
    edges: edges,
  };

  // network options
  // docs: https://visjs.github.io/vis-network/docs/network/index.html
  const networkOptions = {
    nodes: {
      color: "#d8fdff",
      shape: "dot",
      size: 25,
      font: {
        size: 18,
      },
    },
    edges: {
      color: "#777777",
      smooth: true,
      arrows: "to",
    },
    physics: false,
    layout: {
      hierarchical: {
        direction: "LR",
        sortMethod: "directed",
        levelSeparation: 250, //default: 150
        nodeSpacing: 150, //default: 100
      },
    },
  };

  console.log("devices", devices.length);
  console.log("devicesInUse", usedDevices.length);
  console.log("devicesNotInUse", idleDevices.length);
  console.log("connections", connections.length);
  console.log("nodes", nodes.length);
  console.log("edges", edges.length);

  return json({
    devices: devices,
    connections: connections,
    usedDevices: usedDevices,
    idleDevices: idleDevices,
    networkData: networkData,
    networkOptions: networkOptions,
  });
}

export default function Index() {
  const loaderData = useLoaderData<typeof loader>();
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const container = document.getElementById("mynetwork");
    if (container == null) {
      throw new Error("#mynetwork could not be found");
    }
    new Network(container, loaderData.networkData, loaderData.networkOptions);
  }, [loaderData.networkData, loaderData.networkOptions]);

  function addConnectionClick() {
    setDialogOpen(true);
  }

  function closeConnectionClick() {
    setDialogOpen(false);
  }

  return (
    <div className="root_container">
      {dialogOpen && <Dialog closeConnectionClick={closeConnectionClick} />}
      <div className="p-2 text-center text-2xl">Device Signal Chain</div>
      <div className="flex justify-center items-center p-2">
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => addConnectionClick()}
        >
          Add connection
        </button>
      </div>
      <div className="flex justify-center items-center network-container">
        <div id="mynetwork"></div>
      </div>
    </div>
  );
}
