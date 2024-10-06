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



  constructor(
    private afs: FsApiService,
  ) { }

  ngOnInit(): void {
  }

  GetAllCustomers(): void {
    this.afs.getAllCustomers().subscribe((data:any)=>{
      this.customers = data.map(a=>{
        return{
          CustomerId:a.payload.doc.id,
          ...a.payload.doc.data()
        }as Customer
      })
      this.dataSource = new MatTableDataSource(this.customers);
    })
  }

}
