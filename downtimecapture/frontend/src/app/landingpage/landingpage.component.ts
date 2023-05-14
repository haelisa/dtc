import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { buffer } from 'rxjs';


@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.css'],
  

})
export class LandingpageComponent implements OnInit{

  equipmentno: string;
  eventid: string;
  timestamp: string;
  name: string;
  surname: string;
  imgToSave: File;
  imgURL: any;
  mediatimestamp: string;
  comment: string = '';


  constructor(private route: ActivatedRoute, private client: HttpClient) {}

  ngOnInit() {
    this.equipmentno = this.route.snapshot.paramMap.get('equipmentno')!;
    this.eventid = this.route.snapshot.paramMap.get('eventid')!;
    this.timestamp = this.route.snapshot.paramMap.get('timestamp')!;
    this.name = this.route.snapshot.paramMap.get('name')!;
    this.surname = this.route.snapshot.paramMap.get('surname')!;
  }  

 //Foto aufnehmen, Foto Zeitstempel sowie Name übergeben
  preview(files:any) {
    preview: {
    if (files.length === 0)
      return;
 
    //Prüfen ob Datei in Variable abgespeichert wurde und es ein Bild ist 
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      alert("Only images are supported.");
      break preview;  
    }    

    //HTML-Input-Elemente aufrufen
    const captureImgInput = document.getElementById("captureimg") as HTMLInputElement;
    const galleryImgInput = document.getElementById("galleryimg") as HTMLInputElement;
    
    let file: File | null = null;

    if (captureImgInput.files && captureImgInput.files[0]) {
    file = captureImgInput.files[0];
    } else if (galleryImgInput.files && galleryImgInput.files[0]) {
    file = galleryImgInput.files[0];
    }
    
    if (!file) {
      break preview;
    }
    
    //Nur gängige Formate erlaubt
    if (file.type !== "image/jpeg" && file.type !== "image/png" && file.type !== "image/jpg") {
      alert("Only common photo formats (jpeg, png and jpg) are allowed.");
      break preview;
    }
      
    //Foto kleiner als 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert("The photo must not be larger than 5 MB.");
      break preview;
    }

    //Foto nicht älter als 12 Stunden
    const ageInMs = Date.now() - file.lastModified;
    const ageInHours = ageInMs / (1000 * 60 * 60);
    if (ageInHours > 12) {
    alert("The photo must not be older than 12 hours.");
    return;
    }

    //TimeStamp zwischenspeichern
    this.mediatimestamp = new Date(file.lastModified).toString();
    //alert(this.mediatimestamp); //Auskommentieren zum testen und bei deleteImage auch
      

    this.imgToSave = file;
    console.log(this.imgToSave.name)

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
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
    this.imgURL = reader.result;
    const imageData = reader.result!.toString();

    }
  }
  }

  // Löschen Button: Foto Preview, Foto Zeitstempel, Kommentarinhalt
  deleteImage() {
    
    this.imgURL = null;

    //Foto löschen
    const inputs = ["captureimg", "galleryimg"];
    inputs.forEach((input) => {
      const element = document.getElementById(input) as HTMLInputElement;
      if (element) {
        element.value = "";
      }
    });

    this.comment = '';        //Kommentar löschen
    this.charCount = 0;       //Kommentarzeichen Anzahl Zähler auf '0'
    this.mediatimestamp= '';  //Foto Zeitstempel löschen
    
    console.log('Media deleted successfully.')
    //alert(this.mediatimestamp); //Bei MediaTimeStamp auch auskommentieren zum testen
  }

  //Kommentar Maximale Zeichenanzahl und Popup
  charCount: number = 0;
  
  updateCharCount(event: any) {
    const input = event.target.value;
    if (input.length > 300) {
      event.target.value = input.substring(0, 300);
      this.charCount = 300;
      alert('Limit of 300 characters has been exceeded');
    } else {
      this.charCount = input.length;
    }
  }
  
  async onSubmit(){
    // const formData = new FormData();
    // formData.append('mediaName', this.imgToSave.name)
    // formData.append('mediaTimeStamp', this.mediatimestamp);
      

    const buffer = await new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(this.imgToSave);
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = reject;
    });

    var mediablob = (new Blob([buffer],{ type: this.imgToSave.type }), this.imgToSave.name);
    const requestDataMedia = {
      mediaName: this.imgToSave.name,
      mediaTimeStamp: this.mediatimestamp,
      mediaFile: mediablob
    };

    // const reader = new FileReader();
    // reader.readAsArrayBuffer(this.imgToSave)
    // reader.onload = () => {
    //   const buffer = reader.result as ArrayBuffer
      //formData.append('mediaFile', new Blob([buffer],{ type: this.imgToSave.type }), this.imgToSave.name);

      const ip = window.location.hostname;

      this.client.post(`http://${ip}:3000/media/setMedia`, requestDataMedia).subscribe(() => {
      console.log('Media saved successfully.' + '\n' + this.imgToSave.name + ',\n' + this.mediatimestamp + '\n');
      }, (error) => {
      console.error('Error while saving media:', error);
      });

      const requestDataDtm = {
        dtmComment: this.comment,
        dtmTimeStamp: this.timestamp,
        dtmEquipmentNo: this.equipmentno,
        dtmEventid: this.eventid,
        dtmName: this.name,
        dtmSurname: this.surname
      };

      this.client.post(`http://${ip}:3000/dtm/createDtm`, requestDataDtm).subscribe(() => {
        console.log('Downtime-Message saved successfully.');
        alert('Downtime-Message saved successfully.' + '\n' + 'Timestamp: ' + this.timestamp)
        }, (error) => {
        console.error('Error while saving Downtime-Message:', error);
        });


    
    

    // this.client.post('http://192.168.178.103:3000/media/media', formData).subscribe(() => {
    // console.log('Media saved successfully.');
    // }, (error) => {
    // console.error('Error while saving media:', error);
    // });
  }

}