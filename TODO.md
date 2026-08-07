# Task: Enhance Student Profile/Detail Page

## Steps

- [x] Inspect backend student model/controller/routes, DB schema, and frontend student pages
- [x] Confirm plan with user

### Implementation
- [x] Backend: modify `backend/src/models/studentModel.js` `getStudent()` to LEFT JOIN schools and return `school` name
- [x] Frontend: expand `Student` interface with all real fields in `[id]/page.tsx`
- [x] Frontend: add Back to Students button at top
- [x] Frontend: organize info into Personal / Education / Guardian / Medical cards (existing design)
- [x] Frontend: add loading, not-found (with Back), and error states

### Follow-up
- [x] Run `npx tsc --noEmit` in `frontend/` and fix only related errors
- [ ] Verify list page, edit navigation, back navigation, real API data, mobile layout
</content>

