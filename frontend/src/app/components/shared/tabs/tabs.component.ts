import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TabItem {
  id: string;
  label: string;
  content?: string;
  icon?: string;
  disabled?: boolean;
  badge?: string | number;
}

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss'
})
export class TabsComponent {
  @Input() tabs: TabItem[] = [];
  @Input() activeTabId?: string;
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';

  @Output() tabChanged = new EventEmitter<TabItem>();

  ngOnInit(): void {
    if (!this.activeTabId && this.tabs.length > 0) {
      const firstEnabled = this.tabs.find(tab => !tab.disabled);
      if (firstEnabled) {
        this.activeTabId = firstEnabled.id;
      }
    }
  }

  selectTab(tab: TabItem, event?: Event): void {
    if (event) {
      event.preventDefault();
    }

    if (tab.disabled || tab.id === this.activeTabId) return;

    this.activeTabId = tab.id;
    this.tabChanged.emit(tab);
  }

  isTabActive(tab: TabItem): boolean {
    return tab.id === this.activeTabId;
  }

  onKeyDown(event: KeyboardEvent, tab: TabItem, index: number): void {
    const isHorizontal = this.orientation === 'horizontal';

    switch (event.key) {
      case 'ArrowLeft':
        if (isHorizontal) {
          event.preventDefault();
          this.focusPreviousTab(index);
        }
        break;

      case 'ArrowRight':
        if (isHorizontal) {
          event.preventDefault();
          this.focusNextTab(index);
        }
        break;

      case 'ArrowUp':
        if (!isHorizontal) {
          event.preventDefault();
          this.focusPreviousTab(index);
        }
        break;

      case 'ArrowDown':
        if (!isHorizontal) {
          event.preventDefault();
          this.focusNextTab(index);
        }
        break;

      case 'Home':
        event.preventDefault();
        this.focusFirstTab();
        break;

      case 'End':
        event.preventDefault();
        this.focusLastTab();
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        this.selectTab(tab);
        break;
    }
  }

  private focusNextTab(currentIndex: number): void {
    const nextIndex = this.findNextEnabledIndex(currentIndex);
    if (nextIndex !== -1) {
      this.focusTab(nextIndex);
      this.selectTab(this.tabs[nextIndex]);
    }
  }

  private focusPreviousTab(currentIndex: number): void {
    const previousIndex = this.findPreviousEnabledIndex(currentIndex);
    if (previousIndex !== -1) {
      this.focusTab(previousIndex);
      this.selectTab(this.tabs[previousIndex]);
    }
  }

  private focusFirstTab(): void {
    const firstIndex = this.findNextEnabledIndex(-1);
    if (firstIndex !== -1) {
      this.focusTab(firstIndex);
      this.selectTab(this.tabs[firstIndex]);
    }
  }

  private focusLastTab(): void {
    const lastIndex = this.findPreviousEnabledIndex(this.tabs.length);
    if (lastIndex !== -1) {
      this.focusTab(lastIndex);
      this.selectTab(this.tabs[lastIndex]);
    }
  }

  private findNextEnabledIndex(currentIndex: number): number {
    for (let i = currentIndex + 1; i < this.tabs.length; i++) {
      if (!this.tabs[i].disabled) {
        return i;
      }
    }
    for (let i = 0; i <= currentIndex; i++) {
      if (!this.tabs[i].disabled) {
        return i;
      }
    }
    return -1;
  }

  private findPreviousEnabledIndex(currentIndex: number): number {
    for (let i = currentIndex - 1; i >= 0; i--) {
      if (!this.tabs[i].disabled) {
        return i;
      }
    }
    for (let i = this.tabs.length - 1; i >= currentIndex; i--) {
      if (!this.tabs[i].disabled) {
        return i;
      }
    }
    return -1;
  }

  private focusTab(index: number): void {
    const button = document.getElementById(`tab-${this.tabs[index].id}`);
    button?.focus();
  }

  getTabButtonId(tab: TabItem): string {
    return `tab-${tab.id}`;
  }

  getTabPanelId(tab: TabItem): string {
    return `tabpanel-${tab.id}`;
  }
}

