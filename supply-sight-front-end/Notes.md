## Approach
1. React + Tailwind + Apollo Client with a small mock GraphQL server.
2. Built KPI cards, filters, product table, and drawer with update/transfer mutations.
3. Status logic: 🟢 Healthy, 🟡 Low, 🔴 Critical.

## Trade-offs
1. Mock backend only (no persistence).
2. Pagination are client-side.
3. Using browser alerts for mutation feedback.

## Improvements with More Time
1. Replace alerts with proper UI toasts.
2. Add server-side pagination.
3. Better drawer UX, charts, and error handling.