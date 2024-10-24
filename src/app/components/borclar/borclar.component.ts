import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {BorcDialogComponent} from "../dialogs/borc-dialog/borc-dialog.component";
import {FsApiService} from "../../services/fs-api.service";
import {ActivatedRoute} from "@angular/router";
import {Borc} from "../../models/Borc";
import {Customer} from "../../models/Customer";
import {MatTableDataSource} from "@angular/material/table";
import {ConfirmDialogComponent} from "../dialogs/confirm-dialog/confirm-dialog.component";

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
  borclar?:Borc[] = [];
  customer: Customer = new Customer();
  confirmDialogRef?:MatDialogRef<ConfirmDialogComponent>

  constructor(
    private matDialog:MatDialog,
    private afs: FsApiService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.customerId = this.route.snapshot.params['CustomerId']
    this.BorcByCustomer()
    this.GetCustomer()
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

  GetCustomer(){
    // this.afs.getCustomerById(this.customerId).subscribe((data: Customer)=>{ // todo bug var
    //   this.customer=data
    // })

    this.afs.getCustomerById(this.customerId).subscribe((snapshot: any) => {
      const customerData = snapshot.payload.data() as Customer;
      this.customer = {
        ...customerData,
        CustomerId: snapshot.payload.id  // CustomerId'yi de manuel olarak ekleyin
      };
    });
  }

  CreateBorc(){
    this.dialogRef = this.matDialog.open(BorcDialogComponent, {
      width: "400px",
      data:{
        islem:"Ekle"
      }
    })
    this.dialogRef.afterClosed().subscribe((data:Borc)=>{
      if (data){
        data.MusteriId = this.customerId
        this.afs.createBorc(data).then(e=>{
          this.BorcByCustomer()
        })
      }
    })
  }

  EditBorc(borc:Borc){
    this.dialogRef = this.matDialog.open(BorcDialogComponent,{
      width:"400px",
      data:{
        islem: "Duzenle",
        kayit:borc
      }
    })
    this.dialogRef.afterClosed().subscribe((data:Borc) =>{
      if(data){
        this.afs.updateBorc(data).then(e=>{
          this.BorcByCustomer()
      })
      }
    })
  }
DeleteBorc(borcId:string){
    this.confirmDialogRef = this.matDialog.open(ConfirmDialogComponent,{
      width:"300px",
      data: "borc silinsin mi?"
    })
  this.confirmDialogRef.afterClosed().subscribe((data:Boolean)=>{
    if(data==true){
      this.afs.deleteBorc(borcId).then(e=>{
        this.BorcByCustomer()
      })
    }
  })


}

}
