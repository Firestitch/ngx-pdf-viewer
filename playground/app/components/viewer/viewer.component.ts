import { ChangeDetectionStrategy, Component } from '@angular/core';


@Component({
  selector: 'app-viewer',
  templateUrl: 'viewer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewerComponent {

  public pdf = '/assets/0706jpeg2000king.pdf';
}
