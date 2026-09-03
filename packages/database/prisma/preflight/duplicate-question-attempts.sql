-- READ-ONLY preflight. Run before applying the user-learning-isolation
-- migration (or any migration that creates this unique index).
-- If rows are returned, production data needs an approved remediation plan;
-- this query intentionally does not delete, update, or otherwise mutate data.
SELECT
  quiz_session_id,
  question_id,
  COUNT(*) AS duplicate_count
FROM question_attempts
GROUP BY quiz_session_id, question_id
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC, quiz_session_id, question_id;
