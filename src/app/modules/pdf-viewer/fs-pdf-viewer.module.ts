import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PdfViewerModule } from 'ng2-pdf-viewer';

import { FsPdfViewerComponent } from './components/pdf-viewer/pdf-viewer.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,

    PdfViewerModule,
  ],
  exports: [
    FsPdfViewerComponent,
  ],
  declarations: [
    FsPdfViewerComponent,
  ],
})
export class FsPdfViewerModule {

}
