import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { buffer } from 'rxjs';
import { Media, MediaFormatEnum, MediaTypeEnum } from '../../modules/media.class';
import { MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { ModalComponent } from './modalsuccess/modal.component';
import { EditImageComponent } from './edit-image-modal/edit-image.component';
import { DataUrl, NgxImageCompressService } from 'ngx-image-compress';
import axios from 'axios';

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.css'],
})
export class LandingpageComponent implements OnInit{

  //Data from QR-Code
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
    await this.imageCompress
    .compressFile(dataUrl, 1, 50, 50) // 50% ratio, 50% quality
    .then(compressedImage => {
        this.imgResultAfterCompression = compressedImage;
        console.log('Size in bytes after compression is now:', this.imageCompress.byteCount(compressedImage));
    });
  }


 //Take photo, pass photo time stamp as well as name
  preview(files:any) {
    preview: {
      if (files.length === 0)
        return;
  
      //Check if file was saved in variable and it is an image
      var mimeType = files[0].type;
      if (mimeType.match(/image\/*/) == null) {
        alert("Only images are supported.");
        break preview;  
      }    

      //Call HTML-Input-Elements 
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
      
      //Only common formats allowed
      if (file.type !== "image/jpeg" && file.type !== "image/png" && file.type !== "image/jpg") {
        alert("Only common photo formats (jpeg, png and jpg) are allowed.");
        break preview;
      }
        
      //Photo larger than 5MB
      if (file.size > 5 * 1024 * 1024) {

        const compressreader = new FileReader();
        compressreader.readAsDataURL(files[0]);
        compressreader.onloadend = () => {
          this.base64 = compressreader.result as string;
          this.compressImage(this.base64);
        }
        
      }

      //Photo older than 12 hours
      const ageInMs = Date.now() - file.lastModified;
      const ageInHours = ageInMs / (1000 * 60 * 60);
      if (ageInHours > 12) {
        alert("The photo must not be older than 12 hours.");
        return;
      }

      //Cache TimeStamp
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
            height: '100vh',
            maxWidth: '100vw',
            disableClose: true,
            data: {
              dataUrl: this.base64
            }
          });

          this.dialogRef.afterClosed().subscribe(
            data => {
              this.imgURL = data.dataurl;
              this.base64 = data.dataurl;
            }
          );

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

        
      // var reader = new FileReader();
      // reader.readAsDataURL(files[0]); 
      // reader.onload = (_event) => { 
      //   this.imgURL = reader.result;
      //   const imageData = reader.result!.toString();
      // }
    }
  }

  // Delete Button: Photo preview, photo timestamp, comment content
  deleteImage() {
    this.imgURL = null;

    //Delete photo
    const inputs = ["captureimg", "galleryimg"];
    inputs.forEach((input) => {
      const element = document.getElementById(input) as HTMLInputElement;
      if (element) {
        element.value = "";
      }
    });

    this.comment = '';        //Delete comment
    this.charCount = 0;       //Comment character Number of counters set to '0
    this.mediatimestamp=  null as unknown as Date;  //FDelete photo Timestamp
    
    console.log('Media deleted successfully.')
    //alert(this.mediatimestamp); //Bei MediaTimeStamp auch auskommentieren zum testen
  }

  //Comment maximum number of characters and popup
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

  


      /* const eventIds = downtimeMessageArray.map((element) => element.eventId);      

      var check : boolean;

      for (let i = 0; i < downtimeMessageArray.length; i++) {
        const element = downtimeMessageArray[i].getEventID();

        if (element == eventId) {
          // eventID does already exist in the database
        console.log('Event ID exists:', response);
        const sendButton = document.querySelector('#send') as HTMLButtonElement;
        sendButton.disabled = true;
        alert("This eventID already exists in the database. The dowtimecapture-Message can not be saved.");
      }
      else {
        // eventID does not exist in the database
        console.log('Event ID does not exist:', response);
      }
      }


    } catch (error) {
      // Hier kannst du die Fehlerbehandlung durchführen, falls die EventID nicht gefunden wurde
      console.error('Fehler beim Abrufen der Downtime-Nachricht:', error);
    }
  }; */
  
  async onSubmit(){

    //File is read out as ArrayBuffer, Blob object is created
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


      //Create media object to pass into the post method of the downtime message
      this.mediaObject = new Media();
      this.mediaObject.mediaName = this.imgToSave.name;
      this.mediaObject.mediaTimeStamp = this.mediatimestamp;
      this.mediaObject.MediaType = this.mediaType;
      this.mediaObject.MediaFormat = this.mediaFormat;
      // this.mediaObject.mediaFile = mediablob;
      this.mediaObject.mediaFile = this.base64;


      //Get method to get the eventID from backend
        try {
          /* const response = await axios.get(`http://localhost:3000/dtm/event/${this.eventid}`);
          const downtimeMessage = response.data;
          const downtimeMessageArray: any[] = response.data; */

          //eventIdExists = false because of the following if-loops
          let eventIdExists = false;
      /* 
          for (let i = 0; i < downtimeMessageArray.length; i++) {
            const element = downtimeMessageArray[i];

      
            if (element.eventID == this.eventid) {
              eventIdExists = true;
            }
          }
 */

          /* if (eventIdExists==true){
                  const sendButton = document.querySelector('#send') as HTMLButtonElement;
                  sendButton.disabled = true;
                  alert("This eventID already exists in the database. The downtime capture message cannot be saved.");} */
                

           if (eventIdExists == false) {
                    // EventID existiert nicht in der Datenbank
                    // Post method to send the downtime message to the backend
                    const requestDataDtm = {
                      dtmEquipmentNo: this.equipmentno,
                      dtmEventid: this.eventid,
                      dtmName: this.name,
                      dtmSurname: this.surname,
                      dtmComment: this.comment,
                      dtmTimeStamp: this.timestamp,
                      mediaObject: this.mediaObject
                    }

                    this.client.post(`http://${ip}:3000/dtm/createDtm`, requestDataDtm).subscribe(() => {

                      //Open Modal for send successful
                      console.log('Downtime-Message saved successfully.');
                      // alert('Downtime-Message saved successfully.' + '\n' + 'MediaType: ' + this.mediaType );
                      let dialogRef = this.dialog.open(ModalComponent,  { disableClose: true });
                    }, (error) => {
                      const sendButton = document.querySelector('#send') as HTMLButtonElement;
                      sendButton.disabled = true;
                      alert("This eventID already exists in the database. The downtime capture message cannot be saved.");
                
                      console.error('Error while saving Downtime-Message:', error);
                    });
               
            }
            

      } catch (error) {
        // Fehlerbehandlung, falls die EventID nicht gefunden wurde
        console.error('Fehler beim Abrufen der Downtime-Nachricht:', error);
      }
    


       

        /*  this.client.get(`http://${ip}:3000/dtm/event/:eventId`).subscribe(
           (response: any) => {
            if (this.eventid = response){

             // eventID does already exist in the database
             console.log('Event ID exists:', response);
             const sendButton = document.querySelector('#send') as HTMLButtonElement;
             sendButton.disabled = true;
             alert("This eventID already exists in the database. The dowtimecapture-Message can not be saved.");
           }
           else {
             // eventID does not exist in the database
             console.log('Event ID does not exist:', response);
           }
          },
         ); */


      //Parse Unix epoch number to date, example: from 1620980318 to 2021-05-14T10:05:18.000Z
      //const dtcDate = new Date(parseInt(this.timestamp) * 1000)

      //Post method to send the downtime message to the backend
    /*   const requestDataDtm = {
        dtmComment: this.comment,
        dtmTimeStamp: this.timestamp,
        dtmEquipmentNo: this.equipmentno,
        dtmEventid: this.eventid,
        dtmName: this.name,
        dtmSurname: this.surname,
        mediaObject: this.mediaObject
      }

      this.client.post(`http://${ip}:3000/dtm/createDtm`, requestDataDtm).subscribe(() => {

        //Open Modal for send successful
        console.log('Downtime-Message saved successfully.');
        // alert('Downtime-Message saved successfully.' + '\n' + 'MediaType: ' + this.mediaType );
        let dialogRef = this.dialog.open(ModalComponent,  { disableClose: true });
      }, (error) => {
        console.error('Error while saving Downtime-Message:', error);
      }); */

      //Get method to get the eventID from backend
//       const getEventID = {
//         dtmEventid: this.eventid  
//       }
//       this.client.get(`http://${ip}:3000/dtm/eventID`).subscribe((response: any) => {
//         var dtmObject = new DowntimeMessage();
//         dtmObject[] = response;
//         if( = this.eventid)
//         alert()
//       },
//       (error: any) => {
//         console.error(error);() => {
// ;
//       };} )

    }
    
}