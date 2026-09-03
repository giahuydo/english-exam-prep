# Migration preflight

Before applying `20260830120000_user_learning_isolation`, run
`duplicate-question-attempts.sql` against the target database using a
read-only connection, for example:

```bash
psql "$DATABASE_URL" --file packages/database/prisma/preflight/duplicate-question-attempts.sql
```

Any returned rows would prevent the migration unique
`(quiz_session_id, question_id)` index from being created. This preflight is
read-only and provides no production-data remediation; investigate and obtain
an approved data plan before retrying.
