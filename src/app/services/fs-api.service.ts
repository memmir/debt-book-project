import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Customer} from "../models/Customer";
import {Borc} from "../models/Borc";

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

  borcByCustomerId(customerId:string){
    return this.afs.collection('borclar', q=>q.where('CustomerId', '==', customerId)).snapshotChanges() // burada sorgu yazdık q=>q ve devamı sorgu.
  }

  createBorc(borc:Borc){
    // @ts-ignore
    delete borc.BorcId // todo hata vardı @ts-ignore ile çözüdlü tekrar bakılacak.
    return this.afs.collection('borclar').add(borc)
  }

  updateBorc(borc:Borc){
    return this.afs.collection('borclar').doc(borc.BorcId).update(borc)
  }

  deleteBorc(borcId:string){
    return this.afs.collection('borclar').doc(borcId).delete()
  }
}
