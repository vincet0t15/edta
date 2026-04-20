# Electronic Document Tracking & Archiving Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Build a complete electronic document tracking system where documents flow through offices/departments, maintaining audit trails, status tracking, and archival capabilities.

**Architecture:** Four-phase approach:
1. **Phase 1 (Settings):** Configure system parameters - document statuses, priority levels, document categories, routing rules, SLA policies, retention policies
2. **Phase 2 (Core Document Module):** Document create/submit/track, routing workflow, status transitions, comments & audit logs
3. **Phase 3 (Dashboards & Analytics):** Overview cards, office queues, bottleneck detection, performance metrics
4. **Phase 4 (Archival & Compliance):** Auto-archival, soft deletes, retention policies, export/reports, immutable audit logs

**Tech Stack:** Laravel 11, Inertia React + TypeScript, MySQL, Soft Deletes, Policy-based authorization

---

## PHASE 1: SETTINGS & CONFIGURATION DATA

### Overview
Phase 1 establishes all master data and system configuration needed for document tracking. This includes statuses, priorities, categories, routing rules, and retention policies.

---

### Task 1: Create Document Status Settings Table & Model

**Objective:** Create database table and model for document workflow statuses (Draft, Submitted, In Progress, etc.)

**Files:**
- Create: `database/migrations/2026_04_20_000002_create_document_statuses_table.php`
- Create: `app/Models/DocumentStatus.php`
- Test: `tests/Feature/Models/DocumentStatusTest.php`

**Step 1: Create migration file**

```bash
cd /mnt/c/laragon/www/EDTAPROJECT && /mnt/c/laragon/bin/php/php-8.3.30-Win32-vs16-x64/php.exe artisan make:migration create_document_statuses_table
```

**Step 2: Write migration content**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('document_statuses', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();  // DRAFT, SUBMITTED, IN_PROGRESS, FOR_REVIEW, APPROVED, REJECTED, ARCHIVED
            $table->string('label');           // Draft, Submitted, In Progress, For Review, Approved, Rejected, Archived
            $table->text('description')->nullable();
            $table->integer('order')->default(0); // For ordering in dropdowns
            $table->string('badge_color')->default('gray'); // UI color indicator
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('document_statuses');
    }
};
```

**Step 3: Create Model with relationships**

File: `app/Models/DocumentStatus.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DocumentStatus extends Model
{
    protected $fillable = ['code', 'label', 'description', 'order', 'badge_color'];

    protected $casts = [
        'order' => 'integer',
    ];

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class, 'current_status_id');
    }

    public function scopeActive($query)
    {
        return $query->orderBy('order');
    }
}
```

**Step 4: Seed initial statuses**

Create file: `database/seeders/DocumentStatusSeeder.php`

```php
<?php

namespace Database\Seeders;

use App\Models\DocumentStatus;
use Illuminate\Database\Seeder;

