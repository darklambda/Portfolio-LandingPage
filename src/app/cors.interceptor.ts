import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from './../environments/environment';

export const corsInterceptor: HttpInterceptorFn = (req, next) => {
  req = req.clone({
    setHeaders: {
      'Access-Control-Allow-Origin': '*'
    }
  })
  return next(req);
};
