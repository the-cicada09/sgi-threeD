import { AeroplaneExplorer } from "@/components/model-viewer/AeroplaneExplorer";

// Same explorer as /aeroplane, just with the "inline" sidebar variant — lets
// the two part-info sidebar styles be compared side by side, on their own routes.
export default function AeroplaneInlineSidebarPage() {
  return <AeroplaneExplorer sidebarVariant="inline" />;
}
