// Booking day/time selection — pure logic (spec 2026-07-03-office-live-handoff-design.md
// §3/§9). Nate's "draw an X on the day, then an X on the time" is realised as tap-to-select
// day/time cells that render an X-mark on selection — not freehand stroke recognition
// (chosen: same visual outcome, far more reliable on VR controllers/hand-tracking).

export interface BookingSelection {
  dayId: string | null;
  timeId: string | null;
  confirmed: boolean;
}

export function emptyBookingSelection(): BookingSelection {
  return { dayId: null, timeId: null, confirmed: false };
}

export function selectDay(selection: BookingSelection, dayId: string): BookingSelection {
  return { dayId, timeId: null, confirmed: false };
}

export function selectTime(selection: BookingSelection, timeId: string): BookingSelection {
  if (selection.dayId === null) throw new Error("bookingSelection: pick a day before a time");
  return { ...selection, timeId, confirmed: false };
}

export function confirmBooking(selection: BookingSelection): BookingSelection {
  if (selection.dayId === null || selection.timeId === null) {
    throw new Error("bookingSelection: day and time must be selected before confirming");
  }
  return { ...selection, confirmed: true };
}
