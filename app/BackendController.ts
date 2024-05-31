export async function fetchDevices() {
  return await fetchFrom("http://localhost:3000/devices");
}

export async function fetchConnections() {
  return await fetchFrom("http://localhost:3000/connections");
}

export async function fetchDeviceTypeOutputs() {
  return await fetchFrom("http://localhost:3000/device_type_outputs");
}

async function fetchFrom(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.log("ERROR:", response);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const body = await response.json();
    return body;
  } catch (e) {
    console.log("EXCEPTION:", e);
  }
}
