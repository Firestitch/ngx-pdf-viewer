import { ChangeDetectionStrategy, Component } from '@angular/core';


@Component({
  selector: 'app-form',
  templateUrl: 'form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent {


  public pdf = '/assets/td1-fill-22e1.pdf';

  
}
