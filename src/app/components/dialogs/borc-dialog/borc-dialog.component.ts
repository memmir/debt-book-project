import {Component, Inject, OnInit} from '@angular/core';
import {Borc} from "../../../models/Borc";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-borc-dialog',
  templateUrl: './borc-dialog.component.html',
  styleUrls: ['./borc-dialog.component.css']
})
export class BorcDialogComponent implements OnInit {

  yeniKayit!:Borc

  Baslik?: string

  form!:FormGroup // 1)))) burada bir form tanımladık bu form u html dosyasında kullanacağız.

  constructor(
    public dialogRef:MatDialogRef<BorcDialogComponent>,
    public formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    if(data.islem=="Ekle"){
      this.yeniKayit = new Borc()
    }else{
      this.yeniKayit = data.kayit
    }
  }

  ngOnInit(): void {
    this.Baslik=this.data.islem
    this.form = this.CreateForm()
  }

  CreateForm(){
    return this.formBuilder.group({
      BorcId:[this.yeniKayit.BorcId],
      MusteriId:[this.yeniKayit.MusteriId],
      Description:[this.yeniKayit.Description],
      BorcTutari:[this.yeniKayit.BorcTutari]

    })
  }

}
