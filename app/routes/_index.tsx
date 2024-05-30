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
      name: "An overview of your event broadcast",
      content: "🏐",
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
  console.log("connections:", loaderData.connections);

  useEffect(() => {
    const allConnectionDeviceNames: string[] = loaderData.connections.flatMap(
      (connection) => [
        connection.source_device_name,
        connection.target_device_name,
      ]
    );
    const uniqueDeviceNamesSet: Set<string> = new Set(allConnectionDeviceNames);
    const uniqueDeviceNames: string[] = Array.from(uniqueDeviceNamesSet);

    const nodes = uniqueDeviceNames.map((device) => {
      return { id: device, label: device };
    });

    const edges = loaderData.connections.map((con) => {
      return { from: con.source_device_name, to: con.target_device_name };
    });

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

    new Network(container, data, options);
  }, [loaderData.connections]);

  return (
    <>
      <div className="p-2 text-center text-2xl bg-[#d8fdff]">
        Device Signal Chain
      </div>
      <div className="flex justify-center items-center">
        <div id="mynetwork"></div>
        <h2 id="eventSpanHeading"></h2>
        <pre id="eventSpanContent"></pre>
      </div>
    </>
  );
}
