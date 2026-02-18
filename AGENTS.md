# AGENTS

## Codex Review Contract (Strict v2)

### 1. Scope
- Review target is PR diff only.
- If a risk exists outside diff, mark it as out-of-scope risk.
- Do not claim verification for code not present in diff.

### 2. Priority Rule
- Report all priorities: P0, P1, P2, P3.
- Each finding must include risk score (1-10).

### 3. Mandatory Categories
- Security
- Correctness / Data integrity
- Error handling
- Performance
- Maintainability
- Test coverage
- Logging / observability
- Architecture consistency

### 4. Evidence Rule
- Every finding must include:
  - file path
  - line number
  - short code snippet
- If evidence is weak, mark as possible false positive.

### 5. Fix Proposal Rule
- Every finding must include:
  - what is wrong
  - impact
  - minimal fix approach
  - suggested fixed code snippet or pseudo patch

### 6. Scorecard (10-point)
- Security: X/10
- Correctness: X/10
- Performance: X/10
- Reliability: X/10
- Maintainability: X/10
- Test Coverage: X/10
- Overall: X/10
- Add 1-3 deduction reasons per score.

### 7. Output Order
1. Findings (high to low risk)
2. Open questions / assumptions
3. Scorecard
4. Top 5 fix priorities

### 8. Deduplication
- Merge duplicate findings into one root-cause item.

### 9. AI-generated Code Focus
- For Jules/Copilot generated code, prioritize checks for:
  - TODO or placeholder logic in runtime path
  - weak input validation
  - broad exception swallowing
  - missing authorization checks
  - insecure defaults
  - generated code not used by runtime

### 10. Language
- Respond in Japanese.
- Keep output concrete and technical.
