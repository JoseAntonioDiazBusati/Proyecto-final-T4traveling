import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-textarea',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-textarea.component.html',
  styleUrl: './form-textarea.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormTextareaComponent),
      multi: true
    }
  ]
})
export class FormTextareaComponent implements ControlValueAccessor {
  @Input() id!: string;
  @Input() label!: string;
  @Input() name!: string;
  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() errorMessage: string = '';
  @Input() helpText: string = '';
  @Input() disabled: boolean = false;
  @Input() rows: number = 4;
  @Input() maxLength?: number;

  value: string = '';
  isTouched: boolean = false;

  // ControlValueAccessor implementation
  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.value = target.value;
    this.onChange(this.value);
  }

  onBlur(): void {
    this.isTouched = true;
    this.onTouched();
  }

  get showError(): boolean {
    return this.isTouched && !!this.errorMessage;
  }

  get characterCount(): string | null {
    if (this.maxLength) {
      return `${this.value.length}/${this.maxLength}`;
    }
    return null;
  }
}

