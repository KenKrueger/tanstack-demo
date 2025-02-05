import { useRouterState } from "@tanstack/react-router";
import React from "react";

function RouteChangeAnnouncer() {
  const currentLocation = useRouterState();
  const [announcement, setAnnouncement] = React.useState("");

  React.useEffect(() => {
    const routeName = getRouteName(currentLocation.location.pathname);
    setAnnouncement(`Navigated to ${routeName}`);
  }, [currentLocation]);

  return (
    <div aria-live="polite" style={{ position: "absolute", left: "-9999px" }}>
      {announcement}
    </div>
  );
}
