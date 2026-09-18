import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { Event } from "./events.types";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const formattedDate = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(event.date));

  return (
    <Card
      variant="outlined"
      sx={{ height: "100%", display: "flex" }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
        }}
      >
        <Typography variant="h6" component="h2">
          {event.name}
        </Typography>

        <Stack spacing={0.5} sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {formattedDate}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {event.location ?? "Location to be announced"}
          </Typography>
        </Stack>

        <Typography variant="body1" sx={{ mt: 2 }}>
          {event.description}
        </Typography>

        <Box sx={{ mt: "auto", pt: 2 }}>
          <Chip
            label={`${event.availableTickets.length} tickets available`}
            color={event.availableTickets.length > 0 ? "success" : "default"}
            size="small"
          />
        </Box>
      </CardContent>
    </Card>
  );
}
