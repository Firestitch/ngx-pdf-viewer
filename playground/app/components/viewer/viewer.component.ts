import { ChangeDetectionStrategy, Component } from '@angular/core';


@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewerComponent {

  public pdf = '/assets/b4564c29704094e3029bd9ba480486fd.pdf';
}
