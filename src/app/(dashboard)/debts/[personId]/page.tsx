import { getPersonById, markDebtPaid, deleteDebtRecord, deletePerson, markDebtPending } from '@/actions/debts';
import AddDebtRecordForm from '@/components/debts/AddDebtRecordForm';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Circle, Wallet } from 'lucide-react';
import { redirect } from 'next/navigation';
import DeleteConfirmButton from '@/components/layout/DeleteConfirmButton';

export default async function PersonDebtPage(props: { 
  params: Promise<{ personId: string }>,
  searchParams?: Promise<{ [key: string]: string | undefined }>
}) {
  const { personId } = await props.params;
  const searchParams = await props.searchParams;
  const id = Number(personId);
  const person = await getPersonById(id);

  if (!person) {
    redirect('/debts');
  }

  let netBalance = 0;
  person.debts.forEach(debt => {
    if (debt.status === 'PENDING') {
      const amt = Number(debt.amount);
      if (debt.type === 'CREDIT') {
        netBalance += amt;
      } else {
        netBalance -= amt;
      }
    }
  });

  const deletePersonAction = deletePerson.bind(null, person.id);

  // Pagination Logic
  const currentPageStr = searchParams?.page || '1';
  let currentPage = parseInt(currentPageStr, 10);
  if (isNaN(currentPage) || currentPage < 1) currentPage = 1;
  const PAGE_SIZE = 25;
  const totalPages = Math.ceil(person.debts.length / PAGE_SIZE) || 1;
  if (currentPage > totalPages) currentPage = totalPages;

  const paginatedDebts = person.debts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div style={{ paddingBottom: '80px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <Link href="/debts" className="primary-btn" style={{ padding: '8px', borderRadius: '50%', background: 'var(--c-surface-container-high)', color: 'var(--c-on-surface)' }}>
          <ArrowLeft size={20} />
        </Link>
        <h2 className="text-display-sm" style={{ margin: 0 }}>{person.name}</h2>
        
        <div style={{ marginLeft: 'auto' }}>
          <DeleteConfirmButton 
            action={deletePersonAction} 
            iconSize={20} 
            title="Delete Person"
            message={`Are you sure you want to delete ${person.name}? This will permanently delete all associated credit and debit records.`}
          />
        </div>
      </div>

      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
        <div style={{ padding: '16px', backgroundColor: netBalance > 0 ? 'var(--c-primary-container)' : netBalance < 0 ? 'var(--c-error-container)' : 'var(--c-surface-variant)', color: netBalance > 0 ? 'var(--c-primary)' : netBalance < 0 ? 'var(--c-error)' : 'var(--c-on-surface)', borderRadius: '16px' }}>
          <Wallet size={32} />
        </div>
        <div>
          <span className="text-label-md text-on-surface-variant">
            {netBalance > 0 ? 'THEY OWE YOU' : netBalance < 0 ? 'YOU OWE THEM' : 'SETTLED'}
          </span>
          <h3 className="text-display-sm" style={{ color: netBalance > 0 ? 'var(--c-primary)' : netBalance < 0 ? 'var(--c-error)' : 'var(--c-on-surface)', margin: 0 }}>
            ${Math.abs(netBalance).toFixed(2)}
          </h3>
        </div>
      </div>

      <AddDebtRecordForm personId={person.id} />

      <div>
        <h3 className="text-title-lg" style={{ marginBottom: '16px' }}>Transaction History</h3>
        {person.debts.length === 0 ? (
          <p className="text-on-surface-variant">No records found with {person.name}.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {paginatedDebts.map(debt => {
              const amt = Number(debt.amount);
              const isCredit = debt.type === 'CREDIT';
              const isPaid = debt.status === 'PAID';
              const toggleAction = isPaid ? markDebtPending.bind(null, debt.id, person.id) : markDebtPaid.bind(null, debt.id, person.id);
              const delAction = deleteDebtRecord.bind(null, debt.id, person.id);

              return (
                <div key={debt.id} className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', opacity: isPaid ? 0.6 : 1 }}>
                  <form action={toggleAction}>
                    <button type="submit" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: isPaid ? 'var(--c-primary)' : 'var(--c-on-surface-variant)' }}>
                      {isPaid ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                    </button>
                  </form>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span className="text-title-md" style={{ fontWeight: 600, color: isCredit ? 'var(--c-primary)' : 'var(--c-error)', textDecoration: isPaid ? 'line-through' : 'none' }}>
                        {isCredit ? '+' : '-'}${amt.toFixed(2)}
                      </span>
                      <span className="text-label-sm text-on-surface-variant">
                        {new Date(debt.date).toLocaleDateString()}
                      </span>
                    </div>
                    {debt.notes && (
                      <p className="text-body-md text-on-surface-variant" style={{ margin: 0, textDecoration: isPaid ? 'line-through' : 'none' }}>
                        {debt.notes}
                      </p>
                    )}
                  </div>

                  <DeleteConfirmButton 
                    action={delAction} 
                    iconSize={18} 
                    title="Delete Record"
                    message="Are you sure you want to delete this debt record?"
                    style={{ padding: '8px' }}
                  />
                </div>
              );
            })}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '24px' }}>
                {currentPage > 1 ? (
                  <Link href={`?page=${currentPage - 1}`} className="primary-btn" style={{ padding: '8px 16px', backgroundColor: 'var(--c-surface-container-high)', color: 'var(--c-on-surface)', boxShadow: 'none' }}>
                    Previous
                  </Link>
                ) : (
                  <button disabled className="primary-btn" style={{ padding: '8px 16px', backgroundColor: 'var(--c-surface-container-lowest)', color: 'var(--c-on-surface-variant)', opacity: 0.5, cursor: 'not-allowed', boxShadow: 'none' }}>
                    Previous
                  </button>
                )}
                
                <span className="text-body-md text-on-surface-variant" style={{ fontWeight: 600 }}>
                  Page {currentPage} of {totalPages}
                </span>

                {currentPage < totalPages ? (
                  <Link href={`?page=${currentPage + 1}`} className="primary-btn" style={{ padding: '8px 16px', backgroundColor: 'var(--c-surface-container-high)', color: 'var(--c-on-surface)', boxShadow: 'none' }}>
                    Next
                  </Link>
                ) : (
                  <button disabled className="primary-btn" style={{ padding: '8px 16px', backgroundColor: 'var(--c-surface-container-lowest)', color: 'var(--c-on-surface-variant)', opacity: 0.5, cursor: 'not-allowed', boxShadow: 'none' }}>
                    Next
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
