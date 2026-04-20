═══════════════════════════════════════════════════════════════════════════════
EDTA PROJECT — OFFICE MANAGEMENT CRUD SYSTEM (COMPLETE)
═══════════════════════════════════════════════════════════════════════════════

✓ ALL COMPONENTS CREATED AND MIGRATED

═══════════════════════════════════════════════════════════════════════════════

MIGRATION STATUS
─────────────────────────────────────────────────────────────────────────────

File: database/migrations/2026_04_20_000000_create_offices_table.php
Status: ✓ MIGRATED (Batch 2, Ran)

Schema:
  - id (auto increment)
  - name (string, required)
  - code (string, required, unique)
  - created_by (foreign key to users.id, cascade on delete)
  - soft_deletes
  - timestamps (created_at, updated_at)

═══════════════════════════════════════════════════════════════════════════════

DATABASE MODEL
─────────────────────────────────────────────────────────────────────────────

File: app/Models/Office.php

Relationships:
  - createdBy() → BelongsTo User
  - Has auto-fill boot() method: sets created_by to Auth::id() on create

Attributes:
  - fillable: name, code, created_by
  - uses SoftDeletes for recovery capability

═══════════════════════════════════════════════════════════════════════════════

CONTROLLER
─────────────────────────────────────────────────────────────────────────────

File: app/Http/Controllers/OfficeController.php

Methods:

1. index(Request $request)
   - GET /settings/offices
   - Displays paginated office list (50 per page)
   - Supports search by name or code
   - Returns Inertia view 'settings/offices/index'

2. store(Request $request)
   - POST /settings/offices
   - Validates: name (required, unique), code (required, unique)
   - Creates new office with authenticated user as created_by
   - Returns success message

3. update(Request $request, Office $office)
   - PUT /settings/offices/{office}
   - Validates name & code (unique except current office)
   - Updates office details
   - Returns success message

4. destroy(Request $request, Office $office)
   - DELETE /settings/offices/{office}
   - Soft-deletes office
   - Returns success message

═══════════════════════════════════════════════════════════════════════════════

ROUTES
─────────────────────────────────────────────────────────────────────────────

File: routes/offices.php

Middleware: auth, verified, check-account-active

Endpoints:
  GET    /settings/offices              → OfficeController@index
  POST   /settings/offices              → OfficeController@store
  PUT    /settings/offices/{office}    → OfficeController@update
  DELETE /settings/offices/{office}    → OfficeController@destroy

Route names:
  offices.index
  offices.store
  offices.update
  offices.destroy

═══════════════════════════════════════════════════════════════════════════════

TYPESCRIPT TYPES
─────────────────────────────────────────────────────────────────────────────

File: resources/js/types/office.d.ts

export type Office = {
    id: number;
    name: string;
    code: string;
    created_at: string;
    updated_at: string;
};

export type OfficeCreateRequest = {
    name: string;
    code: string;
};

═══════════════════════════════════════════════════════════════════════════════

UI COMPONENTS (INERTIA REACT)
─────────────────────────────────────────────────────────────────────────────

1. INDEX PAGE: resources/js/pages/settings/offices/index.tsx
   ✓ Breadcrumb navigation
   ✓ Heading with description
   ✓ Create Office button (opens dialog)
   ✓ Search input (Enter key to search)
   ✓ Responsive table layout
   ✓ Table columns: Name, Code, Actions
   ✓ Edit/Delete buttons with icons (green edit, red delete)
   ✓ Pagination component
   ✓ No data message when empty
   ✓ Dialog management with local state

2. CREATE DIALOG: resources/js/pages/settings/offices/create.tsx
   ✓ Modal dialog form
   ✓ Field: Name (placeholder: "e.g. Office of the Municipal Mayor")
   ✓ Field: Code (placeholder: "e.g. MO")
   ✓ Error display for each field
   ✓ Cancel & Create buttons
   ✓ Toast notification on success
   ✓ Auto-close and reset on success
   ✓ Processing state on button

3. EDIT DIALOG: resources/js/pages/settings/offices/edit.tsx
   ✓ Modal dialog form
   ✓ Pre-populated with office data (name, code)
   ✓ Field validation errors
   ✓ Cancel & Update buttons
   ✓ Toast notification on success
   ✓ Auto-close on success
   ✓ Processing state on button

4. DELETE DIALOG: resources/js/pages/settings/offices/delete.tsx
   ✓ Alert dialog confirmation
   ✓ Shows office name being deleted
   ✓ Destructive action confirmation
   ✓ Cancel & Continue buttons
   ✓ Toast notification on success
   ✓ Auto-close on success

