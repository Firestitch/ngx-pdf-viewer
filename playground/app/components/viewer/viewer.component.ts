import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { FsApi } from '@firestitch/api';


@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewerComponent implements OnInit {

  public pdf = '/assets/b4564c29704094e3029bd9ba480486fd.pdf';
  public blob: Blob;

  constructor(
    private _api: FsApi,
    private _cdRef: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    this.load(); 
    setTimeout(() => {
      this.load(); 
    }, 2000);
  }

  public load(): void {
    this._api.createApiFile(`${window.location.href}assets/file-sample_150kB.pdf`)
      .blob
      .subscribe((blob) => {
        this.blob = blob;
        this._cdRef.markForCheck();
      });

  }

}
