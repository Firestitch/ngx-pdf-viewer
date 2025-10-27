import { ChangeDetectionStrategy, Component } from '@angular/core';

import { environment } from '@env';
import { FsExampleModule } from '@firestitch/example';
import { ViewerComponent } from '../viewer/viewer.component';

@Component({
    templateUrl: './examples.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [FsExampleModule, ViewerComponent],
})
export class ExamplesComponent {
  public config = environment;
}
