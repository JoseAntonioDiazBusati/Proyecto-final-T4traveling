import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

@Component({
  selector: 'app-style-guide',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './style-guide.component.html',
  styleUrl: './style-guide.component.scss'
})
export class StyleGuideComponent {
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

