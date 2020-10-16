import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { SourcesComponent } from './components/sources/sources.component';
import { RateService } from './services/rate.service';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatInputModule } from '@angular/material/input';
import { SumPipe } from './pipes/sum.pipe';

@NgModule({
  declarations: [
    AppComponent,
    SourcesComponent,
    SumPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatButtonModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    DragDropModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [
    RateService,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
