import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  imgToSave: File;
  public imagePath: any;
  imgURL: any;
  public message: string;
  mediatimestamp: Date;

  constructor(private route: ActivatedRoute, private client: HttpClient) {}

  ngOnInit() {
    this.equipmentno = this.route.snapshot.paramMap.get('equipmentno')!;
    this.eventid = this.route.snapshot.paramMap.get('eventid')!;
    this.timestamp = this.route.snapshot.paramMap.get('timestamp')!;
    this.name = this.route.snapshot.paramMap.get('name')!;
    this.surname = this.route.snapshot.paramMap.get('surname')!;
  }  

  
 
  preview(files:any) {
    if (files.length === 0)
      return;
 
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }
    
      const fileInput = document.getElementById("captureimg") as HTMLInputElement;
      const file = fileInput.files!.item(0)!;
    
      if (file.type !== "image/jpeg" && file.type !== "image/png" && file.type !== "image/jpg") {
        alert("Nur die gängigen Fotoformate (jpeg, png und jpg) sind zulässig.");
        return;
      }
      //Variable, die den TimeStamp zwischenspeichert
      this.mediatimestamp = new Date();
      //alert(this.mediatimestamp);
      
      if (file.size > 5 * 1024 * 1024) {
        alert("Das Foto darf nicht größer als 5 MB sein.");
        return;
      }
      
      this.imgToSave = file;

      const formData = new FormData();
      formData.append("photo", file);
    
      // fetch("/upload", {
      //   method: "POST",
      //   body: formData
      // })
      // .then(response => {
      //   if (response.ok) {
      //     alert("Das Foto wurde erfolgreich hochgeladen.");
      //   } else {
      //     alert("Beim Hochladen des Fotos ist ein Fehler aufgetreten.");
      //   }
      // })
      // .catch(error => {
      //   alert("Beim Hochladen des Fotos ist ein Fehler aufgetreten.");
      // });
    
 
    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
      this.imgURL = reader.result; 
      const imageData = reader.result!.toString();

    }
  }


    OnSubmit() {

    const options = {
      headers: new HttpHeaders().append('Content-Type', 'multipart/form-data')
    }

    let formData = new FormData();
    formData.append('file', this.imgToSave);

    this.client.post('http://141.60.168.225:3000/postdtcMessage/' , formData, options)
      .subscribe(data => {
          alert("Das Bild wurde erfolgreich gespeichert: " + this.imgToSave.name)

          console.log("Post call successful value returned in body", data);
        }, 

        response => {
          console.log("Post call in error", response);
        })
        
        // () => {
        //   console.log("The post observable is now completed");
        // })
  }

  deleteImage() {
    this.imgURL = null; // or this.imgURL = undefined;
    this.imagePath = null; // or this.imagePath = undefined;
  }

}