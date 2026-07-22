// // client/src/components/admin/AdminLogin.js
import Link from "next/link";

export default function AdminLogin({ handleLoginSubmit, loginForm, setLoginForm, loginError, loggingIn }) {
  return (
    <main id="main-content" className="min-h-screen bg-[#f5efe4] text-brand-african flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-brand-lightgold/60 shadow-xl p-8">
        <p className="font-sans text-[11px] tracking-[0.4em] uppercase text-brand-gold mb-3" aria-hidden="true">
          Sanwariyas
        </p>
        <h1 className="font-display text-3xl mb-2">Admin Login</h1>
        <p className="font-sans text-sm text-brand-mud mb-8">
          Use your configured admin username and password to manage products and inquiries.
        </p>

        <form onSubmit={handleLoginSubmit} className="space-y-5" aria-label="Admin Login Form" noValidate>
          <div>
            <label htmlFor="admin-username" className="block font-sans text-[11px] tracking-[0.2em] uppercase text-brand-mud mb-2">
              Username
            </label>
            <input
              id="admin-username"
              type="text"
              required
              value={loginForm.username}
              onChange={(e) => setLoginForm((prev) => ({ ...prev, username: e.target.value }))}
              autoComplete="username"
              className="w-full border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee transition-colors"
              aria-required="true"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="admin-password" className="block font-sans text-[11px] tracking-[0.2em] uppercase text-brand-mud !mb-0">
                Password
              </label>
              <Link
                href="/login?mode=forgot"
                className="font-sans text-[10px] text-brand-coffee hover:underline uppercase tracking-wider transition-colors"
              >
                Forgot?
              </Link>
            </div>
            <input
              id="admin-password"
              type="password"
              required
              value={loginForm.password}
              onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
              autoComplete="current-password"
              className="w-full border border-brand-lightgold/60 px-4 py-3 text-sm focus:outline-none focus:border-brand-coffee transition-colors"
              aria-required="true"
            />
          </div>

          {loginError && (
            <p aria-live="assertive" role="alert" className="font-sans text-xs text-red-700 bg-red-50 border border-red-200 px-4 py-3">
              {loginError}
            </p>
          )}

          <button
            type="submit"
            disabled={loggingIn}
            className="w-full bg-brand-coffee text-brand-cream py-3 font-sans text-xs tracking-[0.3em] uppercase hover:bg-brand-african transition-colors disabled:opacity-60"
            aria-busy={loggingIn}
          >
            {loggingIn ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </main>
  );
}