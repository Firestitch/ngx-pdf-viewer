import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType } from '@firestitch/pdf';
import { PdfField } from 'src/app/modules/pdf-form/interfaces';


@Component({
  selector: 'app-viewer',
  templateUrl: 'viewer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewerComponent {

  public pdf = '/assets/b4564c29704094e3029bd9ba480486fd.pdf';
  public fields: PdfField[] = [
    { 
      guid: 'ffk47l', 
      type: FieldType.ShortText, 
      name: 'lastName', 
      value: 'Doe', 
      label: 'Last name', 
      description: 'The last name of the person filling out this form',
      top: 3,
      left: 3,
      width: 3,
      height: 3
    },
    //{ guid: 'ycg92ylkna6m', name: 'firstName', type: FieldType.ShortText, value: 'John', label: 'First name' },
    //{ guid: '0w0d6iaegnfo', name: 'date', type: FieldType.Date, value: '', label: 'Date' }
  ];
}
