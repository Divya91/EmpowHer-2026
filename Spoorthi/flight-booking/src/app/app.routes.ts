import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { SearchResultsComponent } from './pages/search-results/search-results';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Default homepage
  { path: 'search', component: SearchResultsComponent },
  {
  path: 'bookings',
  loadComponent: () =>
    import('./pages/bookings/bookings').then(m => m.Bookings)
},
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }