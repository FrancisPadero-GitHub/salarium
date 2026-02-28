import type { Technician } from "@/types/technician";

/**
 * Real technicians sourced from individual spreadsheets.
 * Commission rates confirmed via DAILY GROSS & NET spreadsheet:
 *   - 50% rate: Tamir, Yotam  (columns labeled "Net (50%)")
 *   - 75% rate: Shalom, Aviran, Sub  (columns labeled "Net (75%)")
 */
export const technicians: Technician[] = [
  {
    id: "tech-tamir",
    name: "Tamir",
    email: "tamir@salarium.local",
    commission: 50,
    active: true,
    hiredAt: "2024-01-01",
  },
  {
    id: "tech-yotam",
    name: "Yotam",
    email: "yotam@salarium.local",
    commission: 50,
    active: true,
    hiredAt: "2024-01-01",
  },
  {
    id: "tech-shalom",
    name: "Shalom",
    email: "shalom@salarium.local",
    commission: 75,
    active: true,
    hiredAt: "2024-01-01",
  },
  {
    id: "tech-aviran",
    name: "Aviran",
    email: "aviran@salarium.local",
    commission: 75,
    active: true,
    hiredAt: "2024-06-01",
  },
  {
    id: "tech-sub",
    name: "3 Bros (Sub)",
    email: "sub@salarium.local",
    commission: 75,
    active: true,
    hiredAt: "2024-01-01",
  },
];
