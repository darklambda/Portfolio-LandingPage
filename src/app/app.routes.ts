import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ProjectsComponent } from './projects/projects.component';
import { TrajectoryComponent } from './trajectory/trajectory.component';
import { AboutComponent } from './about/about.component';

export const routes: Routes = [
    {path: "", component: HomeComponent, data: { animation: 'HomePage' }},
    {path: "projects", component: ProjectsComponent, data: { animation: 'ProjectsPage' }},
    {path: "trajectory", component: TrajectoryComponent, data: { animation: 'TrajectoryPage' }},
    {path: "about", component: AboutComponent},
    {path: "**", component: NotFoundComponent}

];
