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
    ToastContainerComponent
  ],
  templateUrl: './style-guide.component.html',
  styleUrls: ['./style-guide.component.scss']
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
  // Colores Primarios (Paleta Principal T4 Traveling)
  readonly primaryColors: ColorItem[] = [
    { name: 'Lime Moss', variable: '$lime-moss / $color-primary-4', hex: '#8EA604' },
    { name: 'Amber Gold', variable: '$amber-gold / $color-primary-3', hex: '#F5BB00' },
    { name: 'Golden Orange', variable: '$golden-orange / $color-primary-0', hex: '#EC9F05' },
    { name: 'Chocolate', variable: '$chocolate / $color-primary-2', hex: '#D76A03' },
    { name: 'Rusty Spice', variable: '$rusty-spice / $color-primary-1', hex: '#BF3100' }
  ];

  // Colores Secundarios
  readonly secondaryColors: ColorItem[] = [
    { name: 'Cream Light', variable: '$cream-light / $color-secondary-0', hex: '#FFF2C7' },
    { name: 'Brown Dark', variable: '$brown-dark / $color-secondary-1', hex: '#812100' },
    { name: 'Blue Light', variable: '$blue-light / $color-secondary-2', hex: '#C4EAF5' }
  ];

  // Colores Semánticos (Estados)
  readonly semanticColors: ColorItem[] = [
    { name: 'Success', variable: '$color-success', hex: '#8DCC52' },
    { name: 'Error', variable: '$color-error', hex: '#F44930' },
    { name: 'Warning', variable: '$color-warning', hex: '#F9EA47' },
    { name: 'Info', variable: '$color-info', hex: '#00CFFD' }
  ];

  // Colores Neutrales (Escala de Grises)
  readonly neutralColors: ColorItem[] = [
    { name: 'Negro', variable: '$color-neutral-0', hex: '#000000' },
    { name: 'Gris 50', variable: '$color-neutral-50', hex: '#1A1A1A' },
    { name: 'Gris 100', variable: '$color-neutral-100', hex: '#333333' },
    { name: 'Gris 200', variable: '$color-neutral-200', hex: '#4D4D4D' },
    { name: 'Gris 300', variable: '$color-neutral-300', hex: '#666666' },
    { name: 'Gris 400', variable: '$color-neutral-400', hex: '#808080' },
    { name: 'Gris 500', variable: '$color-neutral-500', hex: '#999999' },
    { name: 'Gris 600', variable: '$color-neutral-600', hex: '#AAAAAA' },
    { name: 'Gris 700', variable: '$color-neutral-700', hex: '#CCCCCC' },
    { name: 'Gris 800', variable: '$color-neutral-800', hex: '#E0E0E0' },
    { name: 'Gris 900', variable: '$color-neutral-900', hex: '#F5F5F5' },
    { name: 'Blanco', variable: '$color-neutral-1000', hex: '#FFFFFF' }
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

