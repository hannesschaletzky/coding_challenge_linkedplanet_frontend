import { ActionFunctionArgs, json, type MetaFunction } from "@remix-run/node";
import { redirect, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Network } from "vis-network";
import { postConnection } from "~/BackendController";

import {
  determineTargetDevices,
  determineDeviceType,
  DROPDOWN_INITAL_VALUE,
  getDevices,
  getConnections,
  getDeviceTypeOutputs,
  filterUsedDevices,
  filterIdleDevices,
  postConnectionToIndex,
} from "~/IndexController";
import { Device, DialogSaveMode } from "~/Interfaces";
import {
  assembleEdgesAndNodes,
  assembleNetworkProperties,
} from "~/VisController";
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

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();
  const source = body.get("source");
  const target = body.get("target");
  console.log(source, "to", target);
  if (source != null && target != null) {
    await postConnection(source.toString(), target.toString());
  }
  return redirect(`/?index`);
}

export async function loader() {
  const devices = await getDevices();
  const connections = await getConnections();
  console.log("connections", connections.length);
  const deviceTypeOutputs = await getDeviceTypeOutputs();
  const usedDevices = filterUsedDevices(connections, devices);
  const idleDevices = filterIdleDevices(usedDevices, devices);

  const edgesAndNodes = assembleEdgesAndNodes(usedDevices, connections);
  const networkProperties = assembleNetworkProperties();

  return json({
    devices: devices,
    connections: connections,
    usedDevices: usedDevices,
    idleDevices: idleDevices,
    deviceTypeOutputs: deviceTypeOutputs,
    edgesAndNodes: edgesAndNodes,
    networkProperties: networkProperties,
  });
}

export default function Index() {
  const loaderData = useLoaderData<typeof loader>();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [source, setSource] = useState(DROPDOWN_INITAL_VALUE);
  const [target, setTarget] = useState(DROPDOWN_INITAL_VALUE);
  const [targetDevices, setTargetDevices] = useState<Device[]>([]);
  const [targetKey, setTargetKey] = useState(0); // force re-render of dialog, because same category lets react use the component with the previous selection
  const [dialogSaveMode, setDialogSaveMode] = useState(DialogSaveMode.initial);

  useEffect(() => {
    const container = document.getElementById("mynetwork");
    if (container == null) {
      throw new Error("#mynetwork could not be found");
    }
    const network = new Network(
      container,
      loaderData.edgesAndNodes,
      loaderData.networkProperties
    );
    return () => {
      network.destroy(); // Clean up the network instance on unmount
    };
  }, [loaderData.edgesAndNodes, loaderData.networkProperties]);

  useEffect(() => {
    if (source == DROPDOWN_INITAL_VALUE) {
      setTargetDevices([]);
    } else {
      const deviceType = determineDeviceType(source, loaderData.devices);
      if (deviceType == undefined) {
        throw new Error(`Could not determine device type of ${source}`);
      }
      const newTargetDevices = determineTargetDevices(
        deviceType,
        loaderData.deviceTypeOutputs,
        loaderData.devices
      );
      setTargetDevices(newTargetDevices);
      setTarget(DROPDOWN_INITAL_VALUE);
      setTargetKey((prevKey) => prevKey + 1);
    }
  }, [loaderData.deviceTypeOutputs, loaderData.devices, source]);

  useEffect(() => {
    if (source != DROPDOWN_INITAL_VALUE && target != DROPDOWN_INITAL_VALUE) {
      if (
        loaderData.connections.filter(
          (connection) =>
            connection.source_device_name == source &&
            connection.target_device_name == target
        ).length == 1
      ) {
        setDialogSaveMode(DialogSaveMode.alreadyExists);
      } else {
        setDialogSaveMode(DialogSaveMode.noErrors);
      }
    } else if (target == DROPDOWN_INITAL_VALUE) {
      setDialogSaveMode(DialogSaveMode.initial);
    }
  }, [loaderData.connections, source, target]);

  function addConnectionClick() {
    setDialogOpen(true);
  }

  function closeDialogClick() {
    setDialogOpen(false);
    setSource(DROPDOWN_INITAL_VALUE);
    setDialogSaveMode(DialogSaveMode.initial);
  }

  function saveClick() {
    postConnectionToIndex(source, target);
    closeDialogClick();
  }

  return (
    <div className="root_container">
      {dialogOpen && (
        <Dialog
          closeDialogClick={closeDialogClick}
          saveClick={saveClick}
          idleDevices={loaderData.idleDevices}
          usedDevices={loaderData.usedDevices}
          onSourceChange={setSource}
          onTargetChange={setTarget}
          targetDevices={targetDevices}
          source={source}
          dialogSaveMode={dialogSaveMode}
          targetKey={targetKey}
        />
      )}
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
