import { describe, it, expect } from "vitest";
import {
  emptyBookingSelection,
  selectDay,
  selectTime,
  confirmBooking,
} from "./bookingSelection";

describe("bookingSelection", () => {
  it("starts with nothing selected", () => {
    expect(emptyBookingSelection()).toEqual({ dayId: null, timeId: null, confirmed: false });
  });

  it("selecting a day sets dayId and clears any prior time/confirmation", () => {
    const selection = selectDay(emptyBookingSelection(), "2026-07-05");
    expect(selection).toEqual({ dayId: "2026-07-05", timeId: null, confirmed: false });
  });

  it("changing the day after a time was picked clears the time", () => {
    let selection = selectDay(emptyBookingSelection(), "2026-07-05");
    selection = selectTime(selection, "14:00");
    selection = selectDay(selection, "2026-07-06");
    expect(selection).toEqual({ dayId: "2026-07-06", timeId: null, confirmed: false });
  });

  it("selecting a time without a day first throws", () => {
    expect(() => selectTime(emptyBookingSelection(), "14:00")).toThrow(
      "bookingSelection: pick a day before a time",
    );
  });

  it("selecting a time after a day sets timeId", () => {
    const selection = selectTime(selectDay(emptyBookingSelection(), "2026-07-05"), "14:00");
    expect(selection).toEqual({ dayId: "2026-07-05", timeId: "14:00", confirmed: false });
  });

  it("confirming without both day and time throws", () => {
    expect(() => confirmBooking(selectDay(emptyBookingSelection(), "2026-07-05"))).toThrow(
      "bookingSelection: day and time must be selected before confirming",
    );
  });

  it("confirming with both day and time sets confirmed", () => {
    const selection = confirmBooking(selectTime(selectDay(emptyBookingSelection(), "2026-07-05"), "14:00"));
    expect(selection).toEqual({ dayId: "2026-07-05", timeId: "14:00", confirmed: true });
  });
});
