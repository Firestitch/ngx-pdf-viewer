import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FsExampleModule } from '@firestitch/example';
import { FsMessageModule } from '@firestitch/message';
import { FsPdfViewerModule } from '@firestitch/pdf';
import { FsDatePickerModule } from '@firestitch/datepicker';

import { ToastrModule } from 'ngx-toastr';
import { AppMaterialModule } from './material.module';
import {
  ExamplesComponent,
  FormComponent,
  ViewerComponent,
} from './components';
import { AppComponent } from './app.component';
import { FsPdfFormModule } from 'src/app/modules/pdf-form/fs-pdf-form.module';

const routes: Routes = [
  { path: '', component: ExamplesComponent },
];


@NgModule({
  bootstrap: [ AppComponent ],
  imports: [
    BrowserModule,
    FsPdfViewerModule,
    FsPdfFormModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    FormsModule,
    FsDatePickerModule.forRoot(),
    FsExampleModule.forRoot(),
    FsMessageModule.forRoot(),
    ToastrModule.forRoot({ preventDuplicates: true }),
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
  ],
  entryComponents: [
  ],
  declarations: [
    AppComponent,
    ExamplesComponent,
    ViewerComponent,
    FormComponent,
  ],
})
export class PlaygroundModule {
}
