# config

The only place environment variables are read directly (Phase 1 §7/§9 Rule 9). One file per concern: `app.config.ts` (this milestone), with `database.config.ts`, `storage.config.ts`, `payment.config.ts`, `auth.config.ts`, and `mail.config.ts` added as each concern is introduced. Every config file exposes a typed, validated object — the app fails fast at boot if a required variable is missing.
