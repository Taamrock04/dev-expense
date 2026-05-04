'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { addExpenseAction, ActionState } from '@/app/actions';

const initialState: ActionState = { success: false, message: '' };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={pending ? 'loading' : ''}>
      {pending ? '⏳ Saving...' : '💾 Save'}
    </button>
  );
}

export default function ExpenseForm() {
  const [state, formAction] = useFormState(addExpenseAction, initialState);

  return (
    <form action={formAction} className="brutalist-box form-box">
      <h2>Add Tool Expense</h2>

      {/* Feedback Message */}
      {state.message && (
        <div className={`alert ${state.success ? 'alert-success' : 'alert-error'}`}>
          {state.message}
        </div>
      )}

      <div className="field">
        <input name="amount" type="number" step="0.01" placeholder="฿ Amount" required />
        {state.errors?.amount && <span className="error">{state.errors.amount}</span>}
      </div>

      <div className="field">
        <input name="category" placeholder="e.g. Vercel, GitHub, Claude" required />
        {state.errors?.category && <span className="error">{state.errors.category}</span>}
      </div>

      <div className="field">
        <input name="note" placeholder="Note (optional)" />
      </div>

      <SubmitButton />
    </form>
  );
}