# sivmih

## Entities
- **DesignPattern** — id, name(string), category(string), isCreational(boolean), year(number), authors(array), createdAt(Date)
- **CodeExample** — id, patternId(string), language(string), lines(number), isWorking(boolean), tags(array), createdAt(Date)

## JSON Data
- `patterns.json`
- `examples.json`

## Routes

### Patterns
- GET /patterns — all patterns
- GET /patterns/:id — pattern by id
- POST /patterns — create pattern (body optional, random generated if empty)
- PUT /patterns/:id — update entire pattern
- PATCH /patterns/:id — update part of pattern
- DELETE /patterns/:id — delete pattern

### Examples
- GET /examples — all examples
- GET /examples/:id — example by id
- POST /examples — create example (body optional, random generated if empty)
- PUT /examples/:id — update entire example
- PATCH /examples/:id — update part of example
- DELETE /examples/:id — delete example

## Error Handling
- 404 for not found routes / ids
- 500 for server errors
