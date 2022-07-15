import { ChangeDetectionStrategy, Component } from '@angular/core';


@Component({
  selector: 'app-form',
  templateUrl: 'form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent {

  //https://www.ilovepdf.com/unlock_pdf
  public pdf = '/assets/td1-fill-22e2.pdf';
  public fields = [
    { name: 'lastName', value: 'Doe', },
    { name: 'firstName', value: 'John', }
  ];
  public actions = [
    { 
      label: 'Save for later', 
      click: () => { 
        console.log('Saved for later');
      } 
    },
  ];

  public finish(): void {
    console.log('Finsihed');
  }

  public close(): void {
    console.log('Closed');
  }

  public start(): void {
    console.log('Started');
  }
  
}