class DocumentStatusSeeder extends Seeder
{
    public function run(): void
    {
        $statuses = [
            ['code' => 'DRAFT', 'label' => 'Draft', 'description' => 'Document being prepared', 'order' => 1, 'badge_color' => 'gray'],
            ['code' => 'SUBMITTED', 'label' => 'Submitted', 'description' => 'Submitted for processing', 'order' => 2, 'badge_color' => 'blue'],
            ['code' => 'IN_PROGRESS', 'label' => 'In Progress', 'description' => 'Currently being processed', 'order' => 3, 'badge_color' => 'yellow'],
            ['code' => 'FOR_REVIEW', 'label' => 'For Review', 'description' => 'Awaiting approval/review', 'order' => 4, 'badge_color' => 'orange'],
            ['code' => 'APPROVED', 'label' => 'Approved', 'description' => 'Approved and processed', 'order' => 5, 'badge_color' => 'green'],
            ['code' => 'REJECTED', 'label' => 'Rejected', 'description' => 'Rejected with reason', 'order' => 6, 'badge_color' => 'red'],
            ['code' => 'ON_HOLD', 'label' => 'On Hold', 'description' => 'Processing paused', 'order' => 7, 'badge_color' => 'purple'],
            ['code' => 'ARCHIVED', 'label' => 'Archived', 'description' => 'Archived for records', 'order' => 8, 'badge_color' => 'indigo'],
        ];

        foreach ($statuses as $status) {
            DocumentStatus::firstOrCreate(['code' => $status['code']], $status);
        }
    }
}
```

**Step 5: Run migration and seed**

```bash
cd /mnt/c/laragon/www/EDTAPROJECT
/mnt/c/laragon/bin/php/php-8.3.30-Win32-vs16-x64/php.exe artisan migrate
/mnt/c/laragon/bin/php/php-8.3.30-Win32-vs16-x64/php.exe artisan db:seed --class=DocumentStatusSeeder
```

Expected: No errors, 8 statuses inserted.

**Step 6: Commit**

```bash
git add database/migrations/2026_04_20_000002_create_document_statuses_table.php
git add app/Models/DocumentStatus.php
git add database/seeders/DocumentStatusSeeder.php
git commit -m "feat: add document status settings model and seeder"
```

---

### Task 2: Create Document Priority Settings Table & Model

**Objective:** Create database table for document priority levels (Low, Medium, High, Urgent)

**Files:**
- Create: `database/migrations/2026_04_20_000003_create_document_priorities_table.php`
- Create: `app/Models/DocumentPriority.php`

**Step 1: Create migration**

```bash
cd /mnt/c/laragon/www/EDTAPROJECT && /mnt/c/laragon/bin/php/php-8.3.30-Win32-vs16-x64/php.exe artisan make:migration create_document_priorities_table
```

**Step 2: Write migration**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('document_priorities', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();  // LOW, MEDIUM, HIGH, URGENT
            $table->string('label');
            $table->integer('level')->unique(); // 1=LOW, 2=MEDIUM, 3=HIGH, 4=URGENT
            $table->text('description')->nullable();
            $table->string('badge_color')->default('gray');
            $table->integer('sla_days')->default(30); // Default SLA in days
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('document_priorities');
    }
};
```

**Step 3: Create Model**

File: `app/Models/DocumentPriority.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DocumentPriority extends Model
{
    protected $fillable = ['code', 'label', 'level', 'description', 'badge_color', 'sla_days'];

    protected $casts = [
        'level' => 'integer',
        'sla_days' => 'integer',
    ];

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class, 'priority_id');
    }

    public function scopeOrderByLevel($query)
    {
        return $query->orderBy('level', 'desc');
    }
}
```

**Step 4: Create seeder**

File: `database/seeders/DocumentPrioritySeeder.php`

```php
<?php

namespace Database\Seeders;

use App\Models\DocumentPriority;
use Illuminate\Database\Seeder;

class DocumentPrioritySeeder extends Seeder
{
    public function run(): void
    {
        $priorities = [
            ['code' => 'LOW', 'label' => 'Low', 'level' => 1, 'description' => 'Can wait', 'badge_color' => 'green', 'sla_days' => 30],
            ['code' => 'MEDIUM', 'label' => 'Medium', 'level' => 2, 'description' => 'Normal processing', 'badge_color' => 'blue', 'sla_days' => 14],
            ['code' => 'HIGH', 'label' => 'High', 'level' => 3, 'description' => 'Important', 'badge_color' => 'orange', 'sla_days' => 7],
            ['code' => 'URGENT', 'label' => 'Urgent', 'level' => 4, 'description' => 'Immediate action required', 'badge_color' => 'red', 'sla_days' => 1],
        ];

        foreach ($priorities as $priority) {
            DocumentPriority::firstOrCreate(['code' => $priority['code']], $priority);
        }
    }
}
```

**Step 5: Run migration and seed**

```bash
cd /mnt/c/laragon/www/EDTAPROJECT
/mnt/c/laragon/bin/php/php-8.3.30-Win32-vs16-x64/php.exe artisan migrate
/mnt/c/laragon/bin/php/php-8.3.30-Win32-vs16-x64/php.exe artisan db:seed --class=DocumentPrioritySeeder
```

Expected: 4 priorities inserted.

**Step 6: Commit**

