import type { Technician } from "@/types/technician";

export const technicians: Technician[] = [
  {
    id: "tech-1",
    name: "Marcus Rivera",
    email: "marcus.r@salarium.local",
    phone: "(555) 201-4433",
    commissionRate: 0.5,
    active: true,
    hiredAt: "2022-03-15",
  },
  {
    id: "tech-2",
    name: "Diana Chen",
    email: "diana.c@salarium.local",
    phone: "(555) 304-8812",
    commissionRate: 0.75,
    active: true,
    hiredAt: "2021-07-01",
  },
  {
    id: "tech-3",
    name: "Jordan Wells",
    email: "jordan.w@salarium.local",
    phone: "(555) 412-6677",
    commissionRate: 0.5,
    active: true,
    hiredAt: "2023-01-10",
  },
  {
    id: "tech-4",
    name: "Priya Nair",
    email: "priya.n@salarium.local",
    phone: "(555) 519-2290",
    commissionRate: 0.75,
    active: false,
    hiredAt: "2020-11-20",
  },
];
