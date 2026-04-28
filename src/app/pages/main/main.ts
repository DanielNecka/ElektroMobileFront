import { Component } from '@angular/core';
import { Map } from '../../components/map/map/map';
import { SearchBar } from "../../components/search-bar/search-bar";
import { Details } from "../../components/details/details/details";

@Component({
  selector: 'app-main',
  imports: [Map, SearchBar, Details],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main {

}
