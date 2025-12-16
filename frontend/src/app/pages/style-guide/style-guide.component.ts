import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../components/shared/button/button.component';
import { CardComponent } from '../../components/shared/card/card.component';
import { FormInputComponent } from '../../components/shared/form-input/form-input.component';
import { FormTextareaComponent } from '../../components/shared/form-textarea/form-textarea.component';
import { FormSelectComponent, SelectOption } from '../../components/shared/form-select/form-select.component';
import { AlertComponent } from '../../components/shared/alert/alert.component';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-style-guide',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    CardComponent,
    FormInputComponent,
    FormTextareaComponent,
    FormSelectComponent,
    AlertComponent
  ],
  templateUrl: './style-guide.component.html',
  styleUrl: './style-guide.component.scss'
})
export class StyleGuideComponent {
  demoForm: FormGroup;

  selectOptions: SelectOption[] = [
    { value: '1', label: 'Opción 1' },
    { value: '2', label: 'Opción 2' },
    { value: '3', label: 'Opción 3' },
    { value: '4', label: 'Opción 4 (Deshabilitada)', disabled: true }
  ];

  constructor(private fb: FormBuilder) {
    this.demoForm = this.fb.group({
      demoInput: [''],
      demoTextarea: [''],
      demoSelect: ['']
    });
  }

  onButtonClick(variant: string): void {
    console.log(`Button ${variant} clicked!`);
  }

  onAlertDismissed(type: string): void {
    console.log(`Alert ${type} dismissed`);
  }
}

