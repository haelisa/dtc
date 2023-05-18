import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { buffer } from 'rxjs';
import { Media, MediaFormatEnum, MediaTypeEnum } from '../../modules/media.class';
import { MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { ModalComponent } from './modalsuccess/modal.component';
import { EditImageComponent } from './edit-image-modal/edit-image.component';
import { DataUrl, NgxImageCompressService } from 'ngx-image-compress';
import { DomSanitizer } from '@angular/platform-browser';








@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.css'],


})
export class LandingpageComponent implements OnInit{

  //Daten aus QR-Code
  equipmentno: string;
  eventid: string;
  timestamp: string;
  name: string;
  surname: string;
  //Image
  imgToSave: File;
  imgURL: any;
  mediatimestamp: Date;
  comment: string = '';
  mediaType: MediaTypeEnum;
  mediaFormat: MediaFormatEnum;
  mediaObject: Media;
  
  //Data Url to compress
  dataUrl: DataUrl;
  base64 = '';
  dialogRef: MatDialogRef<EditImageComponent>;
  compressedImgURL = '';
  imgResultAfterCompression: string = '';
  

  // Routing + Modal
  constructor(
    private route: ActivatedRoute, 
    private client: HttpClient, 
    private dialog : MatDialog,
    private imageCompress: NgxImageCompressService
    ) {}

  //On Init -> 
  ngOnInit() {
    this.equipmentno = this.route.snapshot.paramMap.get('equipmentno')!;
    this.eventid = this.route.snapshot.paramMap.get('eventid')!;
    this.timestamp = this.route.snapshot.paramMap.get('timestamp')!;
    this.name = this.route.snapshot.paramMap.get('name')!;
    this.surname = this.route.snapshot.paramMap.get('surname')!;    
  }  



  //Compress Image with Size larger than 5 MB
  async compressImage(dataUrl: string){
    alert(dataUrl);
    console.log(this.imageCompress.byteCount(dataUrl));
    // const MAX_MEGABYTE = 2;
    // await this.imageCompress.compressFile(dataUrl, 1, 50, 50,  0, 0).then(result => this.compressedImgURL = result);
    await this.imageCompress
    .compressFile(dataUrl, 1, 50, 50) // 50% ratio, 50% quality
    .then(compressedImage => {
        this.imgResultAfterCompression = compressedImage;
        console.log('Size in bytes after compression is now:', this.imageCompress.byteCount(compressedImage));
    });
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
        this.mediaType = MediaTypeEnum.AUFNAHME;
      } else if (galleryImgInput.files && galleryImgInput.files[0]) {
        file = galleryImgInput.files[0];
        this.mediaType = MediaTypeEnum.GALERIE;  
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
        // alert("The photo must not be larger than 5 MB.");
        // break preview;
        
        
        
        const compressreader = new FileReader();
        compressreader.readAsDataURL(files[0]);
        compressreader.onloadend = () => {
          this.base64 = compressreader.result as string;
          // alert(this.base64);
          this.compressImage(this.base64);
        }
        
        
          
      }

      //Foto nicht älter als 12 Stunden
      const ageInMs = Date.now() - file.lastModified;
      const ageInHours = ageInMs / (1000 * 60 * 60);
      // if (ageInHours > 12) {
      //   alert("The photo must not be older than 12 hours.");
      //   return;
      // }

      //TimeStamp zwischenspeichern
      this.mediatimestamp = new Date(file.lastModified);
      //alert(this.mediatimestamp); //Auskommentieren zum testen und bei deleteImage auch

      
      
      
      
      
      this.imgToSave = file;
      console.log(this.imgToSave.name)
      
      


      // Call Popup to edit img
      // if(this.imgResultAfterCompression != ''){
      //   this.dialogRef = this.dialog.open(EditImageComponent, {
      //     height: '90vh',
      //     width: '100vvw',
      //     data: {
      //       dataUrl: this.imgResultAfterCompression
      //     }
      //   });
      // }else{
        const imgreader = new FileReader();
        imgreader.readAsDataURL(files[0]);
        imgreader.onloadend = () => {
          this.base64 = imgreader.result as string;
          
          this.dialogRef = this.dialog.open(EditImageComponent, {
            height: '90vh',
            width: '100vvw',
            disableClose: true,
            data: {
              dataUrl: this.base64
            }
          });
        }
      // }
      // let dialogRef = this.dialog.open(EditImageComponent, {
      //   height: '90vh',
      //   width: '100vvw',
      //   data: {

      //     //image as DataURl Base64 string
      //     // imgURL: this.imgURL
      //     // data: 
      //     dataUrl: this.base64
      //   }
      // });

//TODO: After  close save edited img
      // this.dialogRef.afterClosed().subscribe(
      //   data => this.imgURL = data
      // );

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
    this.mediatimestamp=  null as unknown as Date;  //Foto Zeitstempel löschen
    
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


  // openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
  //   this.dialog.open(ModalComponent, {
  //     width: '250px',
  //     enterAnimationDuration,
  //     exitAnimationDuration,
  //   });
  // }
  
  async onSubmit(){
      
    //File wird als ArrayBuffer ausgelesen, Blob-Objekt wird erstellt
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
      mediaType: this.mediaType,
      //mediaFormat: this.mediaFormat,
      mediaFile: mediablob
    };

      const ip = window.location.hostname;

      // Nicht mehr notwendig, da Post-Methode createDtm nun das Media abspeichert

      //Post-Methode um das Media ins Backend zu schicken
      // this.client.post(`http://${ip}:3000/media/setMedia`, requestDataMedia).subscribe(() => {
      // console.log('Media saved successfully.' + '\n' + this.imgToSave.name + ',\n' + this.mediatimestamp + '\n');
      // }, (error) => {
      // console.error('Error while saving media:', error);
      // });

      //Media-Objekt erstellen, um es in die Post-Methode der Downtime-Message zu übergeben
      this.mediaObject = new Media();
      this.mediaObject.mediaName = this.imgToSave.name;
      this.mediaObject.mediaTimeStamp = this.mediatimestamp;
      this.mediaObject.MediaType = this.mediaType;
      this.mediaObject.MediaFormat = this.mediaFormat;
      // this.mediaObject.mediaFile = mediablob;
      this.mediaObject.mediaFile = this.base64;


      const requestDataDtm = {
        dtmComment: this.comment,
        dtmTimeStamp: this.timestamp,
        dtmEquipmentNo: this.equipmentno,
        dtmEventid: this.eventid,
        dtmName: this.name,
        dtmSurname: this.surname,
        mediaObject: this.mediaObject
      };

      //Unix-Epoch Number zu Date parsen, Beispiel: von 1620980318 zu 2021-05-14T10:05:18.000Z
      //const dtcDate = new Date(parseInt(this.timestamp) * 1000)

      //Post-Methode um die Downtime-Message ins Backend zu schicken
      this.client.post(`http://${ip}:3000/dtm/createDtm`, requestDataDtm).subscribe(() => {

        //Open Modal for send successful
        console.log('Downtime-Message saved successfully.');
        // alert('Downtime-Message saved successfully.' + '\n' + 'MediaType: ' + this.mediaType );
        let dialogRef = this.dialog.open(ModalComponent,  { disableClose: true });
      }, (error) => {
        console.error('Error while saving Downtime-Message:', error);
      });
        

  }

}