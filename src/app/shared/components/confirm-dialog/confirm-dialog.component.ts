// confirm-dialog.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  template: `
    <div class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 class="text-xl font-semibold mb-4">{{ title }}</h2>
        <p class="mb-4">{{ message }}</p>
        <ng-content></ng-content>
        <div class="flex justify-end">
          <button (click)="cancel.emit()" class="mr-2 px-4 py-2 bg-gray-300 text-gray-700 rounded">
            Cancelar
          </button>
          <button (click)="confirm.emit()" class="px-4 py-2 bg-red-500 text-white rounded">
            Confirmar
          </button>
        </div>
      </div>
    </div>
  `,
  imports: [CommonModule]
})
export class ConfirmDialogComponent {
  @Input() title: string = '';
  @Input() message: string = '';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
