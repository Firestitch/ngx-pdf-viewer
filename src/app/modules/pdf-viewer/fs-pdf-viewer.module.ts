import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FsPdfViewerComponent } from './components/pdf-viewer/pdf-viewer.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,

    NgxExtendedPdfViewerModule,
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
