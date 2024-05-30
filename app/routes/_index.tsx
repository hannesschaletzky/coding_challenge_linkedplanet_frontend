/* eslint-disable jsx-a11y/heading-has-content */

import { json, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import { Network } from "vis-network";
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
  console.log("device-count:", loaderData.devices.length);

  useEffect(() => {
    // create an array with nodes
    const nodes = [
      { id: 1, label: "Node 1" },
      { id: 2, label: "Node 2" },
      {
        id: 3,
        label: "Node 3:\nLeft-Aligned",
        font: { face: "Monospace", align: "left" },
      },
      { id: 4, label: "Node 4" },
      {
        id: 5,
        label: "Node 5\nLeft-Aligned box",
        shape: "box",
        font: { face: "Monospace", align: "left" },
      },
    ];

    // create an array with edges
    const edges = [
      { from: 1, to: 2, label: "middle", font: { align: "middle" } },
      { from: 1, to: 3, label: "top", font: { align: "top" } },
      { from: 2, to: 4, label: "horizontal", font: { align: "horizontal" } },
      { from: 2, to: 5, label: "bottom", font: { align: "bottom" } },
    ];

    // create a network
    const container = document.getElementById("mynetwork");
    if (container == null) {
      throw new Error("#mynetwork could not be found");
    }
    const data = {
      nodes: nodes,
      edges: edges,
    };
    const options = { physics: false };
    const network = new Network(container, data, options);

    network.on("click", function (params: { event: string }) {
      params.event = "[original event]";
      document.getElementById("eventSpanHeading")!.innerText = "Click event:";
      document.getElementById("eventSpanContent")!.innerText = JSON.stringify(
        params,
        null,
        4
      );
    });
  }, []);

  return (
    <>
      <h1 className="bg-slate-300 text-center">Network</h1>
      <div className="flex justify-center items-center">
        <div id="mynetwork"></div>
        <h2 id="eventSpanHeading"></h2>
        <pre id="eventSpanContent"></pre>
      </div>
    </>
  );
}
