import { CanDeactivateFn } from '@angular/router';

export interface CanComponentDeactivate {
  canDeactivate: () => boolean | Promise<boolean>;
  hasUnsavedChanges?: () => boolean;
}

export const unsavedChangesGuard: CanDeactivateFn<CanComponentDeactivate> = (
  component: CanComponentDeactivate
) => {
  if (!component || typeof component.canDeactivate !== 'function') {
    return true;
  }
  return component.canDeactivate();
};

export const formDirtyGuard: CanDeactivateFn<CanComponentDeactivate> = (
  component: CanComponentDeactivate
) => {
  if (!component || typeof component.hasUnsavedChanges !== 'function') {
    return true;
  }
  if (component.hasUnsavedChanges()) {
    return confirm('Tienes cambios sin guardar. ¿Deseas salir?');
  }
  return true;
};
