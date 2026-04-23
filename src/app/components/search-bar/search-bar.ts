import { Component } from '@angular/core';
import { IonSearchbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trashBin } from 'ionicons/icons';

@Component({
  selector: 'app-search-bar',
  imports: [IonSearchbar],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
})
export class SearchBar {

}
