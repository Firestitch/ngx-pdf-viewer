import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { FsApi } from '@firestitch/api';


@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewerComponent implements OnInit {

  public pdf;
  public blob: Blob;

  constructor(
    private _api: FsApi,
    private _cdRef: ChangeDetectorRef,
  ) { }

  public ngOnInit(): void {
    this.load();
    setTimeout(() => {
      this.load();
    }, 2000);
  }

  public inited(): void {
    console.log('inited');
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
