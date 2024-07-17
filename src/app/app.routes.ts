import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ProjectsComponent } from './projects/projects.component';
import { TrajectoryComponent } from './trajectory/trajectory.component';
import { PlotsComponent } from './plots/plots.component';
import { RPCameraComponent } from './rp-camera/rp-camera.component';
import { OpenCVComponent } from './open-cv/open-cv.component';

export const routes: Routes = [
    {path: "", title: "Home", component: HomeComponent},
    {path: "projects", title: "Projects", component: ProjectsComponent},
    {path: "projects/openCV", title: "OpenCV", component: OpenCVComponent},
    {path: "projects/plots", title: "Plots", component: PlotsComponent},
    {path: "projects/rp-camera", title: "RP Camera", component: RPCameraComponent},
    {path: "trajectory", title: "Trajectory", component: TrajectoryComponent},
    {path: "**", title: "404", component: NotFoundComponent}

];
