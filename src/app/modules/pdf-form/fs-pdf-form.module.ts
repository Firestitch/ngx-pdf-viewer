import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSidenavModule } from '@angular/material/sidenav';


import { FsMaskModule } from '@firestitch/mask';
import { FsFormModule } from '@firestitch/form';
import { FsCommonModule } from '@firestitch/common';
import { FsDatePickerModule } from '@firestitch/datepicker';
import { FsDateModule } from '@firestitch/date';

import { FsPdfFormComponent } from './components/pdf-form/pdf-form.component';
import { FsPdfViewerModule } from '../pdf-viewer/fs-pdf-viewer.module';
import { FieldComponent } from './components/field';
import { FieldInputComponent } from './components';
import { MatProgressBarModule } from '@angular/material/progress-bar';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatProgressBarModule,

    FsFormModule,
    FsCommonModule,
    FsPdfViewerModule,   
    FsMaskModule,
    FsDatePickerModule,
    FsDateModule,
  ],
  exports: [
    FsPdfFormComponent,
  ],
  declarations: [
    FieldComponent,
    FieldInputComponent,
    FsPdfFormComponent,
  ]
})
export class FsPdfFormModule {
}
