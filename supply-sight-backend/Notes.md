## Decisions & Trade-offs
1. Chose Apollo Server for the mock GraphQL backend since it’s quick to set up and easy to seed with sample data.
2. Kept the schema simple (Products + queries/mutations) to match the task requirements & to implement it quickly.
3. Used in-memory storage for products so data resets on restart but good enough for a mock API.

## What Could Be Improved
1. Add persistence (SQLite or a JSON file) so data survives server restarts.
2. More validation around mutations (e.g. preventing negative stock transfers).
3. Expand test coverage. Currently, the focus was speed of delivery over testing.