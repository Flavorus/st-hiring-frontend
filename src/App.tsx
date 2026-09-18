import { useState } from "react";
import { AppLayout, type AppPage } from "./components/layout/app-layout";
import { EventsPage } from "./pages/events-page";
import { SettingsPage } from "./pages/settings-page";

function App() {
  const [selectedPage, setSelectedPage] = useState<AppPage>("events");

  return (
    <AppLayout selectedPage={selectedPage} onPageChange={setSelectedPage}>
      {selectedPage === "events" ? <EventsPage /> : <SettingsPage />}
    </AppLayout>
  );
}

export default App;
