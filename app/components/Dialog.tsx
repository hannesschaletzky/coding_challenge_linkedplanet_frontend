import { Form } from "@remix-run/react";
import { DROPDOWN_INITAL_VALUE } from "~/IndexController";
import { Device, DialogSaveMode } from "~/Interfaces";

interface Props {
  closeDialogClick: () => void;
  idleDevices: Device[];
  usedDevices: Device[];
  usedTargetDevices: Device[];
  idleTargetDevices: Device[];
  onSourceChange: (e: string) => void;
  onTargetChange: (e: string) => void;
  source: string;
  target: string;
  dialogSaveMode: DialogSaveMode;
  targetKey: number;
}

export default function Dialog(props: Props) {
  return (
    <div className="absolute top-0 left-0 bottom-0 right-0 bg-slate-100 z-10 flex flex-col justify-center items-center opacity-95">
      <div>✅ = device already in use</div>
      <br />
      {/* SOURCE DEVICE */}
      <form className="">
        <label
          htmlFor="source_device"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Source
        </label>
        <select
          id="source_device"
          className="bg-gray-200 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          onChange={(e) => props.onSourceChange(e.target.value)}
        >
          <option defaultValue={DROPDOWN_INITAL_VALUE}>
            {DROPDOWN_INITAL_VALUE}
          </option>
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
      {props.usedTargetDevices.length + props.idleTargetDevices.length == 0 &&
        props.source != DROPDOWN_INITAL_VALUE && (
          <div>This device has no outgoing connections...</div>
        )}

      {/* TARGET DEVICE */}
      {props.usedTargetDevices.length + props.idleTargetDevices.length > 0 && (
        <form className="">
          <label
            htmlFor="target_device"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Target
          </label>
          <select
            id="target_device"
            className="bg-gray-200 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            onChange={(e) => props.onTargetChange(e.target.value)}
            key={props.targetKey} // Force re-render
          >
            <option defaultValue={DROPDOWN_INITAL_VALUE}>
              {DROPDOWN_INITAL_VALUE}
            </option>
            {props.usedTargetDevices.map((device) => (
              <option key={device.id} value={device.name}>
                ✅ {device.name}
              </option>
            ))}
            {props.idleTargetDevices.map((device) => (
              <option key={device.id} value={device.name}>
                {device.name}
              </option>
            ))}
          </select>
        </form>
      )}

      <br />

      {props.dialogSaveMode == DialogSaveMode.alreadyExists && (
        <div>This connection already exists...</div>
      )}
      {props.dialogSaveMode == DialogSaveMode.noErrors && (
        <Form method="post">
          <input name="source" value={props.source} hidden readOnly />
          <input name="target" value={props.target} hidden readOnly />

          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            type="submit"
          >
            Save
          </button>
        </Form>
      )}

      <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
        onClick={() => props.closeDialogClick()}
      >
        Close
      </button>
    </div>
  );
}
