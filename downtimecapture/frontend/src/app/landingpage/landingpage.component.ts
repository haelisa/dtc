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
  public imagePath: any;
  imgURL: any;
  public message: string;
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
 
    //Prüfen ob Datei in Varibale abgespeichert wurde und es ein Bild ist 
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";    
      break preview;  
    }    

    //HTML-Input-Elemente aufrufen
      const fileInput = document.getElementById("captureimg") as HTMLInputElement;
      const file = fileInput.files!.item(0)!;
    
      //Nur gängige Formate erlaubt
      if (file.type !== "image/jpeg" && file.type !== "image/png" && file.type !== "image/jpg") {
        alert("Only common photo formats (jpeg, png and jpg) are allowed.");
        break preview;
      }

      //Variable, die den TimeStamp zwischenspeichert
      this.mediatimestamp = new Date().toString();
      //alert(this.mediatimestamp); //Auskommentieren zum testen und bei deleteImage auch
      
      //Foto kleiner als 5MB
      if (file.size > 5 * 1024 * 1024) {
        alert("The photo must not be larger than 5 MB.");
        break preview;
      }
      
      
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
    this.imagePath = files;
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
    this.imagePath = null;

    const fileInput = document.getElementById("captureimg") as HTMLInputElement;
    if (fileInput) {
        fileInput.value = ""; //Foto aus Frontend löschen
    }

    this.mediatimestamp= ''; //Foto Zeitstempel löschen

    const commentInput = document.getElementById("commentdtc") as HTMLInputElement;
    if (commentInput) {
        commentInput.value = ""; //Kommentarfeld löschen
    }

    this.charCount = 0; //Kommentar Anzahl Zähler auf '0'
    
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

