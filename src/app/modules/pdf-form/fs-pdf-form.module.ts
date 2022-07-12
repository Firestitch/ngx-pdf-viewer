import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSidenavModule } from '@angular/material/sidenav';


import { FsMaskModule } from '@firestitch/mask';
import { FsDatePickerModule } from '@firestitch/datepicker';

import { FsPdfFormComponent } from './components/pdf-form/pdf-form.component';
import { FsPdfViewerModule } from '../pdf-viewer/fs-pdf-viewer.module';
import { FieldComponent } from './components/field';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSidenavModule,
    
    FsPdfViewerModule,   
    FsMaskModule,
    FsDatePickerModule,
  ],
  exports: [
    FsPdfFormComponent,
  ],
  declarations: [
    FieldComponent,
    FsPdfFormComponent,
  ]
})
export class FsPdfFormModule {
}
