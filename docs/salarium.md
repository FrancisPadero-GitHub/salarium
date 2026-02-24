# Salarium: Field Service Financial Orchestration System

## Project Overview

Salarium is a specialized full stack financial management and operational dashboard built for a Florida-based field service business (chimney cleaning, HVAC duct cleaning, dryer vent cleaning, UV light systems, and related services). It centralizes job reporting, automates commission calculations, and provides real time business intelligence.

The system replaces fragmented Google Sheets workflows — one spreadsheet per technician, separate daily gross/net sheets, a separate estimate log — with a secure, database driven architecture that ensures financial accuracy, protects calculation logic, and reduces administrative overhead.

---

## The Problem (Real Workflow Being Replaced)

The business currently operates with these separate spreadsheets:

| Spreadsheet              | Purpose                                         |
| ------------------------ | ----------------------------------------------- |
| TAMIR SPREADSHEET        | Individual job log for Tamir                    |
| YOTAM SPREADSHEET        | Individual job log for Yotam                    |
| SHALOM SPREADSHEET       | Individual job log for Shalom                   |
| AVIRAN SPREADSHEET       | Individual job log for Aviran                   |
| 3 BROS / SUB SPREADSHEET | Jobs run by the subcontractor pool              |
| DAILY ESTIMATES          | Estimate pipeline (all techs)                   |
| DAILY GROSS & NET        | Daily revenue totals per tech (50% / 75% split) |
| DAILY PROFIT AND LOSS    | Daily P&L summary with balances                 |
| ORLANDOJOBS              | Orlando-market job log                          |

### Per-Technician Sheet Columns

Each individual sheet captures: `Date · Address · Parts · Tip · Review · Subtotal · Total · Mode of Payment · Notes`

### DAILY GROSS & NET Sheet

Tracks each tech's daily gross and their commission cut side-by-side:

- **Tamir & Yotam** — `Net (50%)`: tech earns 50%, business keeps 50%
- **Shalom & Aviran** — `Net (75%)`: tech earns 75%, business keeps 25%

### DAILY ESTIMATES Sheet

Captures: `Date · Address · Estimate Description · Amount · Tech · Status · Notes · Handled By`

---

## The Salarium Solution

Salarium consolidates all of the above into a unified web application.

All financial calculations are executed at the database and server levels. Revenue totals, commission splits, and year-to-date metrics are automatically generated and updated when a job is recorded. This guarantees mathematical integrity and removes dependency on manual spreadsheet formulas.

---

## Core Features

### 1. Centralized Job Logging

- Unified job entry interface (replaces per-tech sheets)
- Fields: Date, Address, Technician, Parts, Tips, Subtotal, Gross, Payment Method, Status, Notes
- `Gross = Subtotal + Parts + Tips`

### 2. Secure Commission Calculations

- Commission rates stored per technician (50% or 75%)
- `commissionAmount = gross × commissionRate` (tech's earnings)
- `net = gross − commissionAmount` (business's share)
- Calculations enforced server-side / at database level

### 3. Dynamic Financial Dashboards

Real-time aggregation of: Daily Gross, Daily Net, Monthly performance, Year-to-Date revenue. No manual totals.

### 4. Estimate Pipeline Management

- Full estimate tracking from creation through approval / rejection / conversion
- Fields: Date, Address, Description, Amount, Tech, Status, Handled By, Notes
- One-click conversion of approved estimates into active jobs

### 5. Technician Management

- Centralized directory of active technicians
- Configurable commission rates
- Per-technician job history and earnings stats

---

## Technician Roster

| Name         | ID          | Commission Rate | Notes                             |
| ------------ | ----------- | --------------- | --------------------------------- |
| Tamir        | tech-tamir  | 50%             | Primary tech — chimney & HVAC     |
| Yotam        | tech-yotam  | 50%             | Primary tech — HVAC & dryer vents |
| Shalom       | tech-shalom | 75%             | Primary tech — chimney & HVAC     |
| Aviran       | tech-aviran | 75%             | Tech — dryer vents & HVAC         |
| 3 Bros (Sub) | tech-sub    | 75%             | Subcontractor pool                |

---

## Service Area & Job Types

**Geography**: Tampa Bay area and Central Florida (Tampa, Clearwater, Sarasota, Brandon, Wesley Chapel, Englewood, Winter Park, Seminole, and surrounding areas).

**Services**:

- Chimney deep cleaning, cap replacement, crown repair, liner installation, rebuild
- HVAC / air duct deep cleaning and sanitation
- UV light system installation
- Duct coating and sealing
- Dryer vent cleaning, rerouting, pipe replacement
- New vent / chase installation

---

## Real February 2026 Metrics (from DAILY GROSS & NET)

| Date        | Team Gross  | Team Net (to business) |
| ----------- | ----------- | ---------------------- |
| 2/16        | $4,948.52   | $1,642.13              |
| 2/17        | $3,860.00   | $1,636.00              |
| 2/18        | $5,115.00   | $2,198.25              |
| 2/19        | $7,529.00   | $2,163.50              |
| 2/20        | $3,600.35   | $1,212.10              |
| 2/22        | $952.00     | $288.00                |
| **Feb MTD** | **$92,968** | **$34,228**            |

---

## Technical Architecture

### Frontend

- React 19 + Next.js 16 App Router (TypeScript, Server Components)
- Tailwind CSS v4, shadcn/ui (new-york style, zinc base)

### Backend and Database

- Supabase + PostgreSQL
- Database-level protections: `GENERATED ALWAYS AS STORED` columns, triggers for financial consistency
- Server-enforced commission calculations (no client-side math trusted)

---

## Future Roadmap

### Role Based Access Control

- Administrator: full financial dashboard
- Technician login: own jobs and commissions only

### Orlando Market Expansion

- Separate market view for the Orlando job pool (currently tracked in ORLANDOJOBS sheet)

### Data Exporting

- CSV exports for accounting
- PDF generation for reporting and tax documentation

### Missing Data Backfill

- Import historical spreadsheet data into Supabase for full YTD accuracy
