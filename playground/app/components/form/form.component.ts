import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Field, FieldType } from '@firestitch/pdf';
import { PdfField } from 'src/app/modules/pdf-form/interfaces';


@Component({
  selector: 'app-form',
  templateUrl: 'form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent {

  //https://www.ilovepdf.com/unlock_pdf
  public pdf = '/assets/b4564c29704094e3029bd9ba480486fd.pdf';
  public fields: PdfField[] = [
    { guid: 'ffk47l', type: FieldType.ShortText, name: 'lastName', value: 'Doe', label: 'Last name', description: 'The last name of the person filling out this form' },
    { guid: 'ycg92ylkna6m', name: 'firstName', type: FieldType.ShortText, value: 'John', label: 'First name' },
    { guid: '0w0d6iaegnfo', name: 'date', type: FieldType.Date, value: '', label: 'Date' }
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
