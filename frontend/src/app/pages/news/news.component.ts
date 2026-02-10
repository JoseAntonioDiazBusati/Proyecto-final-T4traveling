import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-destination-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})

export class NewsComponent implements OnInit {
  ngOnInit(): void {
      throw new Error("Method not implemented.");
  }
  private destroyRef = inject(DestroyRef);

  // Signals para estado reactivo
  private newsItemsSignal = signal<string[]>([]);}
