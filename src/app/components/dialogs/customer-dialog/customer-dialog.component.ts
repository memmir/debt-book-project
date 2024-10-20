import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Customer} from "../../../models/Customer";

@Component({
  selector: 'app-customer-dialog',
  templateUrl: './customer-dialog.component.html',
  styleUrls: ['./customer-dialog.component.css']
})
export class CustomerDialogComponent implements OnInit {

  Baslik?:string;
  form?:FormGroup;

  customerRecord!:Customer;

  constructor(
    public formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CustomerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    if(this.data.islem=="Create"){
      this.customerRecord = new Customer();
    }
  }

  ngOnInit(): void {
    this.Baslik = this.data.islem
    this.form = this.createForm();
  }

  createForm(){
    return this.formBuilder.group({
      CustomerId:[this.customerRecord.CustomerId],
      CustomerName:[this.customerRecord.CustomerName],
      CustomerAddress:[this.customerRecord.CustomerAddress],
      CustomerPhone:[this.customerRecord.CustomerPhone],
    })
  }

}
