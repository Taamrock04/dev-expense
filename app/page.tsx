import { getExpenses } from './actions';
import ExpenseForm from '@/app/components/ExpenseForm';
import './brutalism.css';

export default async function Page() {
  // Server Component: ดึงข้อมูลโดยตรง ไม่ต้องผ่าน API
  const expenses = await getExpenses();

  return (
    <main className="container">
      <header className="brutalist-header">
        <h1>💸 DEV EXPENSE TRACKER</h1>
        <p>Track your dev tools spending. No mercy.</p>
      </header>

      <ExpenseForm />

      <section className="expense-list brutalist-box">
        <h2>Recent Expenses</h2>
        {expenses.length === 0 ? (
          <p className="empty-state">No expenses yet. Stay broke responsibly.</p>
        ) : (
          <ul>
            {expenses.map((exp) => (
              <li key={exp.id} className="expense-item">
                <span className="category">{exp.category}</span>
                <span className="amount">฿{exp.amount.toFixed(2)}</span>
                {exp.note && <span className="note">{exp.note}</span>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}