import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';

import { FsApi } from '@firestitch/api';
import { FsPdfViewerComponent } from '../../../../src/app/modules/pdf-viewer/components/pdf-viewer/pdf-viewer.component';


@Component({
    selector: 'app-viewer',
    templateUrl: './viewer.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [FsPdfViewerComponent],
})
export class ViewerComponent implements OnInit {
  private _api = inject(FsApi);
  private _cdRef = inject(ChangeDetectorRef);


  public pdf;
  public blob: Blob;

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
