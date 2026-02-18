# AGENTS

<!-- CODEX_SCORECARD_POLICY_START -->
## Codex Scorecard Review Policy
When requesting Codex pull request reviews, require this output format.

1. Findings (sorted by severity high to low)
- Include all priority levels: P0, P1, P2, P3.
- For each finding include:
  - Risk score: 1-10
  - Problem summary
  - What is wrong
  - Impact
  - Recommended fix
  - Relevant code snippet
  - Suggested fixed code snippet
- If a finding may be a false positive, state that clearly.

2. Scorecard (10-point scale)
- Security: X/10
- Correctness: X/10
- Performance: X/10
- Reliability: X/10
- Maintainability: X/10
- Test Coverage: X/10
- Overall: X/10

3. Scoring rationale
- Provide 1-3 short reasons for each score deduction.

4. Top 5 fix priorities
- List the five most important fixes in strict priority order.
<!-- CODEX_SCORECARD_POLICY_END -->
