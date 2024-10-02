import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Customer} from "../models/Customer";

@Injectable({
  providedIn: 'root'
})
export class FsApiService {

  constructor(
    private afs:AngularFirestore
  ) { }

  getAllCustomers(){
    return this.afs.collection('customers').snapshotChanges()  // liste getirileceği zaman snapshotChanges kullanıldı.
  }

  getCustomerById(customerId:string){
    return this.afs.collection('customers').doc(customerId).valueChanges()  //veri tek olarak getirileceği zaman valueChanges kullandık.
  }

  createCustomer(customer:Customer){
    delete customer.CustomerId;
    return this.afs.collection('customers').add(customer)
  }

  updateCustomer(customer:Customer){
    return this.afs.collection('customers').doc(customer.CustomerId).update(customer)
  }

  deleteCustomer(customerId:string){
    return this.afs.collection('customers').doc(customerId).delete()
  }
}
