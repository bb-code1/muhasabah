import { getExpenses, addExpense } from '@/actions';
import { PlusCircle, Receipt } from 'lucide-react';
import { revalidatePath } from 'next/cache';

export default async function ExpensesPage() {
  const expenses = await getExpenses();

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <Receipt color="var(--c-primary)" />
        <h2 className="text-headline-md" style={{ margin: 0 }}>Expense Tracker</h2>
      </div>

      <form action={addExpense} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '32px' }}>
        <input 
          type="number" 
          name="amount"
          step="0.01" 
          placeholder="Amount" 
          className="search-input"
          required 
          style={{ flex: 1, minWidth: '100px', borderRadius: '8px' }}
        />
        <input 
          type="text" 
          name="description"
          placeholder="Description" 
          className="search-input"
          required 
          style={{ flex: 2, minWidth: '200px', borderRadius: '8px' }}
        />
        <select 
          name="category"
          className="search-input"
          style={{ flex: 1, minWidth: '150px', borderRadius: '8px', WebkitAppearance: 'none' }}
        >
          <option>General</option>
          <option>Food</option>
          <option>Transport</option>
          <option>Utilities</option>
          <option>Charity/Sadaqah</option>
        </select>
        <input 
          type="date" 
          name="date"
          className="search-input"
          required 
          style={{ flex: 1, minWidth: '150px', borderRadius: '8px' }}
        />
        <button type="submit" className="primary-btn" style={{ width: '100%', borderRadius: '8px' }}>
          <PlusCircle size={20} /> Add Expense
        </button>
      </form>

      <div>
        <h3 className="text-body-md text-on-surface-variant" style={{ marginBottom: '16px', fontWeight: 600 }}>Recent Expenses</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {expenses.map(exp => (
            <div key={exp.id} className="habit-item" style={{ backgroundColor: 'var(--c-surface-container-low)', padding: '16px', borderRadius: '8px' }}>
              <div>
                <p className="text-body-md" style={{ fontWeight: 600 }}>{exp.description}</p>
                <p className="text-label-sm text-on-surface-variant">{exp.category} • {exp.date.toLocaleDateString()}</p>
              </div>
              <div style={{ fontWeight: 600, color: 'var(--c-error)' }}>
                -${Number(exp.amount).toFixed(2)}
              </div>
            </div>
          ))}
          {expenses.length === 0 && <p className="text-on-surface-variant">No expenses recorded yet.</p>}
        </div>
      </div>
    </div>
  );
}