```bash
git add database/migrations/2026_04_20_000003_create_document_priorities_table.php
git add app/Models/DocumentPriority.php
git add database/seeders/DocumentPrioritySeeder.php
git commit -m "feat: add document priority settings model and seeder"
```

---

### Task 3: Create Document Category Settings Table & Model

**Objective:** Create document categories (Requests, Reports, Permits, Complaints, etc.)

**Files:**
- Create: `database/migrations/2026_04_20_000004_create_document_categories_table.php`
- Create: `app/Models/DocumentCategory.php`

**Step 1: Create migration**

```bash
cd /mnt/c/laragon/www/EDTAPROJECT && /mnt/c/laragon/bin/php/php-8.3.30-Win32-vs16-x64/php.exe artisan make:migration create_document_categories_table
```

**Step 2: Write migration**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('document_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('code')->unique();
            $table->text('description')->nullable();
            $table->string('icon')->nullable(); // For UI display
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('document_categories');
    }
};
```

**Step 3: Create Model**

File: `app/Models/DocumentCategory.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class DocumentCategory extends Model
{
    use SoftDeletes;

    protected $fillable = ['name', 'code', 'description', 'icon', 'is_active'];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function documentTypes(): HasMany
    {
        return $this->hasMany(DocumentType::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
```

**Step 4: Create seeder**

File: `database/seeders/DocumentCategorySeeder.php`

```php
<?php

namespace Database\Seeders;

use App\Models\DocumentCategory;
use Illuminate\Database\Seeder;

class DocumentCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Requests', 'code' => 'REQ', 'description' => 'Administrative and service requests', 'icon' => 'FileText'],
            ['name' => 'Reports', 'code' => 'REP', 'description' => 'Departmental and financial reports', 'icon' => 'BarChart3'],
            ['name' => 'Permits', 'code' => 'PRM', 'description' => 'Permits and licenses', 'icon' => 'CheckCircle'],
            ['name' => 'Complaints', 'code' => 'CMP', 'description' => 'Citizen complaints and concerns', 'icon' => 'AlertCircle'],
            ['name' => 'Correspondence', 'code' => 'COR', 'description' => 'Official letters and memos', 'icon' => 'Mail'],
        ];

        foreach ($categories as $category) {
            DocumentCategory::firstOrCreate(['code' => $category['code']], $category);
        }
    }
}
```

**Step 5: Run migration and seed**

```bash
cd /mnt/c/laragon/www/EDTAPROJECT
/mnt/c/laragon/bin/php/php-8.3.30-Win32-vs16-x64/php.exe artisan migrate
/mnt/c/laragon/bin/php/php-8.3.30-Win32-vs16-x64/php.exe artisan db:seed --class=DocumentCategorySeeder
```

Expected: 5 categories inserted.

**Step 6: Commit**

```bash
git add database/migrations/2026_04_20_000004_create_document_categories_table.php
git add app/Models/DocumentCategory.php
git add database/seeders/DocumentCategorySeeder.php
git commit -m "feat: add document category settings model and seeder"
```

---

### Task 4: Create Retention Policy Settings Table & Model

**Objective:** Define document retention and archival rules (how long to keep, when to archive, when to delete)

**Files:**
- Create: `database/migrations/2026_04_20_000005_create_retention_policies_table.php`
- Create: `app/Models/RetentionPolicy.php`

**Step 1: Create migration**

```bash
cd /mnt/c/laragon/www/EDTAPROJECT && /mnt/c/laragon/bin/php/php-8.3.30-Win32-vs16-x64/php.exe artisan make:migration create_retention_policies_table
```

**Step 2: Write migration**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('retention_policies', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('code')->unique();
            $table->text('description')->nullable();
            $table->integer('days_to_archive')->default(365); // Move to archive after X days
            $table->integer('days_to_delete')->default(2555); // Permanently delete after X days (7 years)
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('retention_policies');
    }
};
```

**Step 3: Create Model**

File: `app/Models/RetentionPolicy.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RetentionPolicy extends Model
{
    protected $fillable = ['name', 'code', 'description', 'days_to_archive', 'days_to_delete', 'is_active'];

    protected $casts = [
        'days_to_archive' => 'integer',
        'days_to_delete' => 'integer',
        'is_active' => 'boolean',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
```

