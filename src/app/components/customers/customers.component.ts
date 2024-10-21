import { Component, OnInit } from '@angular/core';
import {FsApiService} from "../../services/fs-api.service";
import {Customer} from "../../models/Customer";
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {CustomerDialogComponent} from "../dialogs/customer-dialog/customer-dialog.component";
import {ConfirmDialogComponent} from "../dialogs/confirm-dialog/confirm-dialog.component";

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
  confirmDialogRef?:MatDialogRef<ConfirmDialogComponent> // 3))))))))))))))))))

  constructor(
    private afs: FsApiService,
    private matDialog:MatDialog
  ) { }

  ngOnInit(): void {
    this.GetAllCustomers(); // Sayfa yüklendiğinde veritabanındaki bütün kayıtları getir dedik.
  }

  // GetAllCustomers(): void {
  //   this.afs.getAllCustomers().subscribe((data:any)=>{
  //     this.customers = data.map((a: { payload: { doc: { id: any; data: () => Customer; }; }; })=>{
  //       return{
  //         CustomerId:a.payload.doc.id,
  //         ...a.payload.doc.data()
  //       }as Customer
  //     })
  //     this.dataSource = new MatTableDataSource(this.customers);
  //   })
  // }

  GetAllCustomers(): void {   //  4)))))))) hatayı çözdük chat gpt ile
    this.afs.getAllCustomers().subscribe((data: any) => {
      this.customers = data.map((a: { payload: { doc: { id: any; data: () => Customer; }; }; }) => {
        const customerData = a.payload.doc.data() as Customer;
        customerData.CustomerId = a.payload.doc.id;  // CustomerId'yi manuel ekliyoruz
        return customerData;
      });
      this.dataSource = new MatTableDataSource(this.customers);
    });
  }
  CreateCustomer(){
    this.dialogRef = this.matDialog.open(CustomerDialogComponent,{
      width: "500px",
      data:{
        islem:"Create"
      }
    })
  this.dialogRef.afterClosed().subscribe((data:Customer)=>{  // 2)) html dosyasından gönderdiğimiz data yı burada yakalayıp veritabanınan gönderiyoruz.
    if(data){  //1)) veri varsa bu işlemi gerçekleştir yoksa yapma şeklinde bir kontrol ekledik.
      this.afs.createCustomer(data).then(e=>{
        this.GetAllCustomers()
      })
    }
  })
  }

  UpdateCustomer(customer:Customer){ // 1)))duzenleme için olan metodunu yazdık.
    this.dialogRef = this.matDialog.open(CustomerDialogComponent,{
      width: "500px",
      data:{
        islem:"Update",
        kayit:customer
      }
    })
    this.dialogRef.afterClosed().subscribe((data:Customer)=>{  // 2)) html dden gönderdiğimiz verileri yakaladık ve veritabanında update işlemini yaptık.
      if(data){
        this.afs.updateCustomer(data).then(e=>{
          this.GetAllCustomers()
        })
      }
    })
  }

  DeleteCustomer(customer:Customer){  // 3))))))))))))
    this.confirmDialogRef = this.matDialog.open(ConfirmDialogComponent,{
      width:"100px",
      data: customer.CustomerName + "Named customer will be delete."
    })
    this.confirmDialogRef.afterClosed().subscribe((data:Boolean)=>{
      if(data == true && customer.CustomerId){ // CustomerId'nin undefined olmadığı kontrol ediliyor
        this.afs.deleteCustomer(customer.CustomerId).then(e=>{
          this.GetAllCustomers()
        })
      }
      else {
        console.error("CustomerId is missing or undefined.");
      }
    })
  }

}
