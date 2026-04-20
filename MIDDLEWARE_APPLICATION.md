═══════════════════════════════════════════════════════════════════════════════
MIDDLEWARE APPLICATION — COMPLETE
═══════════════════════════════════════════════════════════════════════════════

MIDDLEWARE 'check-account-active' APPLIED TO ALL PROTECTED ROUTES
─────────────────────────────────────────────────────────────────────────────

CHANGES MADE:

1. BOOTSTRAP CONFIGURATION (bootstrap/app.php)
   ✓ Added middleware alias registration:
     $middleware->alias([
         'check-account-active' => CheckAccountActive::class,
     ]);
   - This registers 'check-account-active' alias so it can be used in routes

2. WEB ROUTES (routes/web.php)
   ✓ Dashboard route now includes 'check-account-active' middleware:
     Route::middleware(['auth', 'verified', 'check-account-active'])
   - If user is_active = false → logged out + redirected to /login with error

3. SETTINGS ROUTES (routes/settings.php)
   ✓ Profile settings: added 'check-account-active'
     Route::middleware(['auth', 'check-account-active'])
   ✓ Security/appearance settings: added 'check-account-active'
     Route::middleware(['auth', 'verified', 'check-account-active'])
   - All settings pages now protected by account active check

═══════════════════════════════════════════════════════════════════════════════

PROTECTED ROUTES SUMMARY
─────────────────────────────────────────────────────────────────────────────

ROUTES WITH 'check-account-active' MIDDLEWARE:

1. /dashboard
   - Requires: auth + verified + active account
   - If is_active=false: logout + redirect to /login

2. /settings/profile (GET/PATCH)
   - Requires: auth + active account
   - Edit and update profile (no email verification needed for view)

3. /settings/profile (DELETE)
   - Requires: auth + verified + active account
   - Delete profile account

4. /settings/security (GET)
   - Requires: auth + verified + active account
   - View security settings

5. /settings/password (PUT)
   - Requires: auth + verified + active account + throttle 6/minute
   - Update password

6. /settings/appearance (GET)
   - Requires: auth + verified + active account
   - View appearance settings

═══════════════════════════════════════════════════════════════════════════════

HOW IT WORKS
─────────────────────────────────────────────────────────────────────────────

SCENARIO 1: Active User
  User logs in with is_active = true
  ↓
  All requests to protected routes pass through CheckAccountActive middleware
  ↓
  Middleware checks: Auth::check() && !Auth::user()->is_active
  ↓
  Result: FALSE (user is active) → request proceeds normally ✓

SCENARIO 2: Admin Deactivates User
  User is logged in and accessing /settings/profile
  ↓
  Admin runs: UPDATE users SET is_active = 0 WHERE id = X;
  ↓
  User makes next request (click, navigation, refresh)
  ↓
  CheckAccountActive middleware runs → checks is_active = false
  ↓
  Auth::logout() → session invalidate → regenerate token
  ↓
  Redirect to /login with error: "Your account has been deactivated..."
  ↓
  User cannot access /dashboard or /settings/* anymore ✓

SCENARIO 3: Deactivated User Tries Direct Access
  User is deactivated but tries to directly access /dashboard?token=xyz
  ↓
  Laravel auth middleware checks session → user is authenticated
  ↓
  CheckAccountActive middleware runs → detects is_active = false
  ↓
  Same as Scenario 2: logout + redirect ✓

═══════════════════════════════════════════════════════════════════════════════

MIDDLEWARE CODE REVIEW
─────────────────────────────────────────────────────────────────────────────

File: app/Http/Middleware/CheckAccountActive.php

<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckAccountActive
{
    public function handle(Request $request, Closure $next): Response
    {
        // Check if user is authenticated and account is active
        if (Auth::check() && !Auth::user()->is_active) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect('/login')->withErrors([
                'username' => 'Your account has been deactivated. Please contact support.'
            ]);
        }

        return $next($request);
    }
}

FLOW:
1. Auth::check() → true if user logged in
2. !Auth::user()->is_active → true if is_active = false
3. If both true:
   - Auth::logout() → clear auth session
   - $request->session()->invalidate() → destroy session
   - $request->session()->regenerateToken() → new CSRF token
   - Redirect to login with error message
4. Else: proceed with request ($next($request))

═══════════════════════════════════════════════════════════════════════════════

ROUTING & MIDDLEWARE REGISTRATION
─────────────────────────────────────────────────────────────────────────────

bootstrap/app.php:
  ✓ CheckAccountActive appended to web middleware stack
  ✓ Middleware alias registered: 'check-account-active' => CheckAccountActive::class

routes/web.php:
  ✓ Route::middleware(['auth', 'verified', 'check-account-active'])
  ✓ /dashboard protected

routes/settings.php:
  ✓ Profile edit/update: ['auth', 'check-account-active']
  ✓ Profile delete/security/password/appearance: ['auth', 'verified', 'check-account-active']

WHY TWO WAYS OF APPLYING MIDDLEWARE:
1. Global append in bootstrap/app.php
   - Runs on EVERY web request (non-auth pages included)
   - Lightweight check: if not authenticated, middleware does nothing
   - Ensures instant logout if is_active changes

2. Explicit in route groups
   - Redundant but intentional defensive programming
   - Clear intent in routes file: "these routes need active account"
   - If global middleware disabled by accident, explicit still protects

═══════════════════════════════════════════════════════════════════════════════

FILES UPDATED (FINAL)
─────────────────────────────────────────────────────────────────────────────

bootstrap/app.php
  - Added middleware alias: 'check-account-active' => CheckAccountActive::class

routes/web.php
  - Dashboard: added 'check-account-active' to middleware array

routes/settings.php
  - Profile routes: added 'check-account-active'
  - Security/appearance routes: added 'check-account-active'

═══════════════════════════════════════════════════════════════════════════════

TESTING CHECKLIST
─────────────────────────────────────────────────────────────────────────────

1. Admin deactivates user while logged in:
   - Terminal: mysql> UPDATE users SET is_active = 0 WHERE id = 1;
   - User's browser: refresh page or click any link
   - Result: Should be logged out and redirected to /login with error ✓

2. Deactivated user tries to access routes directly:
   - /dashboard → error message + redirect to /login
   - /settings/profile → error message + redirect to /login
   - /settings/security → error message + redirect to /login
   - Result: All protected pages blocked ✓

3. Re-activate user:
   - Terminal: mysql> UPDATE users SET is_active = 1 WHERE id = 1;
   - User: Login again with username + password
   - Result: Can access dashboard and settings normally ✓

4. New registered user:
   - Register → is_active defaults to true
   - Login → can access all protected routes
   - Result: All working ✓

═══════════════════════════════════════════════════════════════════════════════

DEPLOYMENT NOTES
─────────────────────────────────────────────────────────────────────────────

Commands to run:
  php artisan config:clear
  php artisan route:clear
  php artisan cache:clear
  composer dump-autoload

The middleware will:
  ✓ Run on every web request globally
  ✓ Perform lightweight is_active check only if authenticated
  ✓ Instantly log out and notify user if account deactivated
  ✓ Work across all protected routes

═══════════════════════════════════════════════════════════════════════════════

DONE — Middleware fully applied to all protected routes!