**Step 4: Create seeder**

File: `database/seeders/RetentionPolicySeeder.php`

```php
<?php

namespace Database\Seeders;

use App\Models\RetentionPolicy;
use Illuminate\Database\Seeder;

class RetentionPolicySeeder extends Seeder
{
    public function run(): void
    {
        $policies = [
            ['name' => 'Standard (1 year archive, 7 years delete)', 'code' => 'STANDARD', 'description' => 'Default policy for most documents', 'days_to_archive' => 365, 'days_to_delete' => 2555],
            ['name' => 'Short-Term (3 months archive, 1 year delete)', 'code' => 'SHORT_TERM', 'description' => 'For temporary documents', 'days_to_archive' => 90, 'days_to_delete' => 365],
            ['name' => 'Long-Term (3 years archive, 10 years delete)', 'code' => 'LONG_TERM', 'description' => 'For important records', 'days_to_archive' => 1095, 'days_to_delete' => 3650],
            ['name' => 'Permanent (Never archive, never delete)', 'code' => 'PERMANENT', 'description' => 'For legal/compliance documents', 'days_to_archive' => 999999, 'days_to_delete' => 999999],
        ];

        foreach ($policies as $policy) {
            RetentionPolicy::firstOrCreate(['code' => $policy['code']], $policy);
        }
    }
}
```

**Step 5: Run migration and seed**

```bash
cd /mnt/c/laragon/www/EDTAPROJECT
/mnt/c/laragon/bin/php/php-8.3.30-Win32-vs16-x64/php.exe artisan migrate
/mnt/c/laragon/bin/php/php-8.3.30-Win32-vs16-x64/php.exe artisan db:seed --class=RetentionPolicySeeder
```

Expected: 4 policies inserted.

**Step 6: Commit**

```bash
git add database/migrations/2026_04_20_000005_create_retention_policies_table.php
git add app/Models/RetentionPolicy.php
git add database/seeders/RetentionPolicySeeder.php
git commit -m "feat: add retention policy settings model and seeder"
```

---

### Task 5: Create SLA (Service Level Agreement) Configuration Table & Model

**Objective:** Define SLA rules - response times based on document type and priority

**Files:**
- Create: `database/migrations/2026_04_20_000006_create_sla_configurations_table.php`
- Create: `app/Models/SLAConfiguration.php`

**Step 1: Create migration**

```bash
cd /mnt/c/laragon/www/EDTAPROJECT && /mnt/c/laragon/bin/php/php-8.3.30-Win32-vs16-x64/php.exe artisan make:migration create_sla_configurations_table
```

