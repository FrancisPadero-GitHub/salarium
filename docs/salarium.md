# Salarium: Field Service Financial Orchestration System

## Project Overview

Salarium is a specialized full stack financial management and operational dashboard built for field service businesses. It centralizes job reporting, automates commission calculations, and provides real time business intelligence.

The system replaces fragmented spreadsheet workflows with a secure, database driven architecture that ensures financial accuracy, protects calculation logic, and reduces administrative overhead.

---

## The Problem

Field service businesses often rely on:

- Separate spreadsheets per technician
- Disconnected estimate logs
- Manual daily gross and net calculations
- Manually updated year to date revenue tracking
- Hand computed commission splits

This approach creates:

- High risk of human error
- Vulnerability to client side data manipulation
- Inconsistent reporting
- Time intensive reconciliation of tips, parts, subtotals, and commissions

---

## The Salarium Solution

Salarium consolidates all financial and operational data into a unified web application.

All financial calculations are executed at the database and server levels. Revenue totals, commission splits, and year to date metrics are automatically generated and updated when a job is recorded. This guarantees mathematical integrity and removes dependency on frontend logic.

---

## Core Features

### 1. Centralized Job Logging

- Unified job entry interface
- Capture of:
  - Date
  - Address
  - Assigned technician
  - Parts costs
  - Tips
  - Subtotals
  - Payment method (Cash, Check, Credit Card, Zelle)

---

### 2. Secure Server Side Calculations

- Commission splits such as 50 percent and 75 percent handled in the database
- Automatic summation of:
  - Subtotal
  - Parts
  - Tips
- Implemented using PostgreSQL constraints and computed columns
- Protection against client side manipulation

---

### 3. Dynamic Financial Dashboards

Real time aggregation of:

- Daily Gross
- Daily Net
- Monthly performance
- Year to Date revenue

All metrics update instantly when job data changes. No manual formulas required.

---

### 4. Estimate Pipeline Management

- Dedicated module for tracking job estimates
- Visibility into pending proposals
- Seamless conversion of approved estimates into active jobs

---

### 5. Technician Management

- Centralized technician directory
- Configurable commission rates per technician
- Automatic commission mapping to completed jobs

---

## Technical Architecture

### Frontend

- React
- Next.js
- TypeScript

Ensures type safe financial models and scalable component structure.

### UI and Design

- Tailwind CSS
- shadcn/ui

Provides clean, responsive, and accessible interfaces optimized for fast administrative data entry.

### Backend and Database

- Supabase
- PostgreSQL

Database level protections include:

- `GENERATED ALWAYS AS STORED` columns
- Triggers for financial consistency
- Server enforced calculation logic

The database acts as the single source of truth.

---

## Future Roadmap

### Role Based Access Control

- Administrator access to full financial dashboard
- Technician level login
- Restricted visibility to assigned jobs and earned commissions

### Data Exporting

- CSV exports for accounting
- PDF generation for reporting and tax documentation

---

## Summary

Salarium transforms fragmented spreadsheet workflows into a secure, automated financial orchestration system. By enforcing all mathematical logic at the database level and centralizing operations in a single platform, it delivers accuracy, transparency, and operational efficiency for field service businesses.
