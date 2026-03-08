import { Routes } from '@angular/router';
import { UnderConstructionComponent } from './under-construction/under-construction.component';
import { HomeComponent } from './home/home.component';
import { OldLayoutComponent } from './v1/old-layout/old-layout.component';
import { OldHomeComponent } from './v1/old-home/old-home.component';
//import { NotFoundComponent } from './not-found/not-found.component';
import { ProjectsComponent } from './v1/projects/projects.component';
import { TrajectoryComponent } from './v1/trajectory/trajectory.component';
import { PlotsComponent } from './v1/plots/plots.component';
import { RPCameraComponent } from './v1/rp-camera/rp-camera.component';
import { OpenCVComponent } from './v1/open-cv/open-cv.component';

export const routes: Routes = [
    {path: "", title: "Home", component: HomeComponent},
    {path: "v1", component: OldLayoutComponent, children: [
        {path: "", title: "OldHome", component: OldHomeComponent},
        {path: "projects", title: "Projects", component: ProjectsComponent},
        {path: "projects/open-cv", title: "OpenCV", component: OpenCVComponent},
        {path: "projects/plots", title: "Plots", component: PlotsComponent},
        {path: "projects/rp-camera", title: "RP Camera", component: RPCameraComponent},
        {path: "trajectory", title: "Trajectory", component: TrajectoryComponent},
    ]},
    {path: "**", title: "Under Construction", component: UnderConstructionComponent}

];
