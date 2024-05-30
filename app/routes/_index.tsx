import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Device Signal Chain" },
    {
      name: "An overview of your event broadcasting",
      content: "Welcome to the app!",
    },
  ];
};

export default function Index() {
  return <div className="bg-red-500">Hallo</div>;
}
