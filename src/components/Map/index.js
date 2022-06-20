import dynamic from "next/dynamic";

const Map = dynamic(() => import("./Map"), { ssr: false });
const MapEffect = dynamic(() => import("./MapEffect"), { ssr: false });

export default Map;
export { MapEffect };
