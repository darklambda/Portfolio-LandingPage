import { Component, ViewChild } from '@angular/core';

import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-home',
    imports: [MatGridListModule, MatCardModule, MatTooltipModule, MatButtonModule, ClipboardModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})


export class HomeComponent{

  email: string = 'gonzalo.oberreuter@gmail.com'

  @ViewChild("myTooltip") myTooltip!: MatTooltip;

  public displayTooltip(){
    this.myTooltip.disabled = false;
    this.myTooltip.show()
    setTimeout(() => {
      this.myTooltip.disabled = true;
    }, 1000);
  }

}
