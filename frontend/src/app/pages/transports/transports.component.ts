import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransportService, Transport } from '../../services/transport.service';

@Component({
  selector: 'app-transports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transports.component.html',
  styleUrls: ['./transports.component.scss']
})
export class TransportsComponent implements OnInit {
  private transportService = inject(TransportService);

  transportTypes = [
    {
      type: 'automovil' as const,
      icon: '🚗',
      name: 'Automóvil',
      description: 'Alquila un coche y explora a tu ritmo'
    },
    {
      type: 'autobus' as const,
      icon: '🚌',
      name: 'Autobús',
      description: 'Viaja cómodamente y de forma económica'
    },
    {
      type: 'avion' as const,
      icon: '✈️',
      name: 'Avión',
      description: 'Llega rápido a tu destino'
    }
  ];

  allTransports: Transport[] = [];
  filteredTransports: Transport[] = [];
  selectedTransportType: 'automovil' | 'autobus' | 'avion' | '' = '';

  ngOnInit(): void {
    this.loadTransports();
  }

  loadTransports(): void {
    this.transportService.getTransports().subscribe({
      next: (transports) => {
        this.allTransports = transports;
        this.filteredTransports = transports; // Mostrar todos al inicio
      },
      error: (error) => {
        console.error('Error al cargar transportes:', error);
      }
    });
  }

  searchTransport(type: 'automovil' | 'autobus' | 'avion'): void {
    this.selectedTransportType = type;
    this.filteredTransports = this.allTransports.filter(transport => transport.type === type);
  }

  getResultsTitle(): string {
    if (this.selectedTransportType) {
      const typeName = this.transportTypes.find(t => t.type === this.selectedTransportType)?.name || '';
      return `${typeName}s disponibles`;
    }
    return 'Todos los transportes';
  }

  clearFilters(): void {
    this.selectedTransportType = '';
    this.filteredTransports = this.allTransports; // Mostrar todos en lugar de vacío
  }
}
