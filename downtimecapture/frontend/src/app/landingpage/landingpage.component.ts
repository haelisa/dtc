import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.css']
})
export class LandingpageComponent implements OnInit{

  equipmentno: string;
  eventid: string;
  timestamp: string;
  name: string;
  surname: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.equipmentno = this.route.snapshot.paramMap.get('equipmentno')!;
    this.eventid = this.route.snapshot.paramMap.get('eventid')!;
    this.timestamp = this.route.snapshot.paramMap.get('timestamp')!;
    this.name = this.route.snapshot.paramMap.get('name')!;
    this.surname = this.route.snapshot.paramMap.get('surname')!;
    this.registerUploadButtonClickListener();

  }




  public imagePath: any;
  imgURL: any;
  public message: string;
 
  preview(files:any) {
    if (files.length === 0)
      return;
 
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }
 
    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
      this.imgURL = reader.result; 
    }
  }
  registerUploadButtonClickListener() {
    document.getElementById("upload-button")!.addEventListener("click", () => {
      const fileInput = document.getElementById("captureimg") as HTMLInputElement;
      const file = fileInput.files!.item(0)!;
    
      if (file.type !== "image/jpeg" && file.type !== "image/png" && file.type !== "image/jpg") {
        alert("Nur die gängigen Fotoformate (jpeg, png und jpg) sind zulässig.");
        return;
      }
    
      if (file.size > 5 * 1024 * 1024) {
        alert("Das Foto darf nicht größer als 5 MB sein.");
        return;
      }
    
      const formData = new FormData();
      formData.append("photo", file);
    
      fetch("/upload", {
        method: "POST",
        body: formData
      })
      .then(response => {
        if (response.ok) {
          alert("Das Foto wurde erfolgreich hochgeladen.");
        } else {
          alert("Beim Hochladen des Fotos ist ein Fehler aufgetreten.");
        }
      })
      .catch(error => {
        alert("Beim Hochladen des Fotos ist ein Fehler aufgetreten.");
      });
    });
  }
}