import {Component, Inject, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {WeaponsComponent} from "../weapons/weapons.component";
import {Router} from "@angular/router";
import {Weapon} from "../../entity.module";
import {CookieService} from "ngx-cookie-service";
import {ApplicationConfig, CONFIG_TOKEN} from "../../app-config";
import {ErrorDialogComponent} from "../../error-dialog/error-dialog.component";
import {MatDialog} from "@angular/material";
import {FormControl, Validators} from "@angular/forms";
@Component({
  selector: 'app-weapon-create',
  templateUrl: './weapon-create.component.html',
  styleUrls: ['./weapon-create.component.scss']
})
export class WeaponCreateComponent implements OnInit {

  cookie: boolean = false;
  nameFormControl: FormControl;
  rangeFormControl: FormControl;
  magazineFormControl: FormControl;
  type: string;

  constructor(private http: HttpClient,
              private cookieService: CookieService,
              private router: Router,
              private dialog: MatDialog,
              @Inject(CONFIG_TOKEN) private config: ApplicationConfig) {}

  ngOnInit() {
    this.cookie = this.cookieService.check('creatures-token');
    if (!this.cookie) {
      this.router.navigate(['/pa165/login']);
      this.dialog.open(ErrorDialogComponent, {
        width: '600px',
        data: ["User is not logged in."],
      });
      return;
    }
    this.nameFormControl = new FormControl('', [
      Validators.required,
    ]);
    this.rangeFormControl = new FormControl('', []);
    this.magazineFormControl = new FormControl('', []);
  }

  checkIfCookieExist(){
    if (!this.cookie){
      this.router.navigate(['/pa165/login']);
    }
  }

  createWeapon(name, weaponType, range, magazineCapacity){
    this.cookie = this.cookieService.check('creatures-token');
    this.checkIfCookieExist();
    var json = {"name": name,"type":weaponType, "range":range, "magazineCapacity":magazineCapacity};
    console.log(json);
    this.http.post<Weapon>(this.config.apiEndpoint + '/pa165/rest/auth/weapons/create', json, {withCredentials: true}).subscribe(
      data => {
        console.log("Creating weapon with name: " + name + ", type: " + weaponType + ", range: "+ range + "and magazine capacity: " + magazineCapacity + "was successful.");
        this.router.navigate(['/pa165/weapons']);
      }, error => {
        console.log("Error during creating weapon with name: " + name + ", type: " + weaponType + ", range: "+ range + "and magazine capacity: " + magazineCapacity + "was successful.");
      }
    )

  }
}
