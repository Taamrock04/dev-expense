// app/page.tsx — ไม่ต้องแก้ไข เหมือนเดิม
import ExpenseForm from './components/ExpenseForm';

export default function Page() {
  return (
    <main className="container">
      <header className="brutalist-header">
        <h1>DEV EXPENSE TRACKER</h1>
        <p>Track your dev tools spending. No mercy.</p>
      </header>
      <ExpenseForm />
    </main>
  );
}