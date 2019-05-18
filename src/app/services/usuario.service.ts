import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { async } from '@angular/core/testing';

import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';

import { environment } from 'src/environments/environment';

import { Usuario } from '../interfaces/interface';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  token: string = null;
  private usuario: Usuario ={};

  constructor( private http: HttpClient,
               private storage: Storage,
               private navCtrl: NavController) { }

               
// Funcion login
  login( email: string, password: string ) {

    const data = { email, password };

    return new Promise( resolve => {

      this.http.post(`${ URL }/user/login`, data)
      .subscribe( async resp => {
        console.log(resp);

        if ( resp['ok'] ) {
          await this.guardarToken( resp['token'] );
          resolve(true);
        } else {
          this.token = null;
          this.storage.clear();
          resolve(false);
        }
      });
    });
  }

  //Función logout
  logout(){
    this.token = null;
    this.usuario = null;
    this.storage.clear();
    this.navCtrl.navigateRoot('/login', { animated: true });
  }

  // Función para el registro de Usuarios
  registro( usuario: Usuario) {

    return new Promise( resolve => {

      this.http.post(`${ URL }/user/create`, usuario)
          .subscribe( async resp => {
            console.log(resp);

            if ( resp['ok'] ) {
              await this.guardarToken( resp['token'] );
              resolve(true);
            } else {
              this.token = null;
              this.storage.clear();
              resolve(false);
            }


          });
    });

  }

// Funcion para obtener el usuario, retornado un nuevo objeto, haciendo la destructurzcion del usuario
  getUsuario() {

    if ( !this.usuario._id ) {
      this.validaToken();
    }

    return { ...this.usuario};
  }


// Funcion para guardar token en el storage
  async guardarToken( token: string ) {

    this.token = token;
    await this.storage.set('token', token);

    await this.validaToken();

  }


  //Metodo para leer token del Storage
  async cargarToken() {

    this.token = await this.storage.get('token') || null;

  }


// Metodo para verificar token
async validaToken(): Promise<boolean> {

  await this.cargarToken();

  if ( !this.token ) {
    this.navCtrl.navigateRoot('/login');
    return Promise.resolve(false);
  }

  return new Promise<boolean>( resolve => {

    const headers = new HttpHeaders({
      'x-token': this.token
    });

    this.http.get(`${ URL }/user/`, { headers })
      .subscribe( resp => {

        if ( resp['ok'] ){
          this.usuario = resp['usuario'];
          resolve(true);
        } else {
          this.navCtrl.navigateRoot('/login');
          resolve(false);
        }
      });
  });
}

// Método para actualizar Usuario
  actualizarUsuario( usuario: Usuario ){

    const headers = new HttpHeaders({
      'x-token': this.token
    });

    return new Promise( resolve => {

      this.http.post(`${ URL }/user/update`, usuario, { headers })
      .subscribe( resp => {

        if ( resp['ok'] ) {
          this.guardarToken( resp['token'] );
          resolve(true);
        } else {
          resolve(false);
        }
      }); 
    });
    
  }

}
