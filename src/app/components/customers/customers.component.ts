import { Component, OnInit } from '@angular/core';
import {FsApiService} from "../../services/fs-api.service";
import {Customer} from "../../models/Customer";
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {CustomerDialogComponent} from "../dialogs/customer-dialog/customer-dialog.component";

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {

  customers?: Customer[];

  dataSource:any;
  displayedColumns = ['CustomerName', 'CustomerPhone', 'Calculations']


  dialogRef?: MatDialogRef<CustomerDialogComponent>;

  constructor(
    private afs: FsApiService,
    private matDialog:MatDialog
  ) { }

  ngOnInit(): void {
  }

  GetAllCustomers(): void {
    this.afs.getAllCustomers().subscribe((data:any)=>{
      this.customers = data.map((a: { payload: { doc: { id: any; data: () => Customer; }; }; })=>{
        return{
          CustomerId:a.payload.doc.id,
          ...a.payload.doc.data()
        }as Customer
      })
      this.dataSource = new MatTableDataSource(this.customers);
    })
  }

  CreateCustomer(){
    this.dialogRef = this.matDialog.open(CustomerDialogComponent,{
      width: "500px",
      data:{
        islem:"Create"
      }
    })
  }

}
