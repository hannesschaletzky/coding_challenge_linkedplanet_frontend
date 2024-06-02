import { Connection, Device } from "./Interfaces";

export function assembleEdgesAndNodes(
  usedDevices: Device[],
  connections: Connection[]
) {
  const nodes = usedDevices.map((device) => {
    return { id: device.name, label: device.name };
  });
  const edges = connections.map((con) => {
    return {
      id: con.id,
      from: con.source_device_name,
      to: con.target_device_name,
    };
  });
  return {
    nodes: nodes,
    edges: edges,
  };
}

// docs: https://visjs.github.io/vis-network/docs/network/index.html
export function assembleNetworkProperties() {
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
  return networkOptions;
}
