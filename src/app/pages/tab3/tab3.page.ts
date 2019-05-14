import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Usuario } from 'src/app/interfaces/interface';
import { UiServiceService } from 'src/app/services/ui-service.service';

import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  usuario: Usuario = {};

  constructor(  private usuarioService: UsuarioService,
                private uiService: UiServiceService ) {}


  ngOnInit() {
    this.usuario = this.usuarioService.getUsuario();    
    //console.log(this.usuario);
  }
  

  async actualizar( fActualizar: NgForm) {

    if ( fActualizar.invalid ) { return; }

    const actualizado = await this.usuarioService.actualizarUsuario( this.usuario);

    if ( actualizado ) {
      // toast con el mensaje actualizado
      this.uiService.presentToast( 'Registro Actualizado');
    } else {
      // toast con el error
      this.uiService.presentToast( 'No se pudo actualizar');
    }
  }


  logout() {
    
  }
}