import { Component, inject } from '@angular/core';
import { FinanceService, TransactionType } from '../../services/finance.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.css'],
  standalone: false
})
export class TransactionFormComponent {
  private financeService = inject(FinanceService);
  private fb = inject(FormBuilder);

  transactionForm: FormGroup;

  constructor() {
    this.transactionForm = this.fb.group({
      type: ['venda_vista', Validators.required],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      description: ['', Validators.required],
      date: [new Date().toISOString().split('T')[0], Validators.required],
      isFixed: [false],
      dayOfMonth: [1, [Validators.min(1), Validators.max(31)]]
    });

    // When isFixed changes, we update validators if needed
    this.transactionForm.get('isFixed')?.valueChanges.subscribe(isFixed => {
      if (isFixed) {
        this.transactionForm.get('type')?.setValue('compra_vista'); // Default type for expenses
        this.transactionForm.get('date')?.disable();
        this.transactionForm.get('dayOfMonth')?.enable();
      } else {
        this.transactionForm.get('date')?.enable();
        this.transactionForm.get('dayOfMonth')?.disable();
      }
    });
    // Trigger the disable for dayOfMonth initially
    this.transactionForm.get('dayOfMonth')?.disable();
  }

  onSubmit() {
    if (this.transactionForm.valid) {
      const formValue = this.transactionForm.getRawValue();
      
      if (formValue.isFixed) {
        this.financeService.addFixedExpense({
          description: formValue.description,
          amount: parseFloat(formValue.amount),
          dayOfMonth: parseInt(formValue.dayOfMonth, 10)
        }).subscribe({
          next: () => this.resetForm(),
          error: (err) => console.error('Erro ao adicionar gasto fixo', err)
        });
      } else {
        const [year, month, day] = formValue.date.split('-');
        const localDate = new Date(Number(year), Number(month) - 1, Number(day));

        this.financeService.addTransaction({
          type: formValue.type as TransactionType,
          amount: parseFloat(formValue.amount),
          description: formValue.description,
          date: localDate
        }).subscribe({
          next: () => this.resetForm(),
          error: (err) => console.error('Erro ao adicionar transação', err)
        });
      }
    }
  }

  private resetForm() {
    this.transactionForm.patchValue({
      amount: null,
      description: ''
    });
    this.transactionForm.markAsPristine();
    this.transactionForm.markAsUntouched();
  }
}
