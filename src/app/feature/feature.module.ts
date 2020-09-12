import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaceAiService } from './face-ai.service';
import { VideoComponent } from './video/video.component';

@NgModule({
  declarations: [VideoComponent],
  imports: [CommonModule],
  providers: [FaceAiService],
  exports: [VideoComponent],
})
export class FeatureModule {}