═══════════════════════════════════════════════════════════════════════════════

WORKFLOW / USER EXPERIENCE
─────────────────────────────────────────────────────────────────────────────

VIEW OFFICES:
  1. User navigates to /settings/offices
  2. Sees list of all offices in paginated table
  3. Can search by office name or code (Enter key)
  4. Shows pagination controls at bottom

CREATE OFFICE:
  1. Click "Create Office" button
  2. Modal opens with Name & Code fields
  3. Fill in details
  4. Click "Create Office"
  5. Backend validates unique name & code
  6. Success toast: "Office created successfully."
  7. Dialog closes, table refreshes with new office

EDIT OFFICE:
  1. Click green edit icon on row
  2. Modal opens with current name & code pre-filled
  3. Edit fields
  4. Click "Update Office"
  5. Backend validates unique name & code (except current ID)
  6. Success toast: "Office updated successfully."
  7. Dialog closes, table refreshes with updated office

DELETE OFFICE:
  1. Click red trash icon on row
  2. Alert dialog opens asking confirmation
  3. Shows office name: "This will permanently delete the office [NAME]..."
  4. Click "Continue" to confirm
  5. Backend soft-deletes office
  6. Success toast: "Office deleted successfully."
  7. Dialog closes, table refreshes (office removed)

SEARCH:
  1. Type in search box (name or code)
  2. Press Enter
  3. Table updates with matching results
  4. Search query persists in URL (?search=...)
  5. Pagination resets to page 1

═══════════════════════════════════════════════════════════════════════════════

FEATURES IMPLEMENTED (IDENTICAL TO CARDINGV2)
─────────────────────────────────────────────────────────────────────────────

✓ Full CRUD functionality (Create, Read, Update, Delete)
✓ Pagination (50 per page)
✓ Search by name or code
✓ Modal dialogs for create/edit
✓ Alert dialog for delete confirmation
✓ Toast notifications (Sonner)
✓ Form validation errors
✓ Soft deletes (data recovery)
✓ Created_by user tracking
✓ Responsive table UI
✓ Icon buttons (edit/delete)
✓ Loading states on submit
✓ Auto-close on success
✓ Form reset on close
✓ Breadcrumb navigation
✓ Protected routes (auth + verified + active-account middleware)
✓ TypeScript types
✓ Inertia form helpers

═══════════════════════════════════════════════════════════════════════════════

FILES CREATED
─────────────────────────────────────────────────────────────────────────────

Backend:
  ✓ database/migrations/2026_04_20_000000_create_offices_table.php
  ✓ app/Models/Office.php
  ✓ app/Http/Controllers/OfficeController.php
  ✓ routes/offices.php

Frontend:
  ✓ resources/js/types/office.d.ts
  ✓ resources/js/pages/settings/offices/index.tsx
  ✓ resources/js/pages/settings/offices/create.tsx
  ✓ resources/js/pages/settings/offices/edit.tsx
  ✓ resources/js/pages/settings/offices/delete.tsx

Updated:
  ✓ routes/web.php (added require offices.php)

═══════════════════════════════════════════════════════════════════════════════

NEXT STEPS (OPTIONAL)
─────────────────────────────────────────────────────────────────────────────

1. Rebuild frontend assets:
   npm run dev

2. Test in browser:
   http://localhost:8000/settings/offices

3. Create/Edit/Delete offices to test workflows

4. Add office-related seeder (optional):
   php artisan make:seeder OfficeSeeder

5. Add office relationships to other models (e.g., Document):
   public function office(): BelongsTo { return $this->belongsTo(Office::class); }

═══════════════════════════════════════════════════════════════════════════════

PERMISSIONS/POLICIES (OPTIONAL - NOT YET IMPLEMENTED)
─────────────────────────────────────────────────────────────────────────────

If you want to add role-based access control:

1. Create policy:
   php artisan make:policy OfficePolicy --model=Office

2. Add methods:
   - viewAny(User $user): bool
   - view(User $user, Office $office): bool
   - create(User $user): bool
   - update(User $user, Office $office): bool
   - delete(User $user, Office $office): bool

3. Register in AuthServiceProvider:
   Gate::policy(Office::class, OfficePolicy::class);

4. Apply in controller:
   $this->authorize('viewAny', Office::class);
   $this->authorize('create', Office::class);
   etc.

═══════════════════════════════════════════════════════════════════════════════

COMPLETE — OFFICE CRUD READY FOR USE!
═══════════════════════════════════════════════════════════════════════════════
