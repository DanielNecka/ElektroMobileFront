import { Component } from '@angular/core';
import { Map } from '../../components/map/map/map';
import { SearchBar } from "../../components/search-bar/search-bar";
import { Details } from "../../components/details/details/details";

@Component({
  selector: 'app-login',
  imports: [Map, SearchBar, Details],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

}
