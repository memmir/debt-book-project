import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {BorcDialogComponent} from "../dialogs/borc-dialog/borc-dialog.component";
import {FsApiService} from "../../services/fs-api.service";
import {ActivatedRoute} from "@angular/router";
import {Borc} from "../../models/Borc";
import {Customer} from "../../models/Customer";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-borclar',
  templateUrl: './borclar.component.html',
  styleUrls: ['./borclar.component.css']
})
export class BorclarComponent implements OnInit {

  dataSource:any;
  displayedColumns = ['Description', 'BorcAmount', 'Calculations']
  dialogRef?: MatDialogRef<BorcDialogComponent>
  customerId!:string
  borclar!:Borc[];
  customer: Customer = new Customer();

  constructor(
    private matDialog:MatDialog,
    private afs: FsApiService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.customerId = this.route.snapshot.params['CustomerId']
  }

  BorcByCustomer() {
    this.afs.borcByCustomerId(this.customerId).subscribe((data: any) => {
      this.borclar = data.map((a: { payload: { doc: { id: any; data: () => Borc; }; }; }) => {
        const borcData = a.payload.doc.data() as Borc;
        return {
          ...borcData,  // Diğer tüm borç verilerini buradan alıyoruz
          BorcId: a.payload.doc.id  // BorcId'yi manuel olarak ekliyoruz
        };
      });
      this.dataSource = new MatTableDataSource(this.borclar);
    });
  }

}
