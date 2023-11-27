import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { PrintService } from 'src/app/service/print/print.service';

@Component({
  selector: 'app-printf',
  templateUrl: './printf.component.html',
  styleUrls: ['./printf.component.scss'],
})
export class PrintfComponent implements OnInit {
  salesUnit: any;
  oldForm: any;
  public myContentPreview: SafeHtml;
  constructor(
    private _printService: PrintService,
    private sanitizer: DomSanitizer
  ) {
    this._printService.GetOneRecord(`1`).subscribe((res) => {
      if (res.status == true) {
        this.oldForm = res.payload.form;
        this.myContentPreview = this.getSafeHtml(this.oldForm);
        // console.log(this.oldForm);
      }
    });
  }
  getSafeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  ngOnInit(): void {
    this.salesUnit = [
      {
        id: 0,
        name: 'Đơn bán hàng',
      },
    ];
  }
}
