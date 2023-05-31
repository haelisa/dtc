import { HttpClient, HttpClientJsonpModule, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { buffer } from 'rxjs';
import { Media, MediaFormatEnum, MediaTypeEnum } from '../../modules/media.class';
import { MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { ModalComponent } from './modalsuccess/modal.component';
import { EditImageComponent } from './edit-image-modal/edit-image.component';
import { DataUrl, NgxImageCompressService } from 'ngx-image-compress';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import axios from 'axios';
import { CanceldtmComponent } from '../canceldtm/canceldtm.component';

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

  //Check EventId to prevent duplicates
  checkEventId: boolean;

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
  originalBase64 = '';
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
    
    const ip = window.location.hostname;

    //Get method to check if the eventID already exisits in database   
    axios.get(`http://${ip}:3000/dtm/checkEventID/${this.eventid}`).then(response =>{
      console.log('Response from Backend, EventID already exists: ' , response.data);
      if(response.data){
        let dialogRef = this.dialog.open(CanceldtmComponent,  { disableClose: true });
      }

      this.checkEventId = response.data
      console.log(this.checkEventId); // this.checkEventId above initialized as boolean, so you can work with it in the whole class
    });

    //Local Storage comment
    const savedComment = localStorage.getItem("landingPageComment");
    this.comment = savedComment ? savedComment : "";

    this.subscribeToCommentChanges();
  }  

  //Method to keep the comment when refreshing the page
  subscribeToCommentChanges() {
    setInterval(() => {
      if (this.comment) {
        localStorage.setItem("landingPageComment", this.comment);
      }
    }, 1000);
  }

  //Compress Image with Size larger than 5 MB
  async compressImage(dataUrl: string){
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
        alert("Only the image formats jpeg, png and jpg are allowed.");
        break preview;  
      }    

      //Call HTML-Input-Elements 
      const captureImgInput = document.getElementById("captureimg") as HTMLInputElement;
      const galeryImgInput = document.getElementById("galeryimg") as HTMLInputElement;
      
      let file: File | null = null;

      if (captureImgInput.files && captureImgInput.files[0]) {
        file = captureImgInput.files[0];
        this.mediaType = MediaTypeEnum.AUFNAHME;
      } else if (galeryImgInput.files && galeryImgInput.files[0]) {
        file = galeryImgInput.files[0];
        this.mediaType = MediaTypeEnum.GALERIE;  
      }
      
      if (!file) {
        break preview;
      }
      
      //Only common formats allowed
      if (file.type !== "image/jpeg" && file.type !== "image/png" && file.type !== "image/jpg") {
        alert("Only the image formats jpeg, png and jpg are allowed.");
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
          this.originalBase64 = this.base64;
          
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
              if(data.dataurl != ''){
                this.imgURL = data.dataurl;
                this.base64 = data.dataurl;
              }else{
                galeryImgInput.value = '';
              }
                
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


  //Edit Button: edit original photo again 
  editImage() {
    const dialogRef = this.dialog.open(EditImageComponent, {
      height: '100vh',
      maxWidth: '100vw',
      disableClose: true,
      data: {
        dataUrl: this.originalBase64
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.dataurl !== '') {
          this.imgURL = data.dataurl;
          this.base64 = data.dataurl;
      }
    });
  }


  // Delete Button: Photo preview, photo timestamp, comment content
  deleteImage() {
    const confirmation = confirm("Do you want to delete the photo?");

    if (confirmation) {
      this.imgURL = null;

      //Delete photo
      const inputs = ["captureimg", "galeryimg"];
      inputs.forEach((input) => {
        const element = document.getElementById(input) as HTMLInputElement;
        if (element) {
          element.value = "";
        }
      });

      this.mediatimestamp=  null as unknown as Date;  //Delete photo Timestamp
    
      console.log('Media deleted successfully.')
    }
  }


  //Comment maximum number of characters and popup
  charCount: number = 0;
  
  updateCharCount(event: any) {
    const input = event.target.value;
    const textarea = document.getElementById('commentfield') as HTMLTextAreaElement;
      if (input.length > 300) {
      event.target.value = input.substring(0, 300);
      this.charCount = 300;
      alert('Limit of 300 characters has been exceeded');
      textarea.scrollTop = 0;
      textarea.selectionStart = 0;
      textarea.selectionEnd = 0;

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


      //Parse Unix epoch number to date, example: from 1620980318 to 2021-05-14T10:05:18.000Z
      //const dtcDate = new Date(parseInt(this.timestamp) * 1000)

      //Post method to send the downtime message to the backend
       const requestDataDtm = {

        //dtmComment: this.sanitizer.bypassSecurityTrustHtml(this.commentInput),
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
        console.log('Downtime Message saved successfully.');
        // alert('Downtime Message saved successfully.' + '\n' + 'MediaType: ' + this.mediaType );
        let dialogRef = this.dialog.open(ModalComponent,  { disableClose: true });
      }, (error) => {
        console.error('Error while saving Downtime Message:', error);
      }); 
    }
}