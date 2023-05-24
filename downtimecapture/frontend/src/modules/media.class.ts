export class Media {
    mediaName: string;
    mediaTimeStamp: Date;
    MediaType: MediaTypeEnum;
    MediaFormat: MediaFormatEnum;
    mediaFile: any;
    //downtimeMessages: DowntimeMessage[];
  }


export enum MediaFormatEnum {
    FOTO = 'foto',
    VIDEO = 'video'
}


export enum MediaTypeEnum {
    AUFNAHME = 'aufnahme',
    GALERIE = 'galerie',
    STANDARD = 'standard'
}

