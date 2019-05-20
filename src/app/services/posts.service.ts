import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';

import { environment } from 'src/environments/environment';

import { RespuestaPosts, Post } from '../interfaces/interface';

import { UsuarioService } from './usuario.service';


const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  paginaPosts = 0;

  nuevoPost = new EventEmitter<Post>();

  constructor( private http: HttpClient,
               private usuarioService: UsuarioService,
               private fileTransfer: FileTransfer ) { }

// Funcion para obtener los post
  getPosts( pull: boolean = false ) {
    if(pull){
      this.paginaPosts = 0;
    }
    this.paginaPosts ++;
    return this.http.get<RespuestaPosts>(`${ URL }/posts/?pagina=${ this.paginaPosts }`);
  }

  // Funcion para crear un nuevo post 
  crearPost( post ) {

    const headers = new HttpHeaders({
      'x-token': this.usuarioService.token
    });

    return new Promise( resolve => {

      this.http.post(`${ URL }/posts`, post, { headers })
      .subscribe( resp => {
  
        this.nuevoPost.emit( resp['post'] );
        resolve(true);
      });

    });
  }

  // Función para subir imágenes
  subirImagen( img: string ) {

    const options: FileUploadOptions = {
      fileKey: 'image',
      headers: {
        'x-token': this.usuarioService.token
      }
    };

    const fileTransfer: FileTransferObject = this.fileTransfer.create();

    fileTransfer.upload( img, `${ URL }/posts/upload`, options )
      .then( data => {
        console.log(data);
      }).catch( err => {
        console.log('error en carga', err);
      });
  }

}
