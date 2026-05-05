// components/ExpenseForm.tsx
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { addExpenseAction, getExpenses, getUserDisplayName } from '@/app/actions';
import { createSupabaseBrowser } from '@/lib/supabase-browser';
import type { ActionState, Expense } from '@/app/actions';

const initialState: ActionState = { success: false, message: '' };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="submit-btn" disabled={pending}>
      {pending ? '⏳ กำลังบันทึก...' : '💾 Log Expense'}
    </button>
  );
}

export default function ExpenseForm() {
  const [state, formAction]       = useActionState(addExpenseAction, initialState);
  const [expenses, setExpenses]   = useState<Expense[]>([]);
  const [loading, setLoading]     = useState(true);
  const [displayName, setDisplayName] = useState('');
  const router  = useRouter();
  const supabase = createSupabaseBrowser();

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (state.success) loadExpenses();
  }, [state]);

  async function init() {
    const [name] = await Promise.all([
      getUserDisplayName(),
      loadExpenses(),
    ]);
    setDisplayName(name);
  }

  async function loadExpenses() {
    setLoading(true);
    const data = await getExpenses();
    setExpenses(data);
    setLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  function formatDate(iso: string) {
    const d = new Date(iso);
    return (
      d.toLocaleDateString('th-TH', { day: '2-digit', month: 'short' }) +
      ' ' +
      d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
    );
  }

  return (
    <>
      {/* ── User bar ── */}
      <div className="user-bar">
        <span className="user-name">👤 {displayName}</span>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* ── ฟอร์ม ── */}
      <form action={formAction} className="brutalist-box form-box">
        <h2>Add Expense</h2>

        {state.message && (
          <div className={`alert ${state.success ? 'alert-success' : 'alert-error'}`}>
            {state.message}
          </div>
        )}

        <div className="field">
          <label htmlFor="amount">Amount (฿)</label>
          <input
            id="amount" name="amount"
            type="number" step="0.01" min="0.01"
            placeholder="0.00" required
          />
          {state.errors?.amount && (
            <span className="field-error">{state.errors.amount}</span>
          )}
        </div>

        <div className="field">
          <label htmlFor="category">Category</label>
          <input
            id="category" name="category"
            type="text" placeholder="e.g. Vercel, GitHub, Claude" required
          />
          {state.errors?.category && (
            <span className="field-error">{state.errors.category}</span>
          )}
        </div>

        <div className="field">
          <label htmlFor="note">Note (optional)</label>
          <input
            id="note" name="note"
            type="text" placeholder="รายละเอียดเพิ่มเติม"
          />
        </div>

        <SubmitButton />
      </form>

      {/* ── ตาราง 5 ล่าสุด ── */}
      <section className="brutalist-box list-box">
        <div className="list-header">
          <h2>Latest 5 Expenses</h2>
        </div>

        {loading ? (
          <p className="empty-state">⏳ กำลังโหลด...</p>
        ) : expenses.length === 0 ? (
          <p className="empty-state">ยังไม่มีรายการ — เพิ่มรายการแรกด้านบนได้เลย!</p>
        ) : (
          <>
            <div className="table-wrap">
              <table className="expense-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th className="align-right">Amount</th>
                    <th>Note</th>
                    <th className="align-right">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((exp) => (
                    <tr key={exp.id}>
                      <td className="col-cat">{exp.category}</td>
                      <td className="col-amt align-right">
                        ฿{Number(exp.amount).toFixed(2)}
                      </td>
                      <td className="col-note">{exp.note ?? '—'}</td>
                      <td className="col-date align-right">
                        {formatDate(exp.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="total-row">
              <span className="total-label">Total ({expenses.length} รายการ)</span>
              <span className="total-amount">฿{total.toFixed(2)}</span>
            </div>
          </>
        )}
      </section>
    </>
  );
}