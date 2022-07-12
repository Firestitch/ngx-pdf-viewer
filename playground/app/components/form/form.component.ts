import { DomPortalOutlet } from '@angular/cdk/portal';
import { ApplicationRef, ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, Injector } from '@angular/core';
import { ComponentPortal } from 'ngx-toastr';


@Component({
  selector: 'app-form',
  templateUrl: 'form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent {


  public pdf = '/assets/td1-fill-22e1.pdf';

  
}
