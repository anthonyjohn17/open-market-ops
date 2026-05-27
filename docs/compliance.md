# Data source compliance

OpportunityOS connectors must respect site terms, robots.txt, and applicable law. This document tracks per-source posture.

| Connector | MVP status | Notes |
|-----------|------------|-------|
| `indeed` | Mock + stub live | Use official publisher/API programs before production scrape |
| `career_page` | Mock + allowlist | Only fetch URLs you own or have permission to access |
| `linkedin_jobs` | Stub | Official LinkedIn API or licensed data only — no ToS-violating scrape |

**Development:** set `MOCK_FEEDS=true` to use `datasets/hiring-signals/sample-raw-items.json`.

Contributors: add a row here before shipping a new connector.
