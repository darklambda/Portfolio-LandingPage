import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ProjectsComponent } from './projects/projects.component';
import { TrajectoryComponent } from './trajectory/trajectory.component';
import { AboutComponent } from './about/about.component';
import { PlotsComponent } from './plots/plots.component';
import { RPCameraComponent } from './rp-camera/rp-camera.component';
//import { OpenCVComponent } from './open-cv/open-cv.component';

export const routes: Routes = [
    {path: "", component: HomeComponent},
    {path: "projects", component: ProjectsComponent},
    //{path: "projects/openCV", component: OpenCVComponent},
    {path: "projects/plots", component: PlotsComponent},
    {path: "projects/rp-camera", component: RPCameraComponent},
    {path: "trajectory", component: TrajectoryComponent},
    {path: "about", component: AboutComponent},
    {path: "**", component: NotFoundComponent}

];
