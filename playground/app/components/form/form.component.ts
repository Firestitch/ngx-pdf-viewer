import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType } from '@firestitch/pdf';
import { PdfField } from 'src/app/modules/pdf-form/interfaces';


@Component({
  selector: 'app-form',
  templateUrl: 'form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent {

  //https://www.ilovepdf.com/unlock_pdf
  public pdf = '/assets/td1-fill-22e2 (7).pdf';
  public fields: any[]= [{"configs":{"shapeTopLeft":"round","shapeTopRight":"round","verticalAlign":"top","horizontalAlign":"left","shapeBottomLeft":"round","shapeBottomRight":"round"},"description":null,"pdfPageId":12,"shapeTopLeft":"round","shapeTopRight":"round","verticalAlign":"top","imageExtension":null,"horizontalAlign":"left","imageModifyDate":null,"shapeBottomLeft":"round","shapeBottomRight":"round","top":9.69,"left":1,"width":4.96,"height":0.35,"type":"signature","guid":"morys5","name":null,"pageNumber":2},
{"configs":{"shapeTopLeft":"round","shapeTopRight":"round","verticalAlign":"top","horizontalAlign":"left","shapeBottomLeft":"round","shapeBottomRight":"round"},"description":null,"pdfPageId":12,"shapeTopLeft":"round","shapeTopRight":"round","verticalAlign":"top","imageExtension":null,"horizontalAlign":"left","imageModifyDate":null,"shapeBottomLeft":"round","shapeBottomRight":"round","top":9.7,"left":6.59,"width":1.49,"height":0.34,"type":"date","guid":"fz2sr5","name":null,"pageNumber":2},
{"label":"Yes","configs":{"shapeTopLeft":"round","shapeTopRight":"round","verticalAlign":"top","horizontalAlign":"left","shapeBottomLeft":"round","shapeBottomRight":"round"},"groupLabel":"Non Residents","description":null,"pdfPageId":12,"shapeTopLeft":"round","shapeTopRight":"round","verticalAlign":"top","imageExtension":null,"horizontalAlign":"left","imageModifyDate":null,"shapeBottomLeft":"round","shapeBottomRight":"round","top":3.33,"left":0.58,"width":0.18,"height":0.17,"type":"radiobutton","guid":"nkd8uh","name":"nonResidents","pageNumber":2},
{"label":"No","configs":{"shapeTopLeft":"round","shapeTopRight":"round","verticalAlign":"top","horizontalAlign":"left","shapeBottomLeft":"round","shapeBottomRight":"round"},"groupLabel":"Non Residents","description":null,"pdfPageId":12,"shapeTopLeft":"round","shapeTopRight":"round","verticalAlign":"top","imageExtension":null,"horizontalAlign":"left","imageModifyDate":null,"shapeBottomLeft":"round","groupDescription":"description","shapeBottomRight":"round","top":3.56,"left":0.58,"width":0.18,"height":0.17,"type":"radiobutton","guid":"gqludi","name":"nonResidents","pageNumber":2},
{"index":3,"label":"saddsadsa","default":345345,"formula":345345,"required":true,"description":null,"shapeTopLeft":"round","shapeTopRight":"round","verticalAlign":"top","horizontalAlign":"left","shapeBottomLeft":"round","shapeBottomRight":"round","top":1.47,"left":3.05,"width":1.33,"height":0.2,"type":"shorttext","guid":"ycg92ylkna6m","name":"firstName","pageNumber":1},
{"index":4,"label":"Date of birth","required":true,"description":null,"shapeTopLeft":"round","shapeTopRight":"round","verticalAlign":"top","horizontalAlign":"left","shapeBottomLeft":"round","shapeBottomRight":"round","top":1.48,"left":4.39,"width":1.58,"height":0.2,"type":"date","guid":"0w0d6iaegnfo","name":null,"pageNumber":1, "format":"yyyy/MM/dd"},
{"index":5,"label":"Employee number","required":true,"description":null,"shapeTopLeft":"round","shapeTopRight":"round","verticalAlign":"top","horizontalAlign":"left","shapeBottomLeft":"round","shapeBottomRight":"round","top":1.49,"left":5.98,"width":2.25,"height":0.2,"type":"shorttext","guid":"ijvl0v6sjnx3","name":"123123123123","pageNumber":1},
{"index":6,"label":"Address","required":true,"description":null,"shapeTopLeft":"round","shapeTopRight":"round","verticalAlign":"top","horizontalAlign":"left","shapeBottomLeft":"round","shapeBottomRight":"round","top":1.84,"left":0.3,"width":3.16,"height":0.27,"type":"shorttext","guid":"6ocmwc1ou4ag","name":null,"pageNumber":1},
{"index":7,"label":"Postal code","description":null,"shapeTopLeft":"round","shapeTopRight":"round","verticalAlign":"top","horizontalAlign":"left","shapeBottomLeft":"round","shapeBottomRight":"round","top":1.83,"left":3.47,"width":0.98,"height":0.25,"type":"shorttext","guid":"t2kabuhft5jf","name":null,"pageNumber":1},
{"index":8,"label":"Country of permanency residence","description":null,"shapeTopLeft":"round","shapeTopRight":"round","verticalAlign":"top","horizontalAlign":"left","shapeBottomLeft":"round","shapeBottomRight":"round","top":1.89,"left":4.44,"width":2.24,"height":0.21,"type":"shorttext","guid":"lhm42kobcu0z","name":null,"pageNumber":1},
{"index":8,"label":"Basic personal amount","default":10,"description":null,"shapeTopLeft":"round","shapeTopRight":"round","verticalAlign":"top","horizontalAlign":"left","shapeBottomLeft":"round","shapeBottomRight":"round","top":2.55,"left":7.11,"width":1.05,"height":0.29,"type":"shorttext","guid":"90gczroidezv","name":"basicPersonalAmount","pageNumber":1},
{"index":11,"label":"asfasdfsdadfgdsfg","default":"sdfsadfssssssssssssssssssssss","formula":"asdfsadf","readonly":false,"required":false,"description":null,"top":1.49,"left":0.31,"width":2.74,"height":0.19,"type":"shorttext","guid":"vmzf6uqyy56p","name":"adfasdfasfdfs","pageNumber":1},
{"index":10,"formula":"basicPersonalAmount + 0","description":null,"shapeTopLeft":"round","shapeTopRight":"round","verticalAlign":"top","horizontalAlign":"left","shapeBottomLeft":"round","shapeBottomRight":"round","top":9.58,"left":7.12,"width":1.01,"height":0.27,"type":"shorttext","guid":"u1plmbvgtx5s","name":"","pageNumber":1, "format":"currency","readonly": true},
{"index":5,"description":null,"shapeTopLeft":"round","shapeTopRight":"round","verticalAlign":"top","horizontalAlign":"left","shapeBottomLeft":"round","shapeBottomRight":"round","top":2.71,"left":0.34,"width":0.16,"height":0.17,"type":"checkbox","guid":"mb8p4gjfj7gq","name":"totalIncome","pageNumber":2}];

  public actions = [
    { 
      label: 'Save for later', 
      click: () => { 
        console.log('Saved for later');
      } 
    },
  ];

  public finish(): void {
    console.log('Finsihed');
  }

  public close(): void {
    console.log('Closed');
  }

  public start(): void {
    console.log('Started');
  }
  
}
