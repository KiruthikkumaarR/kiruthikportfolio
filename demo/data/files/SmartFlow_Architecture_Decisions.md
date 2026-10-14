# Architecture Decision Records - SmartFlow

## ADR-001: Message broker

- Status: Accepted
- Date: 2025-10-01
- Decision: Use MQTT with a Mosquitto cluster for pump telemetry.
- Decided by: Cezary Andrearczyk

## ADR-002: Time-series store

- Status: Accepted
- Date: 2025-10-31
- Decision: Use TimescaleDB instead of InfluxDB.
- Decided by: Veli Lehto

## ADR-003: Edge runtime

- Status: Accepted
- Date: 2025-11-30
- Decision: Run analytics on the CU-4 Pro using containerised Python.
- Decided by: Hugo Oberndorfer

## ADR-004: Authentication

- Status: Accepted
- Date: 2025-12-30
- Decision: Use OpenID Connect with the corporate identity provider.
- Decided by: Adèle Duhamel

## ADR-005: Data retention

- Status: Accepted
- Date: 2026-01-29
- Decision: Keep raw telemetry for 13 months and hourly aggregates for 7 years.
- Decided by: Jacqueline Marion

## ADR-006: Frontend

- Status: Accepted
- Date: 2026-02-28
- Decision: Build the customer portal in React with TypeScript.
- Decided by: Christiane Lebreton
