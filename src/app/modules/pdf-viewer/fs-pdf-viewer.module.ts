import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { FsPdfViewerComponent } from './components/pdf-viewer/pdf-viewer.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    
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
