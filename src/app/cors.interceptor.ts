import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from './../environments/environment';

export const corsInterceptor: HttpInterceptorFn = (req, next) => {
  let request = req.clone({
    setHeaders: {
      'Access-Control-Allow-Origin': environment.API_URL
    }
  })
  return next(req);
};
