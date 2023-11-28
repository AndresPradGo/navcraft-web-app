import { z } from "zod";


export const schema = z.object({
    departure_time: z.string(),
    bhp_percent: z
      .number({ invalid_type_error: "Enter a number" })
      .max(100, { message: "Must be less than 100" })
      .min(20, { message: "Must be greater than 20" }),
    added_enroute_time_hours: z
      .number({ invalid_type_error: "Enter a number" })
      .max(99.94, { message: "Must be less than 99.95" })
      .min(0, { message: "Must be greater than zero" }),
    contingency_fuel_hours: z
      .number({ invalid_type_error: "Enter a number" })
      .max(99.94, { message: "Must be less than 99.95" })
      .min(0, { message: "Must be greater than zero" }),
    reserve_fuel_hours: z
      .number({ invalid_type_error: "Enter a number" })
      .max(99.94, { message: "Must be less than 99.95" })
      .min(0, { message: "Must be greater than zero" }),
});

export type EditFlightData = z.infer<typeof schema>;