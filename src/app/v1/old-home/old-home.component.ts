import { Component, ViewChild } from '@angular/core';

import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-home',
    imports: [MatGridListModule, MatCardModule, MatTooltipModule, MatButtonModule, ClipboardModule],
    templateUrl: './old-home.component.html',
    styleUrl: './old-home.component.css'
})


export class OldHomeComponent{

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
