import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  DxDataGridModule, DxButtonModule, DxTextBoxModule, DxSelectBoxModule,
} from 'devextreme-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DxDataGridModule,
    DxButtonModule,
    DxTextBoxModule,
    DxSelectBoxModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
