/* eslint-disable jsx-a11y/heading-has-content */

import { json, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import { Network } from "vis-network";
import { fetchConnections, fetchDevices } from "~/BackendController";
import { Device, Connection } from "~/Interfaces";

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
  const raw_connections = await fetchConnections();

  const devices: Device[] = [];
  for (const raw_device of raw_devices) {
    const device: Device = {
      id: raw_device.id,
      name: raw_device.name,
      device_type_name: raw_device.device_type_name,
    };
    devices.push(device);
  }

  const connections: Connection[] = [];
  for (const raw_connection of raw_connections) {
    const connection: Connection = {
      id: raw_connection.id,
      source_device_name: raw_connection.source_device_name,
      target_device_name: raw_connection.target_device_name,
    };
    connections.push(connection);
  }

  return json({
    devices: devices,
    connections: connections,
  });
}

export default function Index() {
  const loaderData = useLoaderData<typeof loader>();
  console.log("devices:", loaderData.devices.length);
  console.log("connections:", loaderData.connections.length);

  useEffect(() => {
    const nodes = [
      { id: 0, label: "0" },
      { id: 1, label: "1" },
      { id: 2, label: "2" },
      { id: 3, label: "3" },
      { id: 4, label: "4" },
      { id: 5, label: "5" },
      { id: 6, label: "6" },
    ];

    const edges = [
      { from: 0, to: 4 },
      { from: 1, to: 4 },
      { from: 2, to: 4 },
      { from: 3, to: 5 },
      { from: 4, to: 6 },
      { from: 5, to: 6 },
    ];

    const container = document.getElementById("mynetwork");
    if (container == null) {
      throw new Error("#mynetwork could not be found");
    }
    const data = {
      nodes: nodes,
      edges: edges,
    };
    // see options here: https://visjs.github.io/vis-network/docs/network/index.html
    const options = {
      nodes: {
        shape: "dot",
        size: 20,
      },
      edges: {
        arrows: "to",
      },
      physics: false,
      layout: {
        hierarchical: {
          direction: "LR",
          sortMethod: "directed",
          levelSeparation: 200, //default: 150
        },
      },
    };
    new Network(container, data, options);
  }, []);

  return (
    <>
      <h1 className="bg-slate-400 text-center">Device Signal Chain</h1>
      <div className="flex justify-center items-center">
        <div id="mynetwork"></div>
        <h2 id="eventSpanHeading"></h2>
        <pre id="eventSpanContent"></pre>
      </div>
    </>
  );
}
