interface Props {
  closeConnectionClick: () => void;
}

export default function Dialog(props: Props) {
  return (
    <div className="absolute top-0 left-0 bottom-0 right-0 bg-slate-100 z-10 flex flex-col justify-center items-center opacity-90">
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
        >
          <option defaultValue="Choose...">Choose...</option>
          <option value="US">United States</option>
          <option value="CA">Canada</option>
          <option value="FR">France</option>
          <option value="DE">Germany</option>
        </select>
      </form>
      <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
        onClick={() => props.closeConnectionClick()}
      >
        Close
      </button>
    </div>
  );
}
