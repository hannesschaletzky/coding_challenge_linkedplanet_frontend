export async function fetchDevices() {
  const response = await fetch("http://localhost:3000/devices");
  if (!response.ok) {
    console.log("ERROR:", response);
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const body = await response.json();
  return body;
}
