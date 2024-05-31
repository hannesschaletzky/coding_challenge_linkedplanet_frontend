import { Device } from "~/Interfaces";

interface Props {
  closeConnectionClick: () => void;
  idleDevices: Device[];
  usedDevices: Device[];
}

export default function Dialog(props: Props) {
  function onSourceChange(e: string) {
    console.log(e);
  }

  return (
    <div className="absolute top-0 left-0 bottom-0 right-0 bg-slate-100 z-10 flex flex-col justify-center items-center opacity-90">
      {/* SOURCE DEVICE */}
      <form className="">
        <label
          htmlFor="source_device"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Source device
        </label>
        <select
          id="source_device"
          className="bg-gray-200 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          onChange={(e) => onSourceChange(e.target.value)}
        >
          <option defaultValue="Choose...">Choose...</option>
          {props.usedDevices.map((device) => (
            <option key={device.id} value={device.name}>
              ✅ {device.name}
            </option>
          ))}
          {props.idleDevices.map((device) => (
            <option key={device.id} value={device.name}>
              {device.name}
            </option>
          ))}
        </select>
      </form>

      <br />
      {/* TARGET DEVICE */}
      <form className="">
        <label
          htmlFor="target_device"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Target device
        </label>
        <select
          id="target_device"
          className="bg-gray-200 text-gray-900 text-sm rounded-lg block w-full p-2.5"
        >
          <option defaultValue="Choose...">Choose...</option>
          {props.usedDevices.map((device) => (
            <option key={device.id} value={device.name}>
              ✅ {device.name}
            </option>
          ))}
          {props.idleDevices.map((device) => (
            <option key={device.id} value={device.name}>
              {device.name}
            </option>
          ))}
        </select>
      </form>

      <br />
      <div>✅ = device is already installed</div>
      <br />
      <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
        onClick={() => props.closeConnectionClick()}
      >
        Close
      </button>
    </div>
  );
}
