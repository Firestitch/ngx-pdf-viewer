import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { FsPdfViewerComponent } from './components/pdf-viewer/pdf-viewer.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    MatProgressSpinnerModule,

    NgxExtendedPdfViewerModule,
  ],
  exports: [
    FsPdfViewerComponent,
  ],
  declarations: [
    FsPdfViewerComponent,
  ]
})
export class FsPdfViewerModule {

}
