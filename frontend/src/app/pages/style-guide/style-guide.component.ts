import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Importar TODOS los componentes disponibles
import { ButtonComponent } from '../../components/shared/button/button.component';
import { CardComponent } from '../../components/shared/card/card.component';
import { AlertComponent } from '../../components/shared/alert/alert.component';
import { FormInputComponent } from '../../components/shared/form-input/form-input.component';
import { FormTextareaComponent } from '../../components/shared/form-textarea/form-textarea.component';
import { FormSelectComponent } from '../../components/shared/form-select/form-select.component';
import { ModalComponent } from '../../components/shared/modal/modal.component';
import { TabsComponent } from '../../components/shared/tabs/tabs.component';
import { AccordionComponent } from '../../components/shared/accordion/accordion.component';
import { LoadingSpinnerComponent } from '../../components/shared/loading-spinner/loading-spinner.component';
import { LoadingStateComponent } from '../../components/shared/loading-state/loading-state.component';
import { EmptyStateComponent } from '../../components/shared/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../components/shared/error-state/error-state.component';
import { ThemeSwitcherComponent } from '../../components/shared/theme-switcher/theme-switcher.component';
import { ToastContainerComponent } from '../../components/shared/toast-container/toast-container.component';

interface ColorItem {
  name: string;
  variable: string;
  hex: string;
}

interface TypographyItem {
  level: string;
  size: string;
  weight: string;
}

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-style-guide',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    CardComponent,
    AlertComponent,
    FormInputComponent,
    FormTextareaComponent,
    FormSelectComponent,
    ModalComponent,
    TabsComponent,
    AccordionComponent,
    LoadingSpinnerComponent,
    LoadingStateComponent,
    EmptyStateComponent,
    ErrorStateComponent,
    ThemeSwitcherComponent,
    ToastContainerComponent
  ],
  templateUrl: './style-guide.component.html',
  styleUrl: './style-guide.component.scss'
})
export class StyleGuideComponent {
  // Estado del modal
  isModalOpen = false;

  // Opciones para select
  selectOptions: SelectOption[] = [
    { value: '1', label: 'Opción 1' },
    { value: '2', label: 'Opción 2' },
    { value: '3', label: 'Opción 3' },
    { value: '4', label: 'Opción 4 (Deshabilitada)', disabled: true }
  ];

  // Tabs
  tabs = [
    { id: 'tab1', label: 'Tab 1', content: 'Contenido del primer tab' },
    { id: 'tab2', label: 'Tab 2', content: 'Contenido del segundo tab' },
    { id: 'tab3', label: 'Tab 3', content: 'Contenido del tercer tab' }
  ];

  // Accordion
  accordionItems = [
    {
      id: 'acc1',
      title: '¿Qué es T4 Traveling?',
      content: 'T4 Traveling es tu agencia de viajes de confianza que te ayuda a descubrir el mundo.'
    },
    {
      id: 'acc2',
      title: '¿Cómo puedo reservar?',
      content: 'Puedes reservar directamente desde nuestra web seleccionando tu destino y fechas.'
    },
    {
      id: 'acc3',
      title: '¿Puedo cancelar mi reserva?',
      content: 'Sí, puedes cancelar hasta 48 horas antes de tu viaje sin coste adicional.'
    }
  ];

  // Métodos
  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  onButtonClick(variant: string): void {
    console.log(`Botón ${variant} clickeado`);
  }
  // Colores Primarios
  readonly primaryColors: ColorItem[] = [
    { name: 'Color 1', variable: '--lime-moss', hex: '#8EA604' },
    { name: 'Color 2', variable: '--amber-gold', hex: '#F5BB00' },
    { name: 'Color 3', variable: '--golden-orange', hex: '#EC9F05' },
    { name: 'Color 4', variable: '--chocolate', hex: '#D76A03' },
    { name: 'Color 5', variable: '--rusty-spice', hex: '#BF3100' }
  ];

  // Colores Secundarios
  readonly secondaryColors: ColorItem[] = [
    { name: 'Secondary 1', variable: '--cream-light', hex: '#FFF2C7' },
    { name: 'Secondary 2', variable: '--brown-dark', hex: '#812100' },
    { name: 'Secondary 3', variable: '--blue-light', hex: '#C4EAF5' }
  ];

  // Colores de Apoyo
  readonly supportColors: ColorItem[] = [
    { name: 'Apoyo 1', variable: '--support-green', hex: '#8DCC52' },
    { name: 'Apoyo 2', variable: '--support-yellow', hex: '#F5F500' },
    { name: 'Apoyo 3', variable: '--support-red', hex: '#F44930' },
    { name: 'Apoyo 4', variable: '--support-cyan', hex: '#00CFFD' }
  ];

  // Tipografía
  readonly typographyLevels: TypographyItem[] = [
    { level: 'H1', size: '68 | 72', weight: '42 | 48' },
    { level: 'H2', size: '42 | 48', weight: '26 | 48' },
    { level: 'H3', size: '26 | 48', weight: '16 | 48' },
    { level: 'H4', size: '16 | 48', weight: '16 | 24' },
    { level: 'Paragraph', size: '16 | 24', weight: '14 | 24' },
    { level: 'Small', size: '14 | 24', weight: '12 | 24' },
    { level: 'Intro-head', size: '12 | 24', weight: '1 | 16' },
    { level: 'Caption', size: '1 | 16', weight: '' }
  ];

  // Estados de checkbox y radio
  checkboxStates = {
    default: false,
    focused: false,
    checked: true,
    checkedDisabled: true
  };

  radioStates = {
    default: 'default',
    focused: 'focused',
    checked: 'checked',
    checkedDisabled: 'checkedDisabled'
  };

  // Estados de inputs
  inputValues = {
    label: 'Hola',
    message: '',
    disabled: 'Disabled',
    error: 'Error'
  };
}