**Step 2: Write migration**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sla_configurations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('document_type_id')->nullable()->constrained('document_types')->onDelete('set null');
            $table->foreignId('priority_id')->nullable()->constrained('document_priorities')->onDelete('set null');
            $table->integer('response_hours')->default(24); // Hours to first response
            $table->integer('resolution_hours')->default(72); // Hours to complete
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->unique(['document_type_id', 'priority_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sla_configurations');
    }
};
```

**Step 3: Create Model**

File: `app/Models/SLAConfiguration.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SLAConfiguration extends Model
{
    protected $fillable = ['document_type_id', 'priority_id', 'response_hours', 'resolution_hours', 'description', 'is_active'];

    protected $casts = [
        'response_hours' => 'integer',
        'resolution_hours' => 'integer',
        'is_active' => 'boolean',
    ];

    public function documentType(): BelongsTo
    {
        return $this->belongsTo(DocumentType::class);
    }

    public function priority(): BelongsTo
    {
        return $this->belongsTo(DocumentPriority::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
```

**Step 4: Run migration**

```bash
cd /mnt/c/laragon/www/EDTAPROJECT
/mnt/c/laragon/bin/php/php-8.3.30-Win32-vs16-x64/php.exe artisan migrate
```

Expected: No errors, table created.

**Step 5: Commit**

```bash
git add database/migrations/2026_04_20_000006_create_sla_configurations_table.php
git add app/Models/SLAConfiguration.php
git commit -m "feat: add SLA configuration settings model"
```

---

### Task 6: Create Routing Rule Settings Table & Model

**Objective:** Define document routing rules (which documents go to which offices automatically)

**Files:**
- Create: `database/migrations/2026_04_20_000007_create_routing_rules_table.php`
- Create: `app/Models/RoutingRule.php`

**Step 1: Create migration**

```bash
cd /mnt/c/laragon/www/EDTAPROJECT && /mnt/c/laragon/bin/php/php-8.3.30-Win32-vs16-x64/php.exe artisan make:migration create_routing_rules_table
```

**Step 2: Write migration**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('routing_rules', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('document_type_id')->nullable()->constrained('document_types')->onDelete('set null');
            $table->foreignId('first_recipient_office_id')->constrained('offices')->onDelete('restrict');
            $table->integer('order')->default(0); // Priority order
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('routing_rules');
    }
};
```

**Step 3: Create Model**

File: `app/Models/RoutingRule.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RoutingRule extends Model
{
    protected $fillable = ['name', 'document_type_id', 'first_recipient_office_id', 'order', 'description', 'is_active'];

    protected $casts = [
        'order' => 'integer',
        'is_active' => 'boolean',
    ];

    public function documentType(): BelongsTo
    {
        return $this->belongsTo(DocumentType::class);
    }

    public function firstRecipientOffice(): BelongsTo
    {
        return $this->belongsTo(Office::class, 'first_recipient_office_id');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true)->orderBy('order');
    }
}
```

**Step 4: Run migration**

```bash
cd /mnt/c/laragon/www/EDTAPROJECT
/mnt/c/laragon/bin/php/php-8.3.30-Win32-vs16-x64/php.exe artisan migrate
```

Expected: No errors, table created.

**Step 5: Commit**

```bash
git add database/migrations/2026_04_20_000007_create_routing_rules_table.php
git add app/Models/RoutingRule.php
git commit -m "feat: add routing rule settings model"
```

---

## PHASE 1 SUMMARY: SETTINGS DATA TABLES CREATED

By end of Phase 1, you will have:

✓ **Document Statuses** (DRAFT, SUBMITTED, IN_PROGRESS, FOR_REVIEW, APPROVED, REJECTED, ON_HOLD, ARCHIVED)
✓ **Document Priorities** (LOW, MEDIUM, HIGH, URGENT with SLA days)
✓ **Document Categories** (Requests, Reports, Permits, Complaints, Correspondence)
✓ **Retention Policies** (Standard, Short-Term, Long-Term, Permanent)
✓ **SLA Configurations** (Response and resolution hours by document type & priority)
✓ **Routing Rules** (Auto-route documents to first recipient office)

All with proper seeders and relationships.

---

## PHASE 2: SETTINGS CRUD OPERATIONS

Next phase will create:
- Controllers for each settings module (DocumentStatusController, PriorityController, etc.)
- React UI pages for CRUD operations in Settings menu
- Authorization policies
- Validation rules
- Resource classes

Would you like me to create a detailed plan for Phase 2 as well?

---

## DATABASE RELATIONSHIP DIAGRAM (Phase 1 Complete)

```
DocumentStatus ─────→ Document
DocumentPriority ───→ Document
DocumentType ───────→ Document
DocumentCategory ──→ DocumentType
RetentionPolicy ──→ Document (or DocumentType)
SLAConfiguration ──→ DocumentType, DocumentPriority
RoutingRule ───────→ DocumentType, Office
```

---

## MIGRATION EXECUTION ORDER

```
1. 2026_04_20_000002_create_document_statuses_table.php
2. 2026_04_20_000003_create_document_priorities_table.php
3. 2026_04_20_000004_create_document_categories_table.php
4. 2026_04_20_000005_create_retention_policies_table.php
5. 2026_04_20_000006_create_sla_configurations_table.php (depends on DocumentType, DocumentPriority)
6. 2026_04_20_000007_create_routing_rules_table.php (depends on DocumentType, Office)
```

---

**Status:** PHASE 1 PLAN COMPLETE (Ready to implement)

**Next Action:** Ready to execute Phase 1 tasks? Or adjust requirements first?
